import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import SoilUpload from './pages/SoilUpload'
import Chatbot from './pages/Chatbot'

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<SoilUpload />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
