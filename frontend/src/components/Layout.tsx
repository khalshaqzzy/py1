import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#121212]">
      <Sidebar />
      <main className="ml-20 flex-1 text-[#EAEAEA]">
        <Outlet />
      </main>
    </div>
  );
}
