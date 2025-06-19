import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import WithdrawModal from "./withdraw-modal";
import { useTiket } from "../../context/tiket-context";

interface Ticket {
  id: string | number;
  name: string;
  price: number;
  sold: number;
  remaining: number;
}

interface Event {
  date: string;
}

interface AdminPanelProps {
  event: Event;
  onAddTicketType: () => void;
  tickets: Ticket[];
}

const AdminPanel = ({ event, onAddTicketType, tickets }: AdminPanelProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [contractBalance, setContractBalance] = useState<string>("0");

  const { getContractBalance } = useTiket();

  const SOLDTIKETALL: number = tickets.reduce(
    (sum: number, t: Ticket) => sum + t.sold,
    0
  );

  const REVENUE = tickets.reduce(
    (sum: number, t: Ticket) => sum + t.price * t.sold,
    0
  );

  const reloadBalance = async () => {
    const balance = await getContractBalance();
    setContractBalance(balance);
  };

  useEffect(() => {
    reloadBalance();
  }, []);

  return (
    <>
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Event Management</h2>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddTicketType}
              className="bg-gradient-to-r cursor-pointer from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg"
            >
              Add Ticket Type
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r cursor-pointer from-purple-700 to-purple-800 text-white px-4 py-2 rounded-lg"
            >
              Withdraw
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">Total Tickets Sold</h3>
            <p className="text-2xl font-bold">{SOLDTIKETALL}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold">{REVENUE} ETH</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">Event Date</h3>
            <p className="text-2xl font-bold">{event.date}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Ticket Types</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Sold</th>
                  <th className="pb-3">Remaining</th>
                  <th className="pb-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket: any) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="py-4">{ticket.name}</td>
                    <td>{ticket.price} ETH</td>
                    <td>{ticket.sold}</td>
                    <td>{ticket.remaining}</td>
                    <td className="font-medium">
                      {ticket.price * ticket.sold} ETH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <WithdrawModal
          balance={contractBalance}
          onClose={() => setShowModal(false)}
          onSuccess={reloadBalance}
        />
      )}
    </>
  );
};

export default AdminPanel;
