import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import WalletConnectButton from "../components/auth/wallet-connect";
import { useTiket } from "../context/tiket-context";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";

const mockTickets = [
  {
    id: 101,
    ticketTypeId: 2,
    name: "Web3 Conference 2023",
    purchaseDate: "2023-09-15T14:30:00",
    price: "0.5",
    status: "active",
  },
  {
    id: 102,
    ticketTypeId: 1,
    name: "NFT Art Exhibition",
    ticketName: "BASIC",
    purchaseDate: "2023-08-22T09:15:00",
    price: "0.05",
    status: "used",
  },
];

type MyTiket = {
  id: number;
  name: string;
  price: number;
  total: number;
  sold: number;
  status: string;
};

const MyTickets = () => {
  const { contract, getMyTickets } = useTiket();
  const isConnected = !!contract;
  const [myTickets, setMyTickets] = useState<MyTiket[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getMyTiket = async () => {
    if (!contract) return;

    try {
      const tiketIds = await getMyTickets();

      const parsedTickets = await Promise.all(
        tiketIds.map(async (tokenId: bigint) => {
          const nftData = await contract.ticketNft(tokenId);
          const ticketTypeData = await contract.ticketTypes(nftData.typeId);

          return {
            id: Number(tokenId),
            name: ticketTypeData.name,
            price: ticketTypeData.price,
            total: Number(ticketTypeData.total),
            sold: Number(ticketTypeData.sold),
            status: "active",
          };
        })
      );

      setMyTickets(parsedTickets);
    } catch (err) {
      console.error("Failed to fetch ticket data:", err);
    }
  };

  useEffect(() => {
    if (contract) {
      getMyTiket();
    }
  }, [contract]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              My Tickets
            </h1>
            <p className="text-gray-400 mt-2">Your purchased event tickets</p>
          </div>
        </div>

        {!isConnected ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet to view your purchased tickets
            </p>
            <WalletConnectButton />
          </div>
        ) : mockTickets.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">No Tickets Found</h2>
            <p className="text-gray-400 mb-6">
              You haven't purchased any tickets yet
            </p>
            <a
              href="/events"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Browse Events
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                whileHover={{ scale: 1.01 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Ticket Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">
                          Web3 Future Summit 2025
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            ticket.status === "active"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {ticket.status === "active" ? "Active" : "Used"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                            />
                          </svg>
                          <span>{ticket.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>16 Agustus 2025, 09:00 WIB</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-end gap-4">
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Price Paid</p>
                        <p className="text-xl font-bold text-emerald-400">
                          {ethers.formatEther(ticket.price)} ETH
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="mt-6 pt-6 border-t border-gray-800 flex justify-center">
                    <div className="bg-white p-3 rounded-lg">
                      <QRCodeCanvas
                        value={`http://localhost:5173/ticket/${ticket.id}`}
                        size={150}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
