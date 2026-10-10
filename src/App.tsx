import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { CategoryPage } from './pages/CategoryPage'
import { HomePage } from './pages/HomePage'
import { IamAdminPage } from './pages/IamAdminPage'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/iamadmin" element={<IamAdminPage />} />
          <Route path="/admin" element={<Navigate to="/iamadmin" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
