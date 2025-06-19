import { motion } from "framer-motion";
import { useState } from "react";
import WalletModal from "./wallet-modal";
import { useTiket } from "../../context/tiket-context"; // ganti path sesuai project kamu

const WalletConnectButton = () => {
  const { connectWallet, contract, walletAddress } = useTiket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = !!contract;

  const handleConnect = async (connector: string) => {
    if (connector !== "metamask") {
      alert("Saat ini hanya MetaMask yang didukung");
      return;
    }

    if (isConnecting) return;
    setIsConnecting(true);

    try {
      await connectWallet();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Gagal connect wallet:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    window.location.reload(); // bisa diganti dengan logic custom
  };

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <>
      <motion.button
        disabled={isConnecting}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={isConnected ? handleDisconnect : () => setIsModalOpen(true)}
        className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium ${
          isConnected
            ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white"
            : "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
        } shadow-lg`}
      >
        {isConnected && walletAddress ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {shortenAddress(walletAddress)}
          </div>
        ) : (
          "Connect Wallet"
        )}
      </motion.button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnect}
        isConnecting={isConnecting}
      />
    </>
  );
};

export default WalletConnectButton;
