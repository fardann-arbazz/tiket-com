import { AnimatePresence, motion } from "framer-motion";

const WalletModal = ({ isOpen, onClose, onConnect, isConnecting }: any) => {
  const wallets = [
    {
      name: "MetaMask",
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
      connector: "metamask",
    },
    {
      name: "WalletConnect",
      icon: "https://avatars.githubusercontent.com/u/37784886?s=200&v=4",
      connector: "walletconnect",
    },
    {
      name: "Coinbase Wallet",
      icon: "https://pbs.twimg.com/profile_images/1499783051974303748/sm3dkwbI_400x400.png",
      connector: "coinbase",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 h-screen bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
              <button
                onClick={onClose}
                className="text-gray-400 cursor-pointer hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {wallets.map((wallet) => (
                <motion.button
                  disabled={isConnecting}
                  key={wallet.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onConnect(wallet.connector)}
                  className="w-full flex cursor-pointer items-center gap-4 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium text-white">
                    {isConnecting ? "Connecting.." : wallet.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;
