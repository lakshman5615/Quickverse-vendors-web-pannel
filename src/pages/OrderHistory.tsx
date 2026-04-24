import { useState, useMemo } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useGetVendorOrdersQuery } from "../apis/orderApi";
import FilterBar from "../components/orders/FilterBar";
import OrderTable from "../components/orders/OrderTable";
import { RefreshCw, AlertCircle } from "lucide-react";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import type { Order } from "../types/order";
import { OrderStatusFilter, TimeFilterOption } from "../types/filters";



const PAGE_SIZE = 100;

const OrderHistory = () => {
  // ─── Auth ─────────────────────────────────────────────────────
  const shopId = useAuthStore((s) => s.shopId);

  // ─── Filter state ────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter | undefined>(undefined);
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption | undefined>(undefined);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ─── RTK Query: fetch filtered orders ────────────────────────
  const { data: orders = [], isLoading, isError, refetch, isFetching } =
    useGetVendorOrdersQuery(
      {
        shopId: shopId ?? "",
        status: statusFilter,
        timeFilter: timeFilter,
        startDate: customStartDate?.toISOString() || undefined,
        endDate: customEndDate?.toISOString() || undefined,
      },
      { skip: !shopId }
    );

  // ─── Pagination state ────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Handler: status change ──────────────────────────────────
  const handleStatusChange = (status: string) => {
    if (status === "ALL") {
      setStatusFilter(undefined);
      setTimeFilter(undefined);
      setCustomStartDate(null);
      setCustomEndDate(null);
    } else {
      setStatusFilter(status as OrderStatusFilter);
    }
    setCurrentPage(1);
  };

  // ─── Handler: time change ────────────────────────────────────
  const handleTimeChange = (time: string) => {
    if (time === "ALL") {
      setTimeFilter(undefined);
    } else {
      setTimeFilter(time as TimeFilterOption);
    }
    setCustomStartDate(null);
    setCustomEndDate(null);
    setCurrentPage(1);
  };

  // ─── Handler: custom date range ──────────────────────────────
  const handleCustomDateChange = (start: Date | null, end: Date | null) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setCurrentPage(1);
  };

  // ─── Compute: paginated orders ───────────────────────────────
  const paginatedOrders = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    return orders.slice(startIdx, startIdx + PAGE_SIZE);
  }, [orders, currentPage]);

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">Order History</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-xs font-medium hover:bg-zinc-800 transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5">
        <FilterBar
          statusFilter={statusFilter || "ALL"}
          timeFilter={timeFilter || "ALL"}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onStatusChange={handleStatusChange}
          onTimeChange={handleTimeChange}
          onCustomDateChange={handleCustomDateChange}
        />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-zinc-400">
            <RefreshCw size={20} className="animate-spin" />
            <span className="text-sm">Loading orders...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 text-rose-400">
          <AlertCircle size={32} className="mb-2" />
          <p className="text-sm font-medium">Failed to load orders</p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-1.5 rounded-lg border border-rose-500/30 text-xs hover:bg-rose-500/10 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <OrderTable
          orders={paginatedOrders}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalOrders={orders.length}
          onPageChange={setCurrentPage}
          onOrderClick={setSelectedOrder}
        />
      )}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

    </div>
  );
};

export default OrderHistory;
