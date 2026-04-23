export interface Order {
  orderId: string;           
  totalOrderAmount: string;  
  totalQuantity: string;     
  orderDescription: string;  
  orderItems: OrderItem[];   
  status: string;            
  id: string;                
  createdAt: string; 
  customerName: string;
  deliveryPartnerName: string;
  paymentStatus: string;    
  customerPhone:string;
  customerAddress:string;    
}
export interface OrderItem {
  id: number;
  name: string;
  itemCount: number;
}