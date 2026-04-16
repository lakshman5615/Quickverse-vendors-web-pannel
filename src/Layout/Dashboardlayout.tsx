import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import IncomingOrderModal from "../components/modals/IncomingOrderModal";
import { useOrderCall } from "../hooks/useOrderCall";
import { useOrderWebSocket } from "../hooks/useOrderWebsocket";
import type { Order } from "../types/order";

// TODO TONIGHT: Replace with actual SmartBiz URL from backend
const SMARTBIZ_BASE_URL = "https://your-smartbiz-url.com";

const Layout = () => {
  const { activeOrder, triggerIncomingOrder, clearOrder } = useOrderCall();

  // WebSocket: connects on mount, auto-reconnects on drop, disconnects on logout
  useOrderWebSocket(triggerIncomingOrder);

  const handleViewOrder = (order: Order) => {
    clearOrder();
    window.open(`${SMARTBIZ_BASE_URL}/orders/${order.id}`, "_blank");
  };

  return (
    <main className="h-screen bg-zinc-950 p-4">
      <div className="flex h-full gap-4">
        <Sidebar />

        <section className="h-full w-[85%] rounded-xl border border-zinc-800 bg-zinc-900">
          <Navbar />

          <div className="h-[90%] overflow-y-auto p-5">
            <Outlet />
          </div>
        </section>
      </div>

      {/* Order notification modal - lives at Layout level so it persists across all pages */}
      {activeOrder && (
        <IncomingOrderModal
          order={activeOrder}
          onViewORder={handleViewOrder}
        />
      )}
    </main>
  );
};

export default Layout;