import { useState, useMemo } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useGetVendorOrdersQuery } from "../apis/orderApi";
import FilterBar from "../components/orders/FilterBar";
import OrderTable from "../components/orders/OrderTable";
import { RefreshCw, AlertCircle } from "lucide-react";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import type { Order } from "../types/order";



const PAGE_SIZE = 100;

const OrderHistory = () => {
  // ─── Auth ─────────────────────────────────────────────────────
  const shopId = useAuthStore((s) => s.shopId);

  // ─── RTK Query: fetch all orders ─────────────────────────────
  const { data: orders = [], isLoading, isError, refetch, isFetching } =
    useGetVendorOrdersQuery(shopId ?? "", { skip: !shopId });

  // ─── Filter state ────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ─── Pagination state ────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Handler: status change ──────────────────────────────────
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    if (status === "ALL") {
      setTimeFilter("ALL");
      setSelectedMonth(null);
      setSelectedYear(null);
      setCustomStartDate(null);
      setCustomEndDate(null);
    }
    setCurrentPage(1);
  };


  // ─── Handler: time change ────────────────────────────────────
  const handleTimeChange = (time: string) => {
    setTimeFilter(time);
    setSelectedMonth(null);
    setSelectedYear(null);
    setCustomStartDate(null);
    setCustomEndDate(null);
    setCurrentPage(1);
  };

  // ─── Handler: month dropdown ─────────────────────────────────
  const handleMonthChange = (month: number) => {
    setTimeFilter("MONTHLY");
    setSelectedMonth(month);
    setSelectedYear(null);
    setCustomStartDate(null);
    setCustomEndDate(null);
    setCurrentPage(1);
  };

  // ─── Handler: year dropdown ──────────────────────────────────
  const handleYearChange = (year: number) => {
    setTimeFilter("YEARLY");
    setSelectedYear(year);
    setSelectedMonth(null);
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

  // ─── Compute: filtered orders ────────────────────────────────
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // 1) Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // 2) Time filter
    const now = new Date();

    if (timeFilter === "LAST_30_MIN") {
      const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
      result = result.filter((o) => new Date(o.createdAt) >= thirtyMinAgo);
    } else if (timeFilter === "TODAY") {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      result = result.filter((o) => new Date(o.createdAt) >= startOfDay);
    } else if (timeFilter === "LAST_WEEK") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter((o) => new Date(o.createdAt) >= weekAgo);
    } else if (timeFilter === "MONTHLY" && selectedMonth !== null) {
      const year = now.getFullYear();
      result = result.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === selectedMonth && d.getFullYear() === year;
      });
    } else if (timeFilter === "YEARLY" && selectedYear !== null) {
      result = result.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getFullYear() === selectedYear;
      });
    } else if (timeFilter === "CUSTOM") {
      if (customStartDate) {
        result = result.filter((o) => new Date(o.createdAt) >= customStartDate);
      }
      if (customEndDate) {
        // Include the entire end date day
        const endOfDay = new Date(customEndDate);
        endOfDay.setHours(23, 59, 59, 999);
        result = result.filter((o) => new Date(o.createdAt) <= endOfDay);
      }
    }

    return result;
  }, [orders, statusFilter, timeFilter, selectedMonth, selectedYear, customStartDate, customEndDate]);

  // ─── Compute: paginated orders ───────────────────────────────
  const paginatedOrders = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">Order History</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} found
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
          statusFilter={statusFilter}
          timeFilter={timeFilter}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onStatusChange={handleStatusChange}
          onTimeChange={handleTimeChange}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
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
          totalOrders={filteredOrders.length}
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
