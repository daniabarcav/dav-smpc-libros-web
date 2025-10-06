import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth'
import { getBook, deleteBook, restoreBook } from '../lib/api'
import { 
  Card, CardContent, Grid, Stack, Typography, Button, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Chip
} from '@mui/material'

export default function BookDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const nav = useNavigate()
  const [book, setBook] = useState<any | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    (async () => {
      if (token && id) {
        const b = await getBook(id, token)
        setBook(b)
      }
    })()
  }, [id, token])

  const handleDelete = async () => {
    if (!token || !id) return
    try {
      await deleteBook(id, token)
      setOpenDialog(false)
      nav('/books')
    } catch (error) {
      console.error('Error al eliminar:', error)
      alert('Error al eliminar el libro')
    }
  }

  const handleRestore = async () => {
    if (!token || !id) return
    try {
      await restoreBook(id, token)
      // Recargar el libro actualizado
      const b = await getBook(id, token)
      setBook(b)
    } catch (error) {
      console.error('Error al restaurar:', error)
      alert('Error al restaurar el libro')
    }
  }

  if (!book) return <Card><CardContent><Typography>Cargando...</Typography></CardContent></Card>

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h5">{book.title}</Typography>
              {book.deletedAt && (
                <Chip label="Eliminado" color="error" size="small" />
              )}
            </Stack>
            
            <Stack spacing={1}>
              <Typography><b>Autor:</b> {book.author}</Typography>
              <Typography><b>Editorial:</b> {book.publisher || '-'}</Typography>
              <Typography><b>Género:</b> {book.genre || '-'}</Typography>
              <Typography><b>Disponible:</b> {book.available ? 'Sí' : 'No'}</Typography>
              <Typography><b>Año:</b> {book.year}</Typography>
              <Typography><b>Precio:</b> ${Number(book.price).toFixed(2)}</Typography>
              <Typography><b>Creado:</b> {new Date(book.createdAt).toLocaleString()}</Typography>
              <Typography><b>Actualizado:</b> {new Date(book.updatedAt).toLocaleString()}</Typography>
              {book.deletedAt && (
                <Typography color="error"><b>Eliminado:</b> {new Date(book.deletedAt).toLocaleString()}</Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button 
                component={RouterLink} 
                to="/books" 
                variant="outlined"
              >
                Volver
              </Button>
              
              <Button 
                component={RouterLink} 
                to={`/books/${book.id}/edit`} 
                variant="outlined"
              >
                Editar
              </Button>
              
              {!book.deletedAt ? (
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => setOpenDialog(true)}
                >
                  Eliminar
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  color="success"
                  onClick={handleRestore}
                >
                  Restaurar
                </Button>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            {book.coverUrl && (
              <img 
                src={book.coverUrl} 
                alt="cover" 
                style={{ width: '100%', borderRadius: 8 }} 
                onError={(e) => {
                  console.error('Error cargando imagen:', book.coverUrl);
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </Grid>
        </Grid>
        {}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>¿Eliminar libro?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que quieres eliminar "{book.title}"? 
              Podrás restaurarlo después desde la lista de libros.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}