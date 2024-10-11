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

import { useCreateProductDialog } from 'src/hooks/use-product-create';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { applyFilter, getComparator } from 'src/sections/product/utils';

import { ProductTableRow } from '../product-table-row'; // Asegúrate de que sea el componente correcto


import { TableNoData } from '../product-no-data';
import { EditProductView } from './product-edit-dialog';
import { ProductTableHead } from '../product-table-head';
import { ProductTableToolbar } from '../product-filters';

import type { ProductProps } from '../product-table-row';

export function ProductsView() {
  const [filterName, setFilterName] = useState<string>('');
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSaveProduct = async (product: ProductProps): Promise<void> => {
    if (product._id) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}api/products/${product._id}`, product);
        const updatedProduct: ProductProps = response.data;
        setProducts((prev) =>
          prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
        );

        setEditMode(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error('Error actualizando el producto:', error);
      }
    } else {
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}api/products`, product);
        const newProduct: ProductProps = response.data;
        setProducts((prev) => [...prev, newProduct]);
        setEditMode(false);
      } catch (error) {
        console.error('Error creando el producto:', error);
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const [productsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_APP_API_URL}api/products`),
      ]);

      if (productsResponse.status !== 200) {
        throw new Error('Failed to fetch products');
      }

      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const dataFiltered: ProductProps[] = applyFilter({
    inputData: products,
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

  const handleEditProduct = (product: ProductProps) => {
    setSelectedProduct(product);
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
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}api/products/${_id}`);
        setProducts((prev) => prev.filter(product => product._id !== _id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const table = {
    page,
    rowsPerPage,
    onSelectRow: handleSelectRow,
    onResetPage: () => setPage(0),
    onChangePage: (event: unknown, newPage: number) => setPage(newPage),
    onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
  };

  const { AddProductDialog, handleOpenAddProductModal } = useCreateProductDialog(handleSaveProduct);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Productos
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenAddProductModal}
        >
          Nuevo producto
        </Button>
      </Box>

      <Card>
        <ProductTableToolbar
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
              <ProductTableHead
                order="asc"
                orderBy="nombre"
                rowCount={products.length}
                numSelected={0}
                onSort={() => { }}
                onSelectAllRows={() => { }}
                headLabel={[
                  { id: 'number', label: '#', align: 'center' }, // Nueva columna para la numeración
                  { id: 'nombre', label: 'Nombre' },
                  { id: 'cod', label: 'Cod CTA' },
                  { id: 'item', label: 'Item' },
                  { id: 'categoria', label: 'Categoría' },
                  { id: 'grupo', label: 'Grupo' },
                  { id: 'tipo', label: 'Tipo' },
                  { id: 'presentacion', label: 'Presentacion' },
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
                      <ProductTableRow
                        key={row.item}
                        row={row}
                        selected={selectedRows.includes(row.item)} // Indica si la fila está seleccionada
                        onSelectRow={() => handleSelectRow(row.item)} // Manejo de selección de fila
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                        index={table.page * table.rowsPerPage + index + 1} // Calcula el número según la página actual
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

      <Dialog open={editMode} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <EditProductView
              product={selectedProduct}
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