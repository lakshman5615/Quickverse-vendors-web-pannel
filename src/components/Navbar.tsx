
import {CustomButton} from "./common";

const Navbar = () => {
  

  return (
    <header className="flex h-[5%] min-h-16 items-center justify-between border-b border-zinc-800 px-5">
      <p className="text-sm text-zinc-400">
        Vendor Dashboard
      </p>
      <CustomButton
        type="button"
        className="px-3 py-2 text-xs"
      >
        Logout
      </CustomButton>
    </header>
  );
};

export default Navbar;