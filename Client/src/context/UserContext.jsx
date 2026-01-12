import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [experienceLevel, setExperienceLevel] = useState('beginner')
  const [location, setLocation] = useState(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedLevel = localStorage.getItem('experienceLevel')
    if (savedLevel) {
      setExperienceLevel(savedLevel)
    }
  }, [])

  // Save to localStorage when it changes
  const updateExperienceLevel = (level) => {
    setExperienceLevel(level)
    localStorage.setItem('experienceLevel', level)
  }

  return (
    <UserContext.Provider
      value={{
        experienceLevel,
        setExperienceLevel: updateExperienceLevel,
        location,
        setLocation,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
