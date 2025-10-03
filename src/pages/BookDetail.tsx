import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../state/auth'
import { getBook } from '../lib/api'
import { Card, CardContent, Grid, Stack, Typography, Button } from '@mui/material'

export default function BookDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [book, setBook] = useState<any | null>(null)

  useEffect(() => {
    (async () => {
      if (token && id) {
        const b = await getBook(id, token)
        setBook(b)
      }
    })()
  }, [id, token])

  if (!book) return <Card><CardContent><Typography>Cargando...</Typography></CardContent></Card>

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>{book.title}</Typography>
            <Stack spacing={1}>
              <Typography><b>Autor:</b> {book.author}</Typography>
              <Typography><b>Editorial:</b> {book.publisher || '-'}</Typography>
              <Typography><b>Género:</b> {book.genre || '-'}</Typography>
              <Typography><b>Disponible:</b> {book.available ? 'Sí' : 'No'}</Typography>
              <Typography><b>Año:</b> {book.year}</Typography>
              <Typography><b>Precio:</b> ${Number(book.price).toFixed(2)}</Typography>
              <Typography><b>Creado:</b> {new Date(book.createdAt).toLocaleString()}</Typography>
              <Typography><b>Actualizado:</b> {new Date(book.updatedAt).toLocaleString()}</Typography>
              <Button component={RouterLink} to={`/books/${book.id}/edit`} variant="outlined">Editar</Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            {book.coverUrl && <img src={book.coverUrl} alt="cover" style={{ width: '100%', borderRadius: 8 }} />}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
