import { AppBar, Toolbar, Typography, Stack, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../state/auth'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { token, logout } = useAuth()
  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #1e293b', mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>📚 SMPC -  Libros</Typography>
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/books" color="primary">Libros</Button>
            <Button component={RouterLink} to="/books/new" color="primary" variant="outlined">Nuevo</Button>
            {token
              ? <Button onClick={logout} color="secondary">Salir</Button>
              : <Button component={RouterLink} to="/login" color="secondary">Login</Button>}
          </Stack>
        </Toolbar>
      </AppBar>
      {children}
    </>
  )
}
