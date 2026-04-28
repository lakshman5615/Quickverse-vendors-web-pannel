import { useMemo } from 'react';
import { useGetVendorOrdersQuery } from '../apis/orderApi';
import { useAuthStore } from '../stores/useAuthStore';

export const useDashboardStats = () => {
  const { shopId } = useAuthStore();
  

  const { data: allOrders, isLoading, isFetching, refetch } = useGetVendorOrdersQuery(
    { shopId: shopId ?? "" },
    { skip: !shopId }
  );

  
  const stats = useMemo(() => {
    const defaultStats = { total: 0, revenue: "₹0", accepted: 0, rejected: 0 };
    if (!allOrders) return defaultStats;

    const total = allOrders.length;
    const acceptedCount = allOrders.filter(o => o.state === "ACCEPTED").length;
    const rejectedCount = allOrders.filter(o => o.state === "REJECTED").length;
    const completedOrders = allOrders.filter(o => o.state === "COMPLETED");
    
    const revenueSum = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      total,
      revenue: `₹${revenueSum.toLocaleString('en-IN')}`,
      accepted: acceptedCount,
      rejected: rejectedCount
    };
  }, [allOrders]);

  
  return { stats, isLoading: isLoading || isFetching, refresh: refetch };
};
