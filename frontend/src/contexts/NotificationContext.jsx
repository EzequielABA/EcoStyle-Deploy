import React, { createContext, useContext, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import Notification from '../components/Notification.jsx'

const NotificationContext = createContext({ notify: () => {} })

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const remove = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const notify = useCallback(({ type = 'success', message, duration = 4000 }) => {
    if (!message) return
    const id = Math.random().toString(36).slice(2)
    setNotifications((prev) => [...prev, { id, type, message, duration }])
    setTimeout(() => remove(id), duration)
  }, [remove])

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {createPortal(
        <div className="notification-container">
          {notifications.map((n) => (
            <Notification
              key={n.id}
              type={n.type}
              message={n.message}
              onClose={() => remove(n.id)}
              duration={n.duration}
            />
          ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}