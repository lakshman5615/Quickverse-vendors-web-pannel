import type { OrderActionEvent } from "../../types/order";
import { useOrderStore } from "../../stores/useOrderStore";
import { Copy, Check } from 'lucide-react';
import { useState } from "react";
import toast from "react-hot-toast";

const formatPhone = (phone: string) => {
  if (!phone) return "";

  // Remove any non-numeric characters (like +, -, spaces)
  const clean = phone.replace(/\D/g, "");

  // If it starts with 91 and has 12 digits, remove the first two digits
  if (clean.startsWith("91") && clean.length === 12) {
    return clean.slice(2);
  }

  return clean;
};

const formatAddress = (raw: string) => {

  if (!raw || !raw.startsWith("{")) return raw;

  try {
    // Remove { and } then split into key=value pairs
    const parts = raw.slice(1, -1).split(", ");
    const map: Record<string, string> = {};

    parts.forEach(part => {

      const [key, ...rest] = part.split("=");
      const val = rest.join("=");

      if (key && val) map[key.trim()] = val.trim();
    });
    // Build a readable string (Ignoring lat/lng)
    const { addressLine1, addressLine2, city, state, pincode } = map;
    const lines = [addressLine1, addressLine2, city, state].filter(Boolean);

    let result = lines.join(", ");
    if (pincode) result += ` - ${pincode}`;

    return result;
  } catch (e) {
    return raw; // Fallback to raw if parsing fails
  }
};

export const IncomingOrderCard = ({ order }: { order: OrderActionEvent }) => {
  const cleanAddress = formatAddress(order.customerAddress);
  const cleanPhone = formatPhone(order.customerPhone);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(field);


      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };
  const Smartbiz_Url = "https://smartbiz.amazon.in/";
  const { markAsViewed, viewedOrderIds } = useOrderStore();
  const isViewed = viewedOrderIds.has(order.orderId);

  const handleView = () => {
    markAsViewed(order.orderId);
    window.open(`${Smartbiz_Url}orders/${order.orderId}`, "_blank");
  };

  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl hover:border-zinc-700 transition-all">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-400 font-mono text-xs">#{order.orderId}</span>
        </div>
        {isViewed && (
          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] font-bold rounded uppercase">
            Viewed
          </span>
        )}
      </div>

      {/* Items Section */}
      <div className="mb-4">
        <h4 className="text-white font-semibold text-lg line-clamp-1">
          {order.orderItems.map(i => i.name).join(", ")}
        </h4>
        {/* Hide description if it is same as order items */}
        <p className={`text-zinc-500 text-sm mt-1 line-clamp-2 ${order.orderDescription === order.orderItems.map(i => i.name).join(", ")
            ? 'invisible'
            : 'visible'
          }`}>
          {order.orderDescription || " "}
        </p>
      </div>

      {/* Customer Details Section */}
      {(order.customerName || order.customerPhone || order.customerAddress) && (
        <div className="mb-4 bg-zinc-950/50 rounded-lg p-3 border border-zinc-800/50">
          <div className="flex flex-col gap-1.5">
            {order.customerName && (
              <p className="text-sm text-zinc-200 font-medium flex items-center gap-2">
                <span className="text-zinc-500">👤</span> {order.customerName}
              </p>
            )}
            {/* Use clean Phone number and adreess remvoe 91 or rawjson */}
            {order.customerPhone && (
              <div className="flex items-center justify-between group">
                <p className="text-xs text-zinc-400 font-mono flex items-center gap-2">
                  <span className="text-zinc-500">📞</span> {cleanPhone}
                </p>
                <button
                  onClick={() => handleCopy(cleanPhone, "Phone")}
                  className="text-zinc-500 hover:text-emerald-400 transition-colors p-1"
                >
                  {copiedField === "Phone" ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            )}
            {order.customerAddress && (
              <div className="flex items-start justify-between group gap-2">
                <p className="text-xs text-zinc-500 line-clamp-2 flex items-start gap-2">
                  <span className="text-zinc-500">📍</span>
                  <span className="mt-0.5">{cleanAddress}</span>
                </p>
                <button
                  onClick={() => handleCopy(cleanAddress, "Address")}
                  className="text-zinc-500 hover:text-emerald-400 transition-colors p-1 shrink-0"
                >
                  {copiedField === "Address" ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price & Quantity */}
      <div className="flex border-t border-zinc-800 pt-4 mb-5 gap-6">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Total Amount</p>
          <p className="text-emerald-400 font-bold text-xl">₹{order.totalOrderAmount}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Quantity</p>
          <p className="text-white font-bold text-xl">{order.totalQuantity}</p>
        </div>
      </div>

      {/* Action Section */}
      {isViewed && (
        <p className="text-[11px] text-rose-500 font-bold text-center mb-3 animate-pulse">
          Please accept or reject in SmartBiz
        </p>
      )}

      <button
        onClick={handleView}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
      >
        View Order
      </button>
    </div>
  );
};
