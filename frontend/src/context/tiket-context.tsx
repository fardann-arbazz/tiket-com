import { ethers } from "ethers";
import config from "../config/config.json";
import tiketABI from "../ABI/Tiket.json";
import { createContext, useContext, useEffect, useState } from "react";
import { uploadToIPFS } from "../services/ipfs-upload";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface TicketType {
  name: string;
  price: bigint;
  total: bigint;
  sold: bigint;
  uri: string;
}

interface TiketContextType {
  contract: ethers.Contract | null;
  readContract: ethers.Contract | null;
  ticketTypes: TicketType[];
  connectWallet: () => Promise<void>;
  buyTiket: (ticketId: number, price: bigint) => Promise<void>;
  getMyTickets: () => Promise<bigint[]>;
  getAllTicket: () => Promise<TicketType[]>;
  loading: boolean;
  error: string | null;
  owner: string | null;
  walletAddress: string | null;
  getTicketNft: (tokenId: bigint) => Promise<any>;
  getTicketType: (typeId: bigint) => Promise<any>;
  withdraw: (amount: number) => Promise<any>;
  getContractBalance: () => Promise<any>;
  addTicketType: (
    name: string,
    price: string,
    total: number,
    benefits: string[]
  ) => Promise<void>;
}

const TiketContext = createContext<TiketContextType | undefined>(undefined);

export const TiketProvider = ({ children }: { children: React.ReactNode }) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [readContract, setReadContract] = useState<ethers.Contract | null>(
    null
  );
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [owner, setOwner] = useState(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    const initReadOnly = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const readOnly = new ethers.Contract(
          config[31337].Tiket.address,
          tiketABI,
          provider
        );

        setProvider(provider);
        setReadContract(readOnly);
        await fetchTicketTypes(readOnly);
      } catch (error) {
        console.error("Error inisialisasi read-only contract", error);
        setError("Error inisialisasi contract");
      } finally {
        setLoading(false);
      }
    };

    initReadOnly();
  }, []);

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      setWalletAddress(address);

      const signer = await provider.getSigner();

      const writeContract = new ethers.Contract(
        config[31337].Tiket.address,
        tiketABI,
        signer
      );

      const owner = await writeContract.owner();
      setOwner(owner);

      setContract(writeContract);
    } catch (error) {
      console.error("Error connect wallet", error);
      setError("Error connect wallet");
    }
  };

  const fetchTicketTypes = async (
    contractInstance: ethers.Contract
  ): Promise<TicketType[]> => {
    const totalBigInt = await contractInstance.ticketTypeCounter();
    const total = Number(totalBigInt);

    const types: TicketType[] = [];
    for (let i = 0; i < total; i++) {
      const ticket = await contractInstance.ticketTypes(i);

      types.push({
        name: ticket.name,
        price: ticket.price,
        total: ticket.total,
        sold: ticket.sold,
        uri: ticket.uri,
      });
    }

    return types;
  };

  const buyTiket = async (ticketId: number, price: bigint) => {
    if (!contract) return;
    try {
      const tx = await contract.buyTiket(ticketId, { value: price });
      await tx.wait();
      await fetchTicketTypes(contract);
    } catch (error) {
      console.error("Error buying ticket:", error);
      throw error;
    }
  };

  const getMyTickets = async (): Promise<bigint[]> => {
    if (!contract) return [];
    try {
      const tickets: bigint[] = await contract.getMyTickets();

      return tickets;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return [];
    }
  };

  const getTicketNft = async (tokenId: bigint) => {
    if (!contract) return;
    return await contract.ticketNft(tokenId);
  };

  const getTicketType = async (typeId: bigint) => {
    if (!contract) return;
    return await contract.ticketTypes(typeId);
  };

  const getAllTicket = async (): Promise<TicketType[]> => {
    if (!readContract) {
      console.log("❌ readContract belum ada");
      return [];
    }

    try {
      const tickets = await fetchTicketTypes(readContract);
      setTicketTypes(tickets);
      return tickets;
    } catch (error) {
      console.error("❌ Error fetching all tickets:", error);
      return [];
    }
  };

  const withdraw = async (amount: number) => {
    if (!contract) return;

    const balance = await provider?.getBalance(contract.target as string);
    const parsedAmount = ethers.parseUnits((amount || 0).toString(), "ether");

    if (balance === undefined) {
      console.error("Unable to fetch contract balance");
      return;
    }

    if (parsedAmount > balance) {
      console.error("The amount exceeds the contract balance");
      return;
    }

    try {
      const tx = await contract.withdraw(parsedAmount);
      await tx.wait();
    } catch (error) {
      console.log("error", error);
    }
  };

  const getContractBalance = async (): Promise<string> => {
    const balance = await provider?.getBalance(contract?.target as string);

    if (!balance) {
      console.log("Saldo contract 0....");
      return "0";
    }

    return ethers.formatEther(balance);
  };

  const addTicketType = async (
    name: string,
    price: string,
    total: number,
    benefits: string[]
  ) => {
    if (!contract) return;

    const metadata = { benefits };

    const ipfsURI = await uploadToIPFS(metadata, name);

    if (!ipfsURI) {
      console.error("Failed to upload ipfs");
      return;
    }

    try {
      const tx = await contract.addTicket(
        name,
        ethers.parseEther(price),
        total,
        ipfsURI
      );
      await tx.wait();
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if (!window.ethereum) {
      console.warn("Window.ethereum tidak tersedia.");
      return;
    }

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletAddress(null);
        setContract(null);
        setOwner(null);
      } else {
        await connectWallet();
      }
    };

    const handleChainChanged = () => window.location.reload();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <TiketContext.Provider
      value={{
        contract,
        owner,
        walletAddress,
        getContractBalance,
        addTicketType,
        readContract,
        withdraw,
        connectWallet,
        ticketTypes,
        getTicketNft,
        getTicketType,
        buyTiket,
        getMyTickets,
        getAllTicket,
        loading,
        error,
      }}
    >
      {children}
    </TiketContext.Provider>
  );
};

export const useTiket = (): TiketContextType => {
  const context = useContext(TiketContext);
  if (!context) {
    throw new Error("useTiket must be used within a TiketProvider");
  }
  return context;
};
