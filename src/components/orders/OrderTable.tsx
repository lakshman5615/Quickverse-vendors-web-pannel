import type { Order } from "../../types/order";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Status badge color map ─────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  ACCEPTED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  REJECTED: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  ASSIGNING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  ASSIGNED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  DELIVERED: "bg-violet-500/15 text-violet-400 border-violet-500/30",
};

// ─── Payment status badge colors ────────────────────────────────
const PAYMENT_STYLES: Record<string, string> = {
  PAID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  FAILED: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};



// ─── Props ──────────────────────────────────────────────────────
interface OrderTableProps {
  orders: Order[];
  currentPage: number;
  pageSize: number;
  totalOrders: number;
  onPageChange: (page: number) => void;
  onOrderClick: (order: Order) => void;
}

// ─── Helper: format timestamp ───────────────────────────────────
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


// ─── Component ──────────────────────────────────────────────────
const OrderTable = ({
  orders,
  currentPage,
  pageSize,
  totalOrders,
  onPageChange,
   onOrderClick,
}: OrderTableProps) => {
  const totalPages = Math.ceil(totalOrders / pageSize);

  // ─── Empty state ──────────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <p className="text-lg font-semibold text-zinc-400">No orders found😐</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  // ─── Badge renderer ───────────────────────────────────────────
  const renderBadge = (value: string, styleMap: Record<string, string>) => {
    const style = styleMap[value] || "bg-zinc-700/40 text-zinc-400 border-zinc-600";
    return (
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style}`}
      >
        {value}
      </span>
    );
  };

  return (
    <div>
      {/* ─── Table ─────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-800/50">
              <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Customer Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Items</th>
              <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Delivery Partner</th>
              <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Payment Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr
                key={order.id || order.orderId}
                onClick={() => onOrderClick(order)}
                className={`border-b border-zinc-800/60 transition-colors hover:bg-zinc-800/30 ${idx % 2 === 0 ? "bg-zinc-900/50" : "bg-zinc-900/20"
                  }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-zinc-300">
                  {order.orderId}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-300">
                  {order.customerName || "—"}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-300">
                  {order.orderItems.reduce((sum, item) => sum + item.itemCount, 0)} Items
                </td>

                <td className="px-4 py-3">
                  {renderBadge(order.status, STATUS_STYLES)}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-300">
                  {order.deliveryPartnerName || "—"}
                </td>
                <td className="px-4 py-3">
                  {renderBadge(order.paymentStatus, PAYMENT_STYLES)}
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-emerald-400 text-right">
                  ₹{order.totalOrderAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Pagination ────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs text-zinc-500">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalOrders)} of {totalOrders} orders
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-zinc-700 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs text-zinc-400 min-w-[80px] text-center">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-zinc-700 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
