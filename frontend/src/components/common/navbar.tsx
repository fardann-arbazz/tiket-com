import { motion } from "framer-motion";
import WalletConnectButton from "../auth/wallet-connect";
import { Link } from "react-router-dom";
import { useTiket } from "../../context/tiket-context";
import { Ticket } from "lucide-react";

const Navbar = () => {
  const { owner, walletAddress } = useTiket();

  const isOwner =
    owner &&
    walletAddress &&
    owner.toLowerCase() === walletAddress.toLowerCase();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b bg-black border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 flex items-center justify-center h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full">
              <Ticket className="text-purple-800" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              TiketCom
            </span>
          </motion.div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Events
            </Link>
            <Link
              to="/my-tickets"
              className="text-gray-300 hover:text-white transition-colors"
            >
              My Tickets
            </Link>
            {isOwner && (
              <Link
                to="/admin"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Wallet Connect */}
          <WalletConnectButton />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
