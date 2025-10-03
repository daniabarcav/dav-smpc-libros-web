import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import BooksList from './pages/BooksList'
import BookDetail from './pages/BookDetail'
import { useAuth } from './state/auth'
import Layout from './components/Layout'
import BookForm from './pages/BookForm'

function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/books" element={<Protected><BooksList/></Protected>} />
        <Route path="/books/new" element={<Protected><BookForm/></Protected>} />
        <Route path="/books/:id" element={<Protected><BookDetail/></Protected>} />
        <Route path="/books/:id/edit" element={<Protected><BookForm/></Protected>} />
        <Route path="*" element={<Navigate to="/books" />} />
      </Routes>
    </Layout>
  )
}
