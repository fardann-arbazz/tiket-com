import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTiket } from "../../context/tiket-context";
import { useToast } from "../ui/toast";

interface WithdrawModalProps {
  balance: number | string;
  onClose: () => void;
  onSuccess: () => void;
}

const WithdrawModal = ({ balance, onClose, onSuccess }: WithdrawModalProps) => {
  const [amount, setAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { showToast } = useToast();
  const { withdraw } = useTiket();

  const handleWithdraw = async () => {
    setIsWithdrawing(true);

    try {
      await withdraw(Number(amount));
      showToast({
        message: "Success withdraw",
        type: "success",
      });

      setAmount("");
      onSuccess();
    } catch (error) {
      console.log("Error", error);
      showToast({
        message: "Error withdraw",
        type: "error",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Withdraw Funds</h3>
              <button
                onClick={onClose}
                className="text-gray-400 cursor-pointer hover:text-white transition-colors"
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
            <p className="text-gray-400 mt-1">
              Transfer event revenue to your wallet
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {/* Available Balance */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Available Balance</span>
                <span className="text-xl font-bold text-emerald-400">
                  {balance ?? 0} ETH
                </span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">
                Amount to Withdraw (ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                  max={balance}
                />
                <button
                  onClick={() => setAmount(balance.toString())}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1 rounded"
                >
                  Max
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isWithdrawing}
                className="flex-1 cursor-pointer py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: isWithdrawing ? 1 : 1.02 }}
                whileTap={{ scale: isWithdrawing ? 1 : 0.98 }}
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className={`flex-1 cursor-pointer py-3 rounded-lg font-medium ${
                  isWithdrawing
                    ? "bg-purple-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                } text-white transition-all`}
              >
                {isWithdrawing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Confirm Withdrawal"
                )}
              </motion.button>
            </div>
          </div>

          {/* Transaction Details (would show after successful transaction) */}
          {/* <div className="p-4 bg-gray-800/50 border-t border-gray-800 text-sm">
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Network Fee</span>
              <span>0.0012 ETH</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">You'll Receive</span>
              <span className="font-medium">0.9988 ETH</span>
            </div>
          </div> */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WithdrawModal;
