import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { FormEvent, useState } from 'react'
import { login as loginApi } from '../lib/api'
import { useAuth } from '../state/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@demo.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const res = await loginApi(email, password)
      login(res.access_token)
      nav('/books')
    } catch (err: any) {
      setError(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 460, mx:'auto', mt: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Iniciar sesión</Typography>
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField label="Email" fullWidth value={email} onChange={e=>setEmail(e.target.value)} />
              <TextField label="Password" type="password" fullWidth value={password} onChange={e=>setPassword(e.target.value)} />
              {error && <Typography color="error" variant="body2">{error}</Typography>}
              <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
