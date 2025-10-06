// src/pages/BookForm.tsx
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../state/auth'
import { createBook, getBook, updateBook } from '../lib/api'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Box, Button, Card, CardContent, Grid, Stack, Switch, TextField, Typography, FormControlLabel } from '@mui/material'

const schema = z.object({
  title: z.string().min(2, 'Requerido'),
  author: z.string().min(2, 'Requerido'),
  publisher: z.string().optional(),
  genre: z.string().optional(),
  available: z.boolean().default(true),
  year: z.coerce.number().int().min(0, '>= 0'),
  price: z.coerce.number().min(0, '>= 0'),
})
type FormData = z.infer<typeof schema>

export default function BookForm() {
  const { token } = useAuth()
  const nav = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', author: '', available: true, year: 0, price: 0 }
  })

  useEffect(() => {
    (async () => {
      if (isEdit && token && id) {
        const book = await getBook(id, token)
        reset(book as any)
        setPreview(book.coverUrl || null)
      }
    })()
  }, [isEdit, token, id, reset])

  const onSubmit = handleSubmit(async (data) => {
    if (!token) throw new Error('No token')
    
    const formData = new FormData()
    
    formData.append('title', data.title)
    formData.append('author', data.author)
    if (data.publisher) formData.append('publisher', data.publisher)
    if (data.genre) formData.append('genre', data.genre)
    formData.append('available', String(data.available))
    formData.append('year', String(data.year))
    formData.append('price', String(data.price))
    
    const file = fileRef.current?.files?.[0]
    if (file) {
      formData.append('cover', file)
    }
    
    if (isEdit && id) {
      await updateBook(id, formData, token)
    } else {
      await createBook(formData, token)
    }
    nav('/books')
  })

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>{isEdit ? 'Editar libro' : 'Nuevo libro'}</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Título" fullWidth {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Autor" fullWidth {...register('author')} error={!!errors.author} helperText={errors.author?.message} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Editorial" fullWidth {...register('publisher')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Género" fullWidth {...register('genre')} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Año" type="number" fullWidth {...register('year', { valueAsNumber: true })} error={!!errors.year} helperText={errors.year?.message} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Precio" type="number" fullWidth {...register('price', { valueAsNumber: true })} error={!!errors.price} helperText={errors.price?.message} />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel control={<Switch defaultChecked onChange={(_, v)=>setValue('available', v)} />} label="Disponible" />
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack spacing={1}>
                <Button variant="outlined" component="label">
                  Subir imagen
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e)=>{
                    const f = e.target.files?.[0]; if (!f) return; const url = URL.createObjectURL(f); setPreview(url)
                  }}/>
                </Button>
                {preview && <img src={preview} alt="preview" style={{ maxWidth: 160, borderRadius: 8 }} />}
              </Stack>
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">Guardar</Button>
            <Button variant="outlined" onClick={()=>nav('/books')}>Cancelar</Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}