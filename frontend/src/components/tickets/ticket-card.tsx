import { motion } from "framer-motion";

const TicketCard = ({ ticket }: any) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={ticket.eventImage}
          alt={ticket.eventName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-bold text-lg">{ticket.eventName}</h3>
          <p className="text-gray-300 text-sm">{ticket.date}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400">{ticket.typeName}</span>
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            Purchased
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white font-bold">{ticket.price} ETH</span>
          <div className="flex gap-2">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm">
              Transfer
            </button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
              View
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TicketCard;
