import { useMemo } from 'react';
import { useGetVendorOrdersQuery } from '../apis/orderApi';
import { useAuthStore } from '../stores/useAuthStore';
import { OrderStatusFilter } from '../types/filters';

export const useDashboardStats = () => {
  const { shopId } = useAuthStore();

  const { data: allData, isLoading: l1, isFetching: f1, refetch: r1 } = useGetVendorOrdersQuery(
    { shopId: shopId ?? "", page: 0, size: 1 },
    { skip: !shopId }
  );

  const { data: acceptedData, isLoading: l2, isFetching: f2, refetch: r2 } = useGetVendorOrdersQuery(
    { shopId: shopId ?? "", orderStatus: [OrderStatusFilter.ACCEPTED], page: 0, size: 1 },
    { skip: !shopId }
  );

  const { data: rejectedData, isLoading: l3, isFetching: f3, refetch: r3 } = useGetVendorOrdersQuery(
    { shopId: shopId ?? "", orderStatus: [OrderStatusFilter.REJECTED], page: 0, size: 1 },
    { skip: !shopId }
  );

  const { data: completedData, isLoading: l4, isFetching: f4, refetch: r4 } = useGetVendorOrdersQuery(
    { shopId: shopId ?? "", orderStatus: [OrderStatusFilter.COMPLETED], page: 0, size: 100 },
    { skip: !shopId }
  );

  const stats = useMemo(() => {
    const revenueSum = (completedData?.orders ?? [])
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      total: allData?.totalElements ?? 0,
      revenue: `₹${revenueSum.toLocaleString('en-IN')}`,
      accepted: acceptedData?.totalElements ?? 0,
      rejected: rejectedData?.totalElements ?? 0,
    };
  }, [allData, acceptedData, rejectedData, completedData]);

  const refresh = () => { r1(); r2(); r3(); r4(); };

  return {
    stats,
    isLoading: l1 || l2 || l3 || l4 || f1 || f2 || f3 || f4,
    refresh
  };
};
