import { useGetDashboardSummaryQuery } from '../apis/orderApi';
import { useAuthStore } from '../stores/useAuthStore';

export const useDashboardStats = () => {
  const { shopId } = useAuthStore();

  const { data, isLoading, isFetching, refetch } = useGetDashboardSummaryQuery(
    shopId ?? '',
    { skip: !shopId }
  );

  const stats = {
    total: data?.totalOrders ?? 0,
    revenue: `₹${(data?.totalRevenue ?? 0).toLocaleString('en-IN')}`,
    accepted: data?.acceptedOrders ?? 0,
    rejected: data?.rejectedOrders ?? 0,
  };

  return {
    stats,
    isLoading: isLoading || isFetching,
    refresh: refetch,
  };
};
