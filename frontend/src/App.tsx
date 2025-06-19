import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventPage from "./pages/event-page";
import AdminPage from "./pages/admin-page";
import NotFound from "./pages/404";
import MyTickets from "./pages/my-tickets";
import Navbar from "./components/common/navbar";
import Footer from "./components/common/footer";
import { TiketProvider } from "./context/tiket-context";
import { ToastProvider } from "./components/ui/toast";

const App = () => {
  return (
    <ToastProvider>
      <TiketProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<EventPage />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Router>
      </TiketProvider>
    </ToastProvider>
  );
};

export default App;
