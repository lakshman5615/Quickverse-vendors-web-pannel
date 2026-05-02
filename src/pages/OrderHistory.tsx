import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useGetVendorOrdersQuery } from "../apis/orderApi";
import FilterBar from "../components/orders/FilterBar";
import OrderTable from "../components/orders/OrderTable";
import { RefreshCw, AlertCircle } from "lucide-react";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import type { OrderApiResponse } from "../types/order";
import { OrderStatusFilter, TimeFilterOption } from "../types/filters";

const PAGE_SIZE = 100;

const OrderHistory = () => {
  const shopId = useAuthStore((s) => s.shopId);

  const [orderStatus, setOrderStatus] = useState<OrderStatusFilter[]>([]);
  const [timeRange, setTimeRange] = useState<TimeFilterOption | undefined>(undefined);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderApiResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for backend

  const formatForBackend = (date: Date | null) => {
    if (!date) return undefined;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const { data, isLoading, isError, refetch, isFetching } =
    useGetVendorOrdersQuery(
      {
        shopId: shopId ?? "",
        orderStatus: orderStatus.length > 0 ? orderStatus : undefined,
        timeRange,
        fromTime: formatForBackend(customStartDate),
        toTime: formatForBackend(customEndDate),
        page: currentPage,
        size: PAGE_SIZE,
      },
      { skip: !shopId }
    );

  const handleStatusChange = (status: string) => {
    const isAlreadySelected = orderStatus.includes(status as OrderStatusFilter);
    setOrderStatus(status === "ALL" || isAlreadySelected ? [] : [status as OrderStatusFilter]);
    setCurrentPage(0);
  };

  const handleTimeChange = (time: string) => {
    setTimeRange(time === timeRange ? undefined : time as TimeFilterOption);
    setCustomStartDate(null);
    setCustomEndDate(null);
    setCurrentPage(0);
  };

  const handleCustomDateChange = (start: Date | null, end: Date | null) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    if (start && end) setTimeRange(TimeFilterOption.CUSTOM);
    setCurrentPage(0);
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 min-h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">Order History</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {data?.totalElements ?? 0} order{(data?.totalElements ?? 0) !== 1 ? "s" : ""} found
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

      <div className="mb-5">
        <FilterBar
          statusFilter={orderStatus.length > 0 ? orderStatus[0] : "ALL"}
          timeFilter={timeRange || "ALL"}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onStatusChange={handleStatusChange}
          onTimeChange={handleTimeChange}
          onCustomDateChange={handleCustomDateChange}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-zinc-400">
            <RefreshCw size={20} className="animate-spin" />
            <span className="text-sm">Loading orders...</span>
          </div>
        </div>
      )}

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

      {!isLoading && !isError && (
        <OrderTable
          orders={data?.orders ?? []}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalPages={data?.totalPages ?? 0}
          totalElements={data?.totalElements ?? 0}
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
