import { useAuthStore } from "../stores/useAuthStore";
import { CustomButton } from "./common";
import { useNavigate } from "react-router-dom";



const Navbar = ({ isConnected }: { isConnected: boolean }) => {
  const navigate = useNavigate();
  const { clearSession } = useAuthStore();

  return (
    <header className="flex h-[5%] min-h-16 items-center justify-between border-b border-zinc-800 px-5">
      <p className="text-sm text-zinc-400">
        Vendor Dashboard-👨‍🍳
      </p>
      
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
    <div className="relative flex h-2 w-2">
      {/* Blinking effect only when connected */}
      {isConnected && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-widest ${isConnected ? 'text-emerald-500' : 'text-zinc-500'}`}>
      {isConnected ? 'Live' : 'Offline'}
    </span>
  </div>
      
      <CustomButton
        type="button"
        className="px-3 py-2 text-xs"
        onClick={() => {
          clearSession();
          navigate("/", { replace: true });
        }}
      >
        Logout
      </CustomButton>
    </header>
  );
};

export default Navbar;