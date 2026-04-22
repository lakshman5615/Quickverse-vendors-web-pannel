import { StatCard } from "../components/cards/StatCard";
import { IncomingOrderCard } from "../components/cards/IncomingOrderCard";
import { useOrderStore } from "../stores/useOrderStore";
import { Inbox, RotateCw } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";

const Dashboard = () => {
  const { incomingOrders } = useOrderStore();
  const { stats, isLoading, refresh } = useDashboardStats();


  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Stats Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">Welcome to QuickVerse dashboard.</p>

        <button
          onClick={() => refresh()}
          disabled={isLoading}
          className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95 ${isLoading ? 'animate-spin' : ''}`}
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={stats.total} trend="+12%" />
        <StatCard title="Total Revenue" value={stats.revenue} trend="+8%" />
        <StatCard title="Accepted Orders" value={stats.accepted} trend="Active" />
        <StatCard title="Rejected Orders" value={stats.rejected} trend="-2%" />
      </div>

      {/* New Incoming Orders Section */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 min-h-[500px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            New Incoming Orders
            {incomingOrders.length > 0 && (
              <span className="bg-emerald-500 text-zinc-950 text-xs px-2 py-1 rounded-full">
                {incomingOrders.length}
              </span>
            )}
          </h2>
        </div>

        {incomingOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incomingOrders.map((order) => (
              <IncomingOrderCard key={order.orderId} order={order} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-[400px] text-zinc-500">
            <div className="bg-zinc-800/30 p-8 rounded-full mb-6">
              <Inbox className="w-16 h-16 opacity-20" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-300">No new incoming orders</h3>
            <p className="text-sm mt-2">We'll notify you as soon as a new order arrives! 😊</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
