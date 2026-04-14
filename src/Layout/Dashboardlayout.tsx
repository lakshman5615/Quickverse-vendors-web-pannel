import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <main className="h-screen bg-zinc-950 p-4">
      <div className="flex h-full gap-4">
        <Sidebar />

        <section className="h-full w-[85%] rounded-xl border border-zinc-800 bg-zinc-900">
          <Navbar />

          <div className="h-[90%] overflow-y-auto p-5">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Layout;