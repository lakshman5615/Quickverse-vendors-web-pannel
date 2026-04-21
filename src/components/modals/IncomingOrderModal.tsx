import { useState } from 'react';

import type { Order } from "../../types/order";

interface IncomingOrderModalProps {
    order: Order;
    onViewOrder: (order: Order) => void;

}

const IncomingOrderModal = ({ order, onViewOrder }:

    IncomingOrderModalProps) => {

    const [showWarning, setShowWarning] = useState(false);

    const handleBackdropClick = () => {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 2000);
    };
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleBackdropClick}
        >
            <div
                className=" animate-ring relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex justify-between items-center border-b border-zinc-800 pb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        New Incoming Order!
                    </h2>
                    <span className="text-zinc-400 font-mono text-sm">{order.orderId}</span>
                </div>
                {/* Warning Message Placeholder */}
                <div className="h-6 mb-2">
                    {showWarning && (
                        <p className="text-xs font-semibold text-rose-500 animate-pulse text-center">
                            Please click on "view order" to continue.
                        </p>
                    )}
                </div>
                <div className="space-y-4 mb-8">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Order Items Name</p>
                        <p className="text-lg font-medium text-white">{order.orderItems.map((item) => item.name).join(", ")}</p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Description</p>
                        <p className="text-sm text-zinc-300">{order.orderDescription}</p>
                    </div>
                    <div className="flex gap-8 border-t border-zinc-800 pt-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total Amount</p>
                            <p className="text-lg font-bold text-emerald-400">₹{order.totalOrderAmount}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Quantity</p>
                            <p className="text-lg font-bold text-white">{order.totalQuantity} Items</p>
                        </div>
                    </div>
                </div>
                <div className="flex pt-2">
                    <button
                        onClick={() => onViewOrder(order)}
                        className="w-full rounded-lg bg-green-600 py-3 font-bold text-white transition-transform active:scale-95 hover:bg-green-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    >
                        View Order
                    </button>

                </div>
            </div>
        </div>
    );
};
export default IncomingOrderModal;