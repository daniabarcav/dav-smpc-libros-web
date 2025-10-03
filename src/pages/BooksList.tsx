import { useAuth } from '../state/auth'
import { useEffect, useMemo, useState } from 'react'
import { BooksQuery, getBooks } from '../lib/api'
import { useDebouncedObject } from '../lib/hooks'
import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, Button } from '@mui/material'
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid'
import { Link as RouterLink } from 'react-router-dom'

export default function BooksList() {
  const { token } = useAuth()
  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0) // 0-based
  const [pageSize, setPageSize] = useState(10)

  const [q, setQ] = useState('')
  const [genre, setGenre] = useState('')
  const [publisher, setPublisher] = useState('')
  const [author, setAuthor] = useState('')
  const [available, setAvailable] = useState('')
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }])

  const debounced = useDebouncedObject({ q, genre, publisher, author, available, page, pageSize, sortModel }, 400)
  const sort = useMemo(() => sortModel.map(s => `${s.field}:${s.sort === 'desc' ? 'desc' : 'asc'}`).join(','), [sortModel])

  async function load() {
      console.log('🔍 Load ejecutado')
  console.log('📝 Valores de filtros:', { q, genre, publisher, author, available })
  console.log('🔑 Token:', token ? 'Existe' : 'No existe')
    if (!token) return
    const query: BooksQuery = { q, genre, publisher, author, available: available || undefined, page: page + 1, limit: pageSize, sort }

      console.log('📤 Query enviada:', query)

    const res = await getBooks(query, token)
      console.log('📥 Respuesta recibida:', res)

    setRows(res.items); setTotal(res.total)
  }
  useEffect(() => { load()/* eslint-disable-next-line */ }, [debounced, token])

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Título', flex: 1 },
    { field: 'author', headerName: 'Autor', flex: 1 },
    { field: 'publisher', headerName: 'Editorial', flex: 1 },
    { field: 'genre', headerName: 'Género', flex: 0.8 },
    { field: 'year', headerName: 'Año', width: 100 },
    { 
      field: 'price', 
      headerName: 'Precio', 
      width: 120,
      renderCell: (params) => {
        const price = Number(params.row.price || 0)
        return `$${price.toLocaleString('es-CL', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })}`
      }
    },
    { 
      field: 'createdAt', 
      headerName: 'Creado', 
      width: 180,
      renderCell: (params) => {
        const value = params.row.createdAt
        if (!value) return '-'
        
        try {
          const date = new Date(value)
          return date.toLocaleString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        } catch (error) {
          return 'Error'
        }
      }
    },
    {
      field: 'actions', 
      headerName: 'Acciones', 
      width: 160, 
      sortable: false,
      renderCell: (params) => (
        <Button component={RouterLink} to={`/books/${params.row.id}`} size="small" variant="outlined">
          Ver
        </Button>
      )
    }
  ]

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Libros</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <TextField label="Buscar" value={q} onChange={e=>{ setQ(e.target.value); setPage(0) }} />
          <TextField label="Género" value={genre} onChange={e=>{ setGenre(e.target.value); setPage(0) }} />
          <TextField label="Editorial" value={publisher} onChange={e=>{ setPublisher(e.target.value); setPage(0) }} />
          <TextField label="Autor" value={author} onChange={e=>{ setAuthor(e.target.value); setPage(0) }} />
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Disponibilidad</InputLabel>
            <Select label="Disponibilidad" value={available} onChange={e=>{ setAvailable(e.target.value); setPage(0) }}>
              <MenuItem value=""><em>Todos</em></MenuItem>
              <MenuItem value="true">Disponible</MenuItem>
              <MenuItem value="false">No disponible</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Box sx={{ height: 560, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(r)=>r.id}
            rowCount={total}
            paginationMode="server"
            sortingMode="server"
            onSortModelChange={(m)=>{ setSortModel(m); setPage(0) }}
            sortModel={sortModel}
            pageSizeOptions={[5,10,20]}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(m)=>{ setPage(m.page); setPageSize(m.pageSize) }}
            disableRowSelectionOnClick
          />
        </Box>
      </CardContent>
    </Card>
  )
}
