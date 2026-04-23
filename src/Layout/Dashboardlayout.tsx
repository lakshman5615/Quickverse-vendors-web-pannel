import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useOrderWebSocket } from "../hooks/useOrderWebsocket";
import { useOrderStore } from "../stores/useOrderStore"; // 

const Layout = () => {
  // 1. Initialize WebSocket (No arguments needed now)
  const isConnected = useOrderWebSocket();
  
  // 2. Get incoming orders and viewed status from the store to manage sound
  const incomingOrders = useOrderStore((state) => state.incomingOrders);
  const viewedOrderIds = useOrderStore((state) => state.viewedOrderIds);
  
  // 3. Audio Setup
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio instance once
    audioRef.current = new Audio("/Alert_ringtone.mp3");
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    // Check if there is at least one order that hasn't been viewed yet
    const hasUnviewedOrders = incomingOrders.some(order => !viewedOrderIds.has(order.orderId));

    //  Play sound if there are UNVIEWED orders, stop if all are viewed (or list is empty)
    if (hasUnviewedOrders && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio blocked by browser:", e));
    } else if (!hasUnviewedOrders && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [incomingOrders, viewedOrderIds]);

  return (
    <main className="h-screen bg-zinc-950 p-4">
      <div className="flex h-full gap-4">
        {/* Sidebar stays exactly same */}
        <Sidebar />

        <section className="h-full w-[85%] rounded-xl border border-zinc-800 bg-zinc-900">
          <Navbar isConnected={isConnected} />

          <div className="h-[90%] overflow-y-auto p-5">
            {/* Dashboard grid will render here via Outlet */}
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
