import IncomingOrderModal from '../components/modals/IncomingOrderModal';
import { useOrderCall } from '../hooks/useOrderCall';
import type { Order } from '../types/order';
import {Inbox} from 'lucide-react';
const SMARTBIZ_BASE_URL = "https://your-smartbiz-url.com"
const Dashboard= () => {

  const{activeOrder , triggerIncomingOrder , clearOrder} = useOrderCall();

  const handleViewOrder = (order: Order) => {
    
    clearOrder(); 
    
    window.open(`${SMARTBIZ_BASE_URL}/orders/${order.id}`, '_blank');
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 min-h-full">
      <h2 className="text-xl font-semibold text-zinc-100">Dashboard</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Welcome to QuickVerse dashboard.
      </p>

       {!activeOrder && (
        <div className="flex flex-col items-center justify-center mt-24 text-zinc-500 animate-in fade-in duration-500">
          <div className="rounded-full bg-zinc-800/50 p-6 mb-4">
            <Inbox className="w-12 h-12 text-zinc-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-zinc-300">No new orders</h3>
          <p className="text-sm mt-1 text-zinc-500">
            You're all caught up! Waiting for the next order...
          </p>
        </div>
      )}
      
       
  
      {activeOrder && (
        <IncomingOrderModal 
          order={activeOrder} 
          onViewORder={handleViewOrder}
        />
      )} 
    </div>
  );
};
export default Dashboard;