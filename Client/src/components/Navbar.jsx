import { NavLink } from 'react-router-dom'
import { Home, LayoutDashboard, Upload, MessageCircle } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Soil', icon: Upload },
  { to: '/chatbot', label: 'Chat', icon: MessageCircle },
]

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-primary-700 dark:text-primary-300"
          >
            🌱 <span>Digital Phulwari</span>
          </NavLink>

          {/* Links + Theme Toggle */}
          <div className="flex items-center gap-1 sm:gap-2">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Icon size={16} />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}

            {/* THE site-wide theme toggle */}
            <div className="ml-1 sm:ml-2 pl-1 sm:pl-2 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar