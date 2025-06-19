import { useEffect, useState } from "react";
import AdminPanel from "../components/admin/admin-pannel";
import TicketTypeForm from "../components/admin/ticket-type-form";
import { useTiket } from "../context/tiket-context";
import { ethers } from "ethers";

// Dummy data
const eventData = {
  id: 1,
  name: "Web3 Future Summit 2025",
  date: "Agustus 16, 2025",
};

const AdminPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { getAllTicket, readContract, owner } = useTiket();
  const [allTickets, setAllTickets] = useState<any[]>([]);

  useEffect(() => {
    if (!owner) {
      window.location.href = "/";
    }
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [readContract]);

  const fetchTickets = async () => {
    if (!readContract) return;

    try {
      const data = await getAllTicket();
      const enriched = await Promise.all(
        data.map(async (ticket: any, i: number) => {
          try {
            return {
              ...ticket,
              id: i,
              name: ticket.name,
              price: Number(ethers.formatEther(ticket.price)).toFixed(3), // atau 4, 5 sesuai kebutuhan
              total: Number(ticket.total),
              sold: Number(ticket.sold),
              remaining: Number(ticket.total) - Number(ticket.sold),
            };
          } catch (error) {
            console.error("Failed to fetch");
            return {
              ...ticket,
              id: i,
              name: ticket.name,
              price: Number(ethers.formatEther(ticket.price)).toFixed(3),
              total: Number(ticket.total),
              sold: Number(ticket.sold),
              remaining: Number(ticket.total) - Number(ticket.sold),
            };
          }
        })
      );

      setAllTickets(enriched);
    } catch (error) {
      console.error("error load tickets");
    }
  };

  useEffect(() => {
    if (!readContract) return;

    const onTicketAdd = (
      ticketId: any,
      name: string,
      price: any,
      total: any,
      sold: any,
      uri: string
    ) => {
      setAllTickets((prev) => {
        const exists = prev.some(
          (ch) => ch.id.toString() === ticketId.toString()
        );
        if (exists) return prev;

        return [
          ...prev,
          {
            id: Number(ticketId),
            name,
            price: Number(price) / 1e18,
            total: Number(total),
            sold: Number(sold),
            uri,
            remaining: Number(total) - Number(sold),
          },
        ];
      });
    };

    readContract.on("AddTicket", onTicketAdd);

    return () => {
      readContract.off("AddTicket", onTicketAdd);
    };
  }, [readContract]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {showForm ? (
            <TicketTypeForm
              fetchTicket={fetchTickets}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <AdminPanel
              event={eventData}
              tickets={allTickets}
              onAddTicketType={() => setShowForm(true)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
