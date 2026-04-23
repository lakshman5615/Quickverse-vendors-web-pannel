import { X } from "lucide-react";
import type { Order } from "../../types/order";

// ─── Badge styles (reused from OrderTable) ──────────────────────
const STATUS_STYLES: Record<string, string> = {
  ACCEPTED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  REJECTED: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  ASSIGNING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  ASSIGNED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  DELIVERED: "bg-violet-500/15 text-violet-400 border-violet-500/30",
};

const PAYMENT_STYLES: Record<string, string> = {
  PAID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  FAILED: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  NA: "bg-slate-500/15 text-white border-slate-500/30",
};

// ─── Props ──────────────────────────────────────────────────────
interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

// ─── Helpers ────────────────────────────────────────────────────
const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
};

const getPaymentDisplay = (order: Order): string => {
  if (order.status === "REJECTED") return "NA";
  if (order.status === "ASSIGNING") return "PENDING";
  return order.paymentStatus || "NA";
};

const renderBadge = (value: string, styleMap: Record<string, string>) => {
  const style = styleMap[value] || "bg-zinc-700/40 text-zinc-400 border-zinc-600";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {value}
    </span>
  );
};

// ─── Component ──────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => {
  const totalItems = order.orderItems.reduce((sum, item) => sum + item.itemCount, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Order Details</h2>
            <p className="text-xs text-zinc-500 mt-0.5 font-mono">{order.orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Body ────────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Row 1: Status + Payment with labels */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">Status</span>
              <span className="text-zinc-600">:</span>
              {renderBadge(order.status, STATUS_STYLES)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">Payment Status</span>
              <span className="text-zinc-600">:</span>
              {renderBadge(getPaymentDisplay(order), PAYMENT_STYLES)}
            </div>
          </div>

          {/* Grid: Key details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-zinc-800/50 border border-zinc-800 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 mb-1">Customer</p>
              <p className="text-sm font-medium text-zinc-200">{order.customerName || "—"}</p>
            </div>

            <div className="rounded-xl bg-zinc-800/50 border border-zinc-800 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 mb-1">Timestamp</p>
              <p className="text-sm font-medium text-zinc-200">{formatDate(order.createdAt)}</p>
            </div>

            <div className="rounded-xl bg-zinc-800/50 border border-zinc-800 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 mb-1">Amount</p>
              <p className="text-sm font-bold text-emerald-400">₹{order.totalOrderAmount}</p>
            </div>

            <div className="rounded-xl bg-zinc-800/50 border border-zinc-800 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 mb-1">Total Quantity</p>
              <p className="text-sm font-medium text-zinc-200">{totalItems} Items</p>
            </div>

            <div className="col-span-2 rounded-xl bg-zinc-800/50 border border-zinc-800 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 mb-1">Delivery Partner</p>
              <p className="text-sm font-medium text-zinc-200">{order.deliveryPartnerName || "—"}</p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl bg-zinc-800/50 border border-zinc-800 p-3.5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 mb-1">Description</p>
            <p className="text-sm text-zinc-300">{order.orderDescription || "—"}</p>
          </div>

          {/* Order Items List */}
          <div className="rounded-xl bg-zinc-800/50 border border-zinc-800 p-3.5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 mb-2">Order Items</p>
            <div className="space-y-2">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-700/30 transition"
                >
                  <span className="text-sm text-zinc-300">{item.name}</span>
                  <span className="text-xs font-semibold text-zinc-400 bg-zinc-700/50 px-2 py-0.5 rounded-full">
                    ×{item.itemCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
