import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`flex items-center rounded-full p-1 shadow-inner transition-colors duration-300 ${
        isDark ? 'bg-indigo-950' : 'bg-amber-200'
      }`}
    >
      <Sun size={15} className={`mx-1 transition-opacity ${!isDark ? 'text-amber-600 opacity-100' : 'opacity-30'}`} />
      <Moon size={15} className={`mx-1 transition-opacity ${isDark ? 'text-indigo-100 opacity-100' : 'opacity-30'}`} />
    </button>
  )
}

export default ThemeToggle