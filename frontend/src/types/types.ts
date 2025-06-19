export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  organizer?: string;
  availableTickets: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  avatar: string;
  rating: number;
}

export type TicketType = {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  quota: number;
  sold: number;
  type: "regular" | "vip" | "premium";
  saleEnd?: string;
};
