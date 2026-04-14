import {useState , useEffect , useRef } from 'react';
import type{ Order} from "../types/order";
import  Alert_ringtone from "../assets/Alert_ringtone.mp3";

export const useOrderCall = () =>{
    const [activeOrder , setActiveOrder] = useState<Order | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

   useEffect ( ()=>{

    audioRef.current = new Audio(Alert_ringtone);
    audioRef.current.loop = true;
   },[]
);

   useEffect(() => {
    if (activeOrder && audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio blocked bybrowser :",e));
    }
    else if (!activeOrder && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
   }, [activeOrder]);
   
   const triggerIncomingOrder = (order: Order) => {
    setActiveOrder(order);
   };

   const clearOrder = () =>{
    setActiveOrder(null);

   };

   return {
    activeOrder,
    triggerIncomingOrder,
    clearOrder
   };
};
   