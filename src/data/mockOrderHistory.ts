import type { Order } from "../types/order";

// Helper to create dates relative to now
const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

export const mockOrderHistory: Order[] = [
  // ─── Last 30 min orders ───────────────────────────────────────
  {
    id: "1", orderId: "QV-1001", createdAt: minutesAgo(5),
    customerName: "Rahul Sharma", orderDescription: "2x Paneer Butter Masala",
    orderItems: [{ id: 1, name: "Paneer Butter Masala", itemCount: 2 }],
    totalOrderAmount: "540", totalQuantity: "2",
    status: "ACCEPTED", deliveryPartnerName: "Amit Kumar", paymentStatus: "PAID",
  },
  {
    id: "2", orderId: "QV-1002", createdAt: minutesAgo(12),
    customerName: "Priya Patel", orderDescription: "1x Biryani, 1x Raita",
    orderItems: [{ id: 1, name: "Biryani", itemCount: 1 }, { id: 2, name: "Raita", itemCount: 1 }],
    totalOrderAmount: "320", totalQuantity: "2",
    status: "ASSIGNING", deliveryPartnerName: "", paymentStatus: "PAID",
  },
  {
    id: "3", orderId: "QV-1003", createdAt: minutesAgo(20),
    customerName: "Vikram Singh", orderDescription: "3x Dosa",
    orderItems: [{ id: 1, name: "Masala Dosa", itemCount: 3 }],
    totalOrderAmount: "270", totalQuantity: "3",
    status: "ASSIGNED", deliveryPartnerName: "Ravi Teja", paymentStatus: "PENDING",
  },
  {
    id: "4", orderId: "QV-1004", createdAt: minutesAgo(25),
    customerName: "Sneha Reddy", orderDescription: "1x Thali",
    orderItems: [{ id: 1, name: "Veg Thali", itemCount: 1 }],
    totalOrderAmount: "180", totalQuantity: "1",
    status: "REJECTED", deliveryPartnerName: "", paymentStatus: "FAILED",
  },

  // ─── Today (1-12 hours ago) ───────────────────────────────────
  {
    id: "5", orderId: "QV-1005", createdAt: hoursAgo(2),
    customerName: "Arjun Nair", orderDescription: "2x Pizza, 1x Coke",
    orderItems: [{ id: 1, name: "Margherita Pizza", itemCount: 2 }, { id: 2, name: "Coke", itemCount: 1 }],
    totalOrderAmount: "650", totalQuantity: "3",
    status: "DELIVERED", deliveryPartnerName: "Suresh Babu", paymentStatus: "PAID",
  },
  {
    id: "6", orderId: "QV-1006", createdAt: hoursAgo(5),
    customerName: "Meera Joshi", orderDescription: "1x Pasta",
    orderItems: [{ id: 1, name: "Alfredo Pasta", itemCount: 1 }],
    totalOrderAmount: "220", totalQuantity: "1",
    status: "DELIVERED", deliveryPartnerName: "Amit Kumar", paymentStatus: "PAID",
  },
  {
    id: "7", orderId: "QV-1007", createdAt: hoursAgo(8),
    customerName: "Karthik M", orderDescription: "4x Idli, 2x Vada",
    orderItems: [{ id: 1, name: "Idli", itemCount: 4 }, { id: 2, name: "Medu Vada", itemCount: 2 }],
    totalOrderAmount: "160", totalQuantity: "6",
    status: "ACCEPTED", deliveryPartnerName: "Ravi Teja", paymentStatus: "PAID",
  },

  // ─── Last week (2-6 days ago) ─────────────────────────────────
  {
    id: "8", orderId: "QV-1008", createdAt: daysAgo(2),
    customerName: "Ananya Gupta", orderDescription: "1x Burger, 1x Fries",
    orderItems: [{ id: 1, name: "Chicken Burger", itemCount: 1 }, { id: 2, name: "French Fries", itemCount: 1 }],
    totalOrderAmount: "350", totalQuantity: "2",
    status: "DELIVERED", deliveryPartnerName: "Suresh Babu", paymentStatus: "PAID",
  },
  {
    id: "9", orderId: "QV-1009", createdAt: daysAgo(3),
    customerName: "Rohit Verma", orderDescription: "2x Naan, 1x Dal Makhani",
    orderItems: [{ id: 1, name: "Butter Naan", itemCount: 2 }, { id: 2, name: "Dal Makhani", itemCount: 1 }],
    totalOrderAmount: "290", totalQuantity: "3",
    status: "REJECTED", deliveryPartnerName: "", paymentStatus: "FAILED",
  },
  {
    id: "10", orderId: "QV-1010", createdAt: daysAgo(5),
    customerName: "Divya Menon", orderDescription: "1x Fried Rice",
    orderItems: [{ id: 1, name: "Veg Fried Rice", itemCount: 1 }],
    totalOrderAmount: "190", totalQuantity: "1",
    status: "DELIVERED", deliveryPartnerName: "Amit Kumar", paymentStatus: "PAID",
  },

  // ─── This month (10-25 days ago) ──────────────────────────────
  {
    id: "11", orderId: "QV-1011", createdAt: daysAgo(10),
    customerName: "Sanjay Rao", orderDescription: "1x Chole Bhature",
    orderItems: [{ id: 1, name: "Chole Bhature", itemCount: 1 }],
    totalOrderAmount: "150", totalQuantity: "1",
    status: "DELIVERED", deliveryPartnerName: "Ravi Teja", paymentStatus: "PAID",
  },
  {
    id: "12", orderId: "QV-1012", createdAt: daysAgo(15),
    customerName: "Lakshmi Iyer", orderDescription: "2x Sandwich",
    orderItems: [{ id: 1, name: "Grilled Sandwich", itemCount: 2 }],
    totalOrderAmount: "240", totalQuantity: "2",
    status: "ACCEPTED", deliveryPartnerName: "Suresh Babu", paymentStatus: "PENDING",
  },
  {
    id: "13", orderId: "QV-1013", createdAt: daysAgo(20),
    customerName: "Nitin Deshmukh", orderDescription: "1x Pav Bhaji",
    orderItems: [{ id: 1, name: "Pav Bhaji", itemCount: 1 }],
    totalOrderAmount: "130", totalQuantity: "1",
    status: "DELIVERED", deliveryPartnerName: "Amit Kumar", paymentStatus: "PAID",
  },

  // ─── Older (40-200 days ago) ──────────────────────────────────
  {
    id: "14", orderId: "QV-1014", createdAt: daysAgo(40),
    customerName: "Pooja Kulkarni", orderDescription: "3x Momos",
    orderItems: [{ id: 1, name: "Steamed Momos", itemCount: 3 }],
    totalOrderAmount: "210", totalQuantity: "3",
    status: "DELIVERED", deliveryPartnerName: "Ravi Teja", paymentStatus: "PAID",
  },
  {
    id: "15", orderId: "QV-1015", createdAt: daysAgo(90),
    customerName: "Aditya Saxena", orderDescription: "1x Wrap, 1x Smoothie",
    orderItems: [{ id: 1, name: "Chicken Wrap", itemCount: 1 }, { id: 2, name: "Mango Smoothie", itemCount: 1 }],
    totalOrderAmount: "380", totalQuantity: "2",
    status: "REJECTED", deliveryPartnerName: "", paymentStatus: "FAILED",
  },
  {
    id: "16", orderId: "QV-1016", createdAt: daysAgo(180),
    customerName: "Tanvi Bhatt", orderDescription: "2x Rolls",
    orderItems: [{ id: 1, name: "Paneer Roll", itemCount: 2 }],
    totalOrderAmount: "200", totalQuantity: "2",
    status: "DELIVERED", deliveryPartnerName: "Suresh Babu", paymentStatus: "PAID",
  },
];
