import { motion } from "framer-motion";
import { useState } from "react";
import { useTiket } from "../../context/tiket-context";
import { useToast } from "../ui/toast";

const TicketTypeForm = ({ onCancel, fetchTicket }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    total: "",
    benefits: "Free drink\nPriority seat",
  });

  const { addTicketType } = useTiket();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      !formData.name ||
      !formData.price ||
      !formData.total ||
      formData.benefits.length === 0
    ) {
      throw new Error("Please fill in all required fields");
    }

    const benefitsArray = formData.benefits
      .split(/[\n,]/)
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    try {
      await addTicketType(
        formData.name,
        formData.price,
        Number(formData.total),
        benefitsArray
      );

      showToast({
        message: "Successfully added ticket",
        type: "success",
      });

      fetchTicket();
      onCancel();
    } catch (error) {
      console.log("error", error);
      showToast({
        message: "Failed add ticket",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
    >
      <h2 className="text-2xl font-bold mb-6">Add New Ticket Type</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Ticket Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Price (ETH)</label>
            <input
              type="text"
              name="price"
              pattern="^\d+(\.\d{1,18})?$"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Total</label>
            <input
              type="number"
              name="total"
              value={formData.total}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Benefits (comma separated)
          </label>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                benefits: e.target.value,
              }))
            }
            placeholder={`Free drink\nPriority seat\nMeet & Greet`}
            rows={5}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="px-6 py-2 cursor-pointer rounded-lg border border-gray-700 text-gray-300 hover:text-white"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 cursor-pointer rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white"
          >
            {isLoading ? "Loading..." : "Create Ticket Type"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default TicketTypeForm;
