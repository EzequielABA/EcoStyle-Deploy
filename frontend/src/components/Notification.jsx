import React, { useEffect } from 'react'
import 'primeicons/primeicons.css'
import '../styles/notifications.css'

function Notification({ type = 'success', message, onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const isSuccess = type === 'success'
  const iconClass = isSuccess ? 'pi pi-check-circle' : 'pi pi-times-circle'

  return (
    <div className={`notification ${isSuccess ? 'success' : 'error'}`} role="status" aria-live="polite">
      <span className={`notification-icon ${iconClass}`} aria-hidden="true"></span>
      <span className="notification-message">{message}</span>
      <button className="notification-close" aria-label="Cerrar" onClick={onClose}>×</button>
    </div>
  )
}

export default Notification;