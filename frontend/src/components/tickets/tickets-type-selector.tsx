import { motion } from "framer-motion";
import ProgressBar from "../ui/progress-bar";

export interface TicketType {
  id: number;
  name: string;
  price: string;
  sold: number;
  total: number;
  remaining: number;
  benefits: string[];
}

interface TicketTypeSelectorProps {
  ticketTypes: TicketType[];
  selectedType: TicketType | null;
  onSelect: (ticket: TicketType) => void;
}

const TicketTypeSelector = ({
  ticketTypes,
  selectedType,
  onSelect,
}: TicketTypeSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Available Tickets
        </h3>
        <span className="text-sm text-gray-400">
          {ticketTypes.length} options
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ticketTypes.map((ticket: any) => (
          <motion.div
            key={ticket.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(ticket)}
            className={`p-6 rounded-xl border cursor-pointer transition-all ${
              selectedType?.id === ticket.id
                ? "border-emerald-500 bg-gray-800/50 shadow-lg shadow-emerald-500/10"
                : "border-gray-700 hover:border-gray-600 bg-gray-800/30 hover:bg-gray-800/50"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg">{ticket.name}</h4>
              <div className="flex items-center gap-1 text-xs px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
                <span>{ticket.remaining}</span>
                <span>left</span>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-gray-400 text-sm mb-1">Price</p>
              <p className="text-2xl font-bold text-emerald-400">
                {ticket.price} ETH
              </p>
            </div>

            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Tickets sold</span>
                <span>
                  {ticket.sold} / {ticket.total}
                </span>
              </div>
              <ProgressBar
                value={(ticket.sold / ticket.total) * 100}
                className="h-2 bg-gray-700 rounded-full"
                indicatorClass="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
              />
            </div>

            {ticket.benefits.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-2">Includes:</p>
                <ul className="space-y-2">
                  {ticket.benefits.map((benefit: any, i: any) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TicketTypeSelector;
