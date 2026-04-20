import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import IncomingOrderModal from "../components/modals/IncomingOrderModal";
import { useOrderCall } from "../hooks/useOrderCall";
import { useOrderWebSocket } from "../hooks/useOrderWebsocket";
import type { Order } from "../types/order";

const SMARTBIZ_BASE_URL = "https://your-smartbiz-url.com";

const Layout = () => {
  const { activeOrder, triggerIncomingOrder, clearOrder } = useOrderCall();

  // ✅ correct usage
 const isConnected =  useOrderWebSocket(triggerIncomingOrder);

  const handleViewOrder = (order: Order) => {
    clearOrder();
    window.open(`${SMARTBIZ_BASE_URL}/orders/${order.id}`, "_blank");
  };

  return (
    <main className="h-screen bg-zinc-950 p-4">
      <div className="flex h-full gap-4">
        <Sidebar />

        <section className="h-full w-[85%] rounded-xl border border-zinc-800 bg-zinc-900">
          <Navbar isConnected ={isConnected}/>

          <div className="h-[90%] overflow-y-auto p-5">
            <Outlet />
          </div>
        </section>
      </div>

      {activeOrder && (
        <IncomingOrderModal
          order={activeOrder}
          onViewOrder ={handleViewOrder} 
        />
      )}
    </main>
  );
};

export default Layout;