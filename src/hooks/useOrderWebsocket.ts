import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { Order } from "../types/order";
import { useAuthStore } from "../stores/useAuthStore";



const BASE_URL = "";

// ✅ validator stays same
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
export const useOrderWebSocket = (
  onNewOrder: (order: Order) => void,
) => {
 (window as any).triggerTestOrder = onNewOrder; // testing only 

  const [isConnected, setIsConnected] = useState(false);
  const jwt = useAuthStore((state) => state.jwt);
  const shopId = useAuthStore((state) => state.shopId);

  const clientRef = useRef<Client | null>(null);
  const onNewOrderRef = useRef(onNewOrder);
  onNewOrderRef.current = onNewOrder;

  // ── Effect: WebSocket Connection ───────────────────────

  useEffect(() => {

    if (!jwt || !shopId) {
      console.log("STOMP: Missing auth, skipping");
      return;
    }

    const client = new Client({
      // webSocketFactory: () => new SockJS(BASE_URL + "/ws"),
      webSocketFactory: () => new SockJS("/ws"),

      debug: (str) => console.log("STOMP:", str),

      reconnectDelay: 5000,

      connectHeaders: {
        Authorization: `Bearer ${jwt}`,
      },

      onConnect: () => {
        setIsConnected(true);
        console.log("✅ Connected to STOMP");

        const topic = `/topic/vendor/${85743}`;
        console.log("📡 Subscribing:", topic);

        client.subscribe(topic, (message) => {
          try {
            const data = JSON.parse(message.body);

            console.log("🔔 Order received:", message); // tesing


            if (isValidOrder(data)) {
              console.log("🔔 Order received:", data.id);
              onNewOrderRef.current(data);
            } else {
              console.warn("Invalid order:", data);
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
        console.log("❌ Disconnected");
        setIsConnected(false);

      }
    };

  }, [jwt, shopId]);
  return isConnected;
};
