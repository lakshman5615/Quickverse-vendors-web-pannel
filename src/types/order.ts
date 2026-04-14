export interface Order {
    id:string;
    name:string;
    description:string;
    amount:number;
    quantity:number;
    status:'PENDING'|'ACCEPTED'|'REJECTED'
}