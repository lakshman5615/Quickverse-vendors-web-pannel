import { useEffect, useRef } from "react";
import type { Order } from "../types/order";
import { useAuthStore } from "../stores/useAuthStore";

// TODO TONIGHT: Replace with actual WebSocket URL from backend
const WS_BASE_URL = "wss://your-backend-url.com/ws/orders";

// ── Reconnection Config ─────────────────────────────────
const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_RECONNECT_DELAY = 3000; // 3 seconds
const MAX_RECONNECT_DELAY = 30000; // 30 seconds (cap)

/**
 * Validates that parsed JSON has all required Order fields.
 * Prevents broken modals if backend sends incomplete data.
 */
const isValidOrder = (data: unknown): data is Order => {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.description === "string" &&
    typeof obj.amount === "number" &&
    typeof obj.quantity === "number" &&
    typeof obj.shopId === "string"
  );
};

/**
 * Production-grade WebSocket hook for receiving real-time order notifications.
 *
 * Features:
 * - Auto-reconnect with exponential backoff (3s → 6s → 12s → ... → 30s cap)
 * - Safe JSON parsing with try-catch
 * - Data validation before triggering UI
 * - Clean disconnect on logout (component unmount)
 * - Connects only when authenticated (jwt + shopId available)
 *
 * @param onNewOrder - Callback fired when a valid order arrives (triggerIncomingOrder)
 */
export const useOrderWebSocket = (
  onNewOrder: (order: Order) => void,
) => {
  const jwt = useAuthStore((state) => state.jwt);
  const shopId = useAuthStore((state) => state.shopId);

  // Store callback in ref to avoid reconnections on every render
  const onNewOrderRef = useRef(onNewOrder);
  onNewOrderRef.current = onNewOrder;

  // Internal refs for WebSocket lifecycle management
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isCleaningUpRef = useRef(false);

  useEffect(() => {
    // Don't connect if vendor is not authenticated
    if (!jwt || !shopId) {
      console.log("WebSocket: Missing JWT or shopId, skipping connection");
      return;
    }

    isCleaningUpRef.current = false;
    reconnectAttemptRef.current = 0;

    // ── Connect Function ───────────────────────────────
    const connect = () => {
      // Don't reconnect if we're cleaning up (logout)
      if (isCleaningUpRef.current) return;

      // Close any existing connection before creating a new one
      if (wsRef.current) {
        wsRef.current.close();
      }

      // TODO TONIGHT: Confirm WebSocket URL format with backend team
      // The backend may expect token/shopId as query params, headers, or first message
      const wsUrl = `${WS_BASE_URL}?token=${jwt}&shopId=${shopId}`;
      console.log("WebSocket: Connecting...");

      const ws = new WebSocket(wsUrl);

      // ── On Successful Connection ───────────────────
      ws.onopen = () => {
        console.log("WebSocket: Connected successfully ✅");
        reconnectAttemptRef.current = 0; // Reset counter on success
      };

      // ── On Receiving a Message ─────────────────────
      ws.onmessage = (event: MessageEvent) => {
        try {
          // TODO TONIGHT: Adjust parsing if backend wraps order inside another object
          // e.g., if backend sends { type: "NEW_ORDER", payload: { id: "...", ... } }
          // then use: const data = JSON.parse(event.data).payload;
          const data = JSON.parse(event.data as string);

          if (isValidOrder(data)) {
            console.log("WebSocket: New order received 🔔", data.id);
            onNewOrderRef.current(data);
          } else {
            console.warn(
              "WebSocket: Received data with missing/invalid fields, skipping:",
              data,
            );
          }
        } catch (error) {
          console.error("WebSocket: Failed to parse message:", error);
        }
      };

      // ── On Error ───────────────────────────────────
      ws.onerror = (error: Event) => {
        console.error("WebSocket: Connection error:", error);
      };

      // ── On Disconnect ──────────────────────────────
      ws.onclose = (event: CloseEvent) => {
        console.log(
          `WebSocket: Disconnected (code: ${event.code}, reason: ${event.reason || "none"})`,
        );

        // Only attempt reconnect if this wasn't an intentional cleanup (logout)
        if (!isCleaningUpRef.current) {
          // Check if we've exceeded max attempts
          if (reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
            console.error(
              `WebSocket: Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Please refresh the page.`,
            );
            return;
          }

          reconnectAttemptRef.current += 1;

          // Exponential backoff: 3s → 6s → 12s → 24s → 30s (capped)
          const delay = Math.min(
            INITIAL_RECONNECT_DELAY *
              Math.pow(2, reconnectAttemptRef.current - 1),
            MAX_RECONNECT_DELAY,
          );

          console.log(
            `WebSocket: Reconnecting in ${delay / 1000}s (attempt ${reconnectAttemptRef.current}/${MAX_RECONNECT_ATTEMPTS})`,
          );

          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };

      wsRef.current = ws;
    };

    // Start the connection
    connect();

    // ── Cleanup: runs ONLY on logout (Layout unmounts) ──
    return () => {
      isCleaningUpRef.current = true;

      // Cancel any pending reconnect timers
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Close the WebSocket connection cleanly
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      console.log("WebSocket: Cleaned up on logout 🔒");
    };
  }, [jwt, shopId]); // Only re-run if auth credentials change
};
