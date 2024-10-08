// eslint-disable-next-line import/no-extraneous-dependencies
import type { SelectChangeEvent } from '@mui/material';

// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination'; // Asegúrate de que está importado
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useCreateProviderDialog } from 'src/hooks/use-provider-dialog';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { applyFilter, getComparator } from 'src/sections/providers/utils';

import { TableNoData } from '../providers-no-data';
import { ProductTableRow } from '../provider-table-row'; // Asegúrate de que sea el componente correcto

import { EditProviderView } from './provider-edit-dialog';
import { ProviderTableHead } from '../provider-table-head';
import { ProviderTableToolbar } from '../provider-filters';

import type { ProviderProps } from '../provider-table-row';

export function ProviderView() {
  const [filterName, setFilterName] = useState<string>('');
  const [providers, setProviders] = useState<ProviderProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<ProviderProps | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSaveProduct = async (provider: ProviderProps): Promise<void> => {
    if (provider._id) {
      try {
        const response = await axios.put(`http://localhost:3000/api/providers/${provider._id}`, provider);
        const updatedProduct: ProviderProps = response.data;
        setProviders((prev) =>
          prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
        );

        setEditMode(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error('Error actualizando el producto:', error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:3000/api/providers', provider);
        const newProvider: ProviderProps = response.data;
        setProviders((prev) => [...prev, newProvider]);
        setEditMode(false);
      } catch (error) {
        console.error('Error creando el producto:', error);
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/providers');
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const { data } = response;
      setProviders(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const dataFiltered: ProviderProps[] = applyFilter({
    inputData: providers,
    comparator: getComparator('asc', 'nombre'),
    filterName,
    selectedCategory,
    selectedTipo,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleClearFilter = () => {
    setFilterName('');
    setSelectedCategory('');
    setSelectedTipo('');
  };

  const handleEditProduct = (provider: ProviderProps) => {
    setSelectedProduct(provider);
    setEditMode(true); // Abre el diálogo al editar
  };

  const handleCloseEditDialog = () => {
    setEditMode(false);
    setSelectedProduct(null); // Limpiar el producto seleccionado
  };

  const handleDeleteProduct = async (_id: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/providers/${_id}`);
        setProviders((prev) => prev.filter(provider => provider._id !== _id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const { AddProductDialog, handleOpenAddProductModal } = useCreateProviderDialog(handleSaveProduct);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Proveedores
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenAddProductModal}
        >
          Nuevo proveedor
        </Button>
      </Box>

      <Card>
        <ProviderTableToolbar
          numSelected={0}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
          }}
          onClearFilter={handleClearFilter}
          onAddProduct={handleOpenAddProductModal}
          selectedCategory={selectedCategory}
          onSelectedCategory={(event: SelectChangeEvent<string>) => setSelectedCategory(event.target.value)} // Manejador ajustado
          selectedTipo={selectedTipo}
          onselectedTipo={(event: SelectChangeEvent<string>) => setSelectedTipo(event.target.value)} // Manejador ajustado
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProviderTableHead
                order="asc"
                orderBy="nombre"
                rowCount={providers.length}
                numSelected={0}
                onSort={() => { }}
                onSelectAllRows={() => { }}
                headLabel={[
                  { id: 'number', label: '#', align: 'center' }, // Nueva columna para la numeración
                  { id: 'nit', label: 'Nit' },
                  { id: 'razon_social', label: 'Razón Social' },
                  { id: 'ciudad', label: 'Ciudad' },
                  { id: 'contacto', label: 'Contacto' },
                  { id: 'correo', label: 'Correo' },
                  { id: 'act_eco', label: 'Actividad Económica' },
                  { id: 'tel', label: 'Teléfono' },
                  { id: 'cel', label: 'Celular' },
                  { id: 'ver_ins', label: 'Verificación INS', align: 'center' },
                  { id: 'ver_dat', label: 'Verificación DAT', align: 'center' },
                  { id: 'acciones', label: 'Acciones' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Cargando...</TableCell>
                  </TableRow>
                ) : (
                  dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <ProductTableRow
                        key={row._id}
                        row={row}
                        selected={selectedRows.includes(row._id)} // Indica si la fila está seleccionada
                        onSelectRow={() => handleSelectRow(row._id)} // Manejo de selección de fila
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                        index={page * rowsPerPage + index + 1} // Calcula el número según la página actual
                      />
                    ))
                )}
                {notFound && (
                  <TableNoData
                    title="No hay productos encontrados"
                    searchQuery={filterName} // Aquí se pasa la propiedad requerida
                    sx={{
                      gridColumn: 'span 5',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  />
                )}

              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Card>
      {AddProductDialog}

      <Dialog open={editMode} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Proveedor</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <EditProviderView
              provider={selectedProduct}
              onClose={handleCloseEditDialog}
              onSave={handleSaveProduct}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('nombres');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    },
    []
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}