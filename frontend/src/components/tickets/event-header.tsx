import { motion } from "framer-motion";
import Countdown from "../ui/countdown";

const EventHeader = ({ event, soldTiket }: any) => {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent z-10" />

      {/* Event Image */}
      <img
        src={event.image}
        alt={event.name}
        className="w-full h-64 md:h-[500px] object-cover object-center"
      />

      {/* Event Info */}
      <div className="relative z-20 p-6 md:p-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-full backdrop-blur-sm shadow-sm">
              {event.category}
            </span>
            <span className="text-gray-300 text-sm">
              {event.date} • {event.location}
            </span>
          </div>

          <h1 className="text-xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {event.name}
          </h1>
          <p className="text-gray-300 mb-6 max-w-2xl text-base leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Countdown targetDate="2025-08-16T09:00:00" />

            <div className="flex items-center gap-2 bg-gray-900/80 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-700 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-gray-300">
                {soldTiket} tickets sold
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventHeader;
