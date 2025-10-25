import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Sparkles, Trophy, Code } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/modules', icon: BookOpen, label: 'Modules' },
    { to: '/exam', icon: FileText, label: 'Exam' },
    { to: '/ai-exercise', icon: Sparkles, label: 'AI Exercise' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-[#1E1E1E] border-r border-[#333333] flex flex-col items-center py-6">
      <div className="mb-12">
        <Code size={32} className="text-white" strokeWidth={2.5} />
      </div>

      <nav className="flex-1 flex flex-col gap-6">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-white' : 'text-[#888888] hover:text-white'
              }`
            }
            title={label}
          >
            <Icon size={24} />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
