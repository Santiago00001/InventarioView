// eslint-disable-next-line import/no-extraneous-dependencies
import type { SelectChangeEvent } from '@mui/material';

// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { useState, useEffect } from 'react';

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
import DialogContent from '@mui/material/DialogContent';

import { useCreateProviderDialog } from 'src/hooks/use-provider-dialog';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { applyFilter, getComparator } from 'src/sections/providers/utils';

import { TableNoData } from '../providers-no-data';
import { ProviderTableRow } from '../provider-table-row'; // Asegúrate de que sea el componente correcto

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIns, setSelectedIns] = useState<boolean>(false);
  const [selectedDat, setSelectedDat] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('item');
  const [searchField, setSearchField] = useState("Razon Social");

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSaveProduct = async (provider: ProviderProps): Promise<void> => {
    if (provider._id) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}api/providers/${provider._id}`, provider);
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
        const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}api/providers`, provider);
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
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/providers`);
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
    comparator: getComparator(order, orderBy), // Asegúrate de usar el estado actual
    filterName,
    selectedIns,
    selectedDat,
    searchField,
  });

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const notFound = !dataFiltered.length && !!filterName;

  const handleClearFilter = () => {
    setFilterName('');
    setSelectedIns(false);
    setSelectedDat(false);
    setSearchField('Razon Social');
  };

  const handleSearchFieldChange = (event: SelectChangeEvent<string>) => {
    setSearchField(event.target.value); // Asegúrate de manejar correctamente el evento
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
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}api/providers/${_id}`);
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

          selectedIns={selectedIns}
          onSelectedIns={(event: SelectChangeEvent<string>) => {
            const {value} = event.target;
            setSelectedIns(value === "true");
          }}

          selectedDat={selectedDat}
          onSelectedDat={(event: SelectChangeEvent<string>) => {
            const {value} = event.target;
            setSelectedDat(value === "true");
          }}

          searchField={searchField}
          onSearchFieldChange={handleSearchFieldChange}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProviderTableHead
                order={order}
                orderBy={orderBy}
                rowCount={providers.length}
                numSelected={0}
                onSort={handleRequestSort} // Pasa el manejador aquí
                onSelectAllRows={() => { }}
                headLabel={[
                  { id: 'item', label: 'Item', align: 'center' }, // Nueva columna para la numeración
                  { id: 'nit', label: 'Nit' },
                  { id: 'razon_social', label: 'Razón Social' },
                  { id: 'direccion', label: 'Direccion' },
                  { id: 'ciudad', label: 'Ciudad' },
                  { id: 'tel', label: 'Teléfono' },
                  { id: 'cel', label: 'Celular' },
                  { id: 'correo', label: 'Correo' },
                  { id: 'contacto', label: 'Contacto' },
                  { id: 'act_eco', label: 'Actividad Económica' },
                  { id: 'fecha_inag', label: 'Fecha Fundacion' },
                  { id: 'cod_ins', label: 'Codigo INS' },
                  { id: 'cod_ins_fecha', label: 'Fecha INS' },
                  { id: 'ver_ins', label: 'Verificacion INS' },
                  { id: 'cod_dat', label: 'Codigo DAT' },
                  { id: 'cod_dat_fecha', label: 'Fecha DAT' },
                  { id: 'ver_dat', label: 'Verificacion DAT' },
                  { id: '' },
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
                      <ProviderTableRow
                        key={row._id}
                        row={row}
                        selected={selectedRows.includes(row._id)} // Indica si la fila está seleccionada
                        onSelectRow={() => handleSelectRow(row._id)} // Manejo de selección de fila
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
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
          rowsPerPageOptions={[5, 10, 25, 100, 500]}
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

      {/* Modal para editar el proveedor */}
      <Dialog open={editMode} onClose={handleCloseEditDialog}>
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