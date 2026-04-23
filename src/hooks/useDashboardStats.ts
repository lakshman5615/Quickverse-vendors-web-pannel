import { useMemo } from 'react';
import { useGetVendorOrdersQuery } from '../apis/orderApi';
import { useAuthStore } from '../stores/useAuthStore';

export const useDashboardStats = () => {
  const { shopId } = useAuthStore();
  

  const { data: allOrders, isLoading, isFetching, refetch } = useGetVendorOrdersQuery(shopId || "");

  
  const stats = useMemo(() => {
    const defaultStats = { total: 0, revenue: "₹0", accepted: 0, rejected: 0 };
    if (!allOrders) return defaultStats;

    const total = allOrders.length;
    const acceptedList = allOrders.filter(o => o.status === "ACCEPTED");
    const rejected = allOrders.filter(o => o.status === "REJECTED").length;
    const revenueSum = acceptedList.reduce((sum, o) => sum + parseFloat(o.totalOrderAmount || "0"), 0);

    return {
      total,
      revenue: `₹${revenueSum.toLocaleString('en-IN')}`,
      accepted: acceptedList.length,
      rejected
    };
  }, [allOrders]);

  
  return { stats, isLoading: isLoading || isFetching, refresh: refetch };
};
