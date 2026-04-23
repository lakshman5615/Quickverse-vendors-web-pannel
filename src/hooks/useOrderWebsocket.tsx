import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { Order } from "../types/order";
import { useAuthStore } from "../stores/useAuthStore";
import { useOrderStore } from "../stores/useOrderStore"; // ✅ Added
import {toast} from 'react-hot-toast';
import { CheckCircle , XCircle } from 'lucide-react';
// ✅ Validator for new orders
const isValidOrder = (data: unknown): data is Order => {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.orderId === "string" &&
    typeof obj.totalOrderAmount === "string" &&
    typeof obj.totalQuantity === "string" &&
    typeof obj.orderDescription === "string" &&
    Array.isArray(obj.orderItems)
  );
};

// ── WebSocket Hook ───────────────────────────────────────
export const useOrderWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const jwt = useAuthStore((state) => state.jwt);
  const shopId = useAuthStore((state) => state.shopId);
  const { addOrder, removeOrder } = useOrderStore(); // 

  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!jwt || !shopId) {
      console.log("STOMP: Missing auth, skipping");
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("/ws"), // 
      debug: (str) => console.log("STOMP:", str),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
      onConnect: () => {
        setIsConnected(true);
        console.log("✅ Connected to STOMP");

        
        const topic = `/topic/vendor/${shopId}`;
        console.log("📡 Subscribing to:", topic);

        client.subscribe(topic, (message) => {
          try {
            const data = JSON.parse(message.body);
          
            console.log("🔔 WebSocket Message received:", data);

           
            // If the backend sends an update saying it's Accepted or Rejected, remove it from grid
            if (data.status === "ACCEPTED") {
              removeOrder(data.orderId);
              toast.success(`${data.orderId} : Order Accepted`, {
                icon: <CheckCircle className="text-emerald-500 w-6 h-6" />,
                className: "bg-white text-black font-bold p-4 rounded-xl shadow-[0_4px_20px_rgba(59,130,246,0.15)]",
              });
            } 
            else if (data.status === "REJECTED") {
              removeOrder(data.orderId);
              toast.error(`${data.orderId} : Order Rejected`, {
                icon: <XCircle className="text-rose-500 w-6 h-6" />,
                className: "bg-white text-black font-bold p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)]",
              });
            }

            // 2. Check for New Incoming Orders
            else if (isValidOrder(data)) {
              console.log("➕ New Incoming Order added to grid:", data.orderId);
              addOrder(data);
            }
          } catch (e) {
            console.error("Parse error:", e);
          }
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame);
        setIsConnected(false);
      },

      onWebSocketError: (err) => {
        console.error("❌ WS error:", err);
        setIsConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
        console.log("❌ WebSocket Disconnected");
        setIsConnected(false);
      }
    };
  }, [jwt, shopId, addOrder, removeOrder]);

  return isConnected;
};
