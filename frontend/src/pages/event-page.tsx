import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EventHeader from "../components/tickets/event-header";
import TicketTypeSelector from "../components/tickets/tickets-type-selector";
import WalletConnectButton from "../components/auth/wallet-connect";
import { useTiket } from "../context/tiket-context";
import { ethers } from "ethers";
import imgEvent from "../assets/web3-summit.png";
import { useToast } from "../components/ui/toast";

// Dummy data
const eventData = {
  id: 1,
  name: "Web3 Future Summit 2025",
  description:
    "Join the most anticipated Web3 event of the year featuring top speakers, workshops, and networking opportunities in the blockchain space.",
  image: imgEvent,
  date: "16 Agustus 2025",
  location: "Virtual Event",
  category: "Conference",
};

export type TicketType = {
  id: number;
  name: string;
  price: string;
  total: number;
  sold: number;
  remaining: number;
  benefits: string[];
};

const EventPage = () => {
  const { getAllTicket, buyTiket, contract, readContract } = useTiket();

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!contract;
  const { showToast } = useToast();

  const resolveIPFS = (uri: string) => {
    return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  };

  const SOLD_TIKET_ALL: number = ticketTypes.reduce(
    (sum: number, t: TicketType) => sum + t.sold,
    0
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!readContract) return;

      setLoading(true);
      setError(null);
      try {
        const data = await getAllTicket();
        console.log(data);

        const enriched = await Promise.all(
          data.map(async (ticket: any, i: number) => {
            const uri = ticket.uri;
            try {
              const res = await fetch(resolveIPFS(uri));
              const json = await res.json();
              console.log(json);

              return {
                ...ticket,
                id: i,
                name: ticket.name,
                price: Number(ethers.formatEther(ticket.price)).toFixed(3), // atau 4, 5 sesuai kebutuhan
                sold: Number(ticket.sold),
                total: Number(ticket.total),
                remaining: Number(ticket.total) - Number(ticket.sold),
                benefits: json.benefits || [],
              };
            } catch (error) {
              console.error("Failed to fetch IPFS metadata", error);
              return {
                ...ticket,
                name: ticket.name,
                price: Number(ethers.formatEther(ticket.price)).toFixed(3), // atau 4, 5 sesuai kebutuhan
                sold: Number(ticket.sold),
                total: Number(ticket.total),
                remaining: Number(ticket.total) - Number(ticket.sold),
                benefits: [],
              };
            }
          })
        );

        setTicketTypes(enriched);
      } catch (err) {
        console.error("❌ Failed to fetch tickets", err);
        setError("Failed to load tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [readContract]);

  const handleBuyTicket = async () => {
    if (!isConnected || !selectedTicket) return;

    try {
      setIsBuying(true);
      const ethValue = ethers.parseEther(selectedTicket.price.toString());
      await buyTiket(selectedTicket.id, ethValue);

      showToast({
        message: `Successfully purchased ${selectedTicket.name} ticket!`,
        type: "success",
      });

      setSelectedTicket(null);

      // Refresh tickets after purchase
      const data = await getAllTicket();
      const formatted = await Promise.all(
        data.map(async (ticket: any, i: number) => {
          let benefits: string[] = [];
          try {
            const uri = ticket.uri;
            const res = await fetch(resolveIPFS(uri));
            const json = await res.json();
            benefits = json.benefits || [];
          } catch (error) {
            benefits = [];
          }
          return {
            id: i,
            name: ticket.name,
            price: Number(ethers.formatEther(ticket.price)).toFixed(3), // atau 4, 5 sesuai kebutuhan
            total: Number(ticket.total),
            sold: Number(ticket.sold),
            remaining: Number(ticket.total - ticket.sold),
            benefits,
          };
        })
      );

      setTicketTypes(formatted);
    } catch (error) {
      showToast({
        message: "Error buying ticktet",
        type: "error",
      });
      console.error(error);
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventHeader soldTiket={SOLD_TIKET_ALL} event={eventData} />

        {/* Main Content Area */}
        <div className="mt-12 flex flex-col lg:flex-row gap-8">
          {/* Ticket Selection - Left Side */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
                <p className="text-red-400">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-700 rounded-lg hover:bg-red-600 transition"
                >
                  Retry
                </button>
              </div>
            ) : ticketTypes.length === 0 ? (
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400">No tickets available</p>
              </div>
            ) : (
              <TicketTypeSelector
                ticketTypes={ticketTypes}
                selectedType={selectedTicket}
                onSelect={setSelectedTicket}
              />
            )}
          </div>

          {/* Checkout Panel - Right Side */}
          <div className="lg:w-96">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Order Summary</h3>
                {isConnected && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs text-green-400">Connected</span>
                  </div>
                )}
              </div>

              {selectedTicket ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Ticket</span>
                      <span className="font-medium">{selectedTicket.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Price</span>
                      <span className="font-bold text-lg text-emerald-400">
                        {selectedTicket.price} ETH
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-400">Available</span>
                      <span>
                        {selectedTicket.remaining} of {selectedTicket.total}
                      </span>
                    </div>
                  </div>

                  {isConnected ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyTicket}
                      disabled={isBuying}
                      className={`w-full cursor-pointer py-3 rounded-lg font-medium ${
                        isBuying
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      } text-white shadow-lg transition-all`}
                    >
                      {isBuying ? (
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
                        "Confirm Purchase"
                      )}
                    </motion.button>
                  ) : (
                    <WalletConnectButton />
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  <p className="mt-3 text-gray-400">
                    Select a ticket to continue
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventPage;
