import IncomingOrderModal from '../components/modals/IncomingOrderModal';
import { useOrderCall } from '../hooks/useOrderCall';
import { dummyOrders } from '../data/mockOrders';
import type { Order } from '../types/order';
import {Inbox} from 'lucide-react';
const Dashboard= () => {

  const{activeOrder , triggerIncomingOrder , clearOrder} = useOrderCall();

  const handleViewOrder = (order: Order) => {
    
    clearOrder(); 
    
    window.open(`https://your-smartbiz-url.com/orders/${order.id}`, '_blank');
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
      
       {/* Button to simulate an incoming order for testing */}
      <div className="mt-10">
        <button 
          onClick={() => triggerIncomingOrder(dummyOrders[0])}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          Simulate Incoming Order
        </button>
      </div>
       {/* Put this modal component at the bottom of your root div */}
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