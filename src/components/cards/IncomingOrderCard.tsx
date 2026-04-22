import type { Order } from "../../types/order";
import { useOrderStore } from "../../stores/useOrderStore";

export const IncomingOrderCard = ({ order }: { order: Order }) => {
    const Smartbiz_Url = "https://smartbiz.in";
  const { markAsViewed, viewedOrderIds } = useOrderStore();
  const isViewed = viewedOrderIds.has(order.orderId);

  const handleView = () => {
    markAsViewed(order.orderId);
    window.open(`${Smartbiz_Url}orders/${order.id}`, "_blank");
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
        <p className="text-zinc-500 text-sm mt-1 line-clamp-2">
          {order.orderDescription}
        </p>
      </div>

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
