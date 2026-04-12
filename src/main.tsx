import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { CartProvider } from './context/CartContext'
import { NotificationProvider } from './context/NotificationContext'
import { UserProvider } from './context/UserContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <NotificationProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </NotificationProvider>
    </UserProvider>
  </React.StrictMode>,
)