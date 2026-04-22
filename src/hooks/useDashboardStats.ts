import { useMemo } from 'react';
import { useGetAllOrdersQuery } from '../apis/orderApi';
import { useAuthStore } from '../stores/useAuthStore';

export const useDashboardStats = () => {
  const { shopId } = useAuthStore();
  
  // 1. Hook khud API se data fetch karega
  const { data: allOrders, isLoading, isFetching, refetch } = useGetAllOrdersQuery(shopId || "");

  // 2. Hook khud calculate karke ready-made data dega
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

  // Dashboard ko ye 3 cheezein milengi
  return { stats, isLoading: isLoading || isFetching, refresh: refetch };
};
