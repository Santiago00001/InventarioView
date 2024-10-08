import type { SelectChangeEvent } from '@mui/material';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Select, MenuItem, Checkbox, InputLabel, FormControl, FormControlLabel } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import type { ProductProps } from '../product-table-row';

interface EditProductViewProps {
  product: ProductProps; // Asegúrate de que ProductItemProps está definido correctamente
  onClose: () => void;
  onSave: (product: ProductProps) => Promise<void>;
}

// Define un tipo para las categorías
type Category = 'A' | 'C' | 'M' | 'P' | 'R' | 'S' | 'T';

// Mapeo de categorías a letras
const categoryToLetterMap: Record<string, Category> = {
  Aseo: 'A',
  Cafeteria: 'C',
  Mercadeo: 'M',
  Papeleria: 'P',
  'Repuestos de Mantenimiento': 'R',
  'Sistemas de insumos': 'S',
  Tamizaje: 'T',
};

async function updateProduct(ProductId: string, productData: ProductProps) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${ProductId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }
}


export function EditProductView({ product, onClose, onSave }: EditProductViewProps) {
  const [formData, setFormData] = useState<ProductProps>(product);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleSave = async () => {
    try {
      const { _id, ...dataToUpdate } = formData;
      await updateProduct(_id, { _id, ...dataToUpdate }); // Asegúrate de pasar el ID del producto
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  if (!product) return <Typography>Cargando...</Typography>;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Editar Producto
        </Typography>
      </Box>
      <Card sx={{ p: 3 }}>
        <TextField
          label="ID"
          value={formData.item} // Mostrar el ID del producto si es necesario
          disabled
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Grupo</InputLabel>
          <Select
            label="Grupo"
            value={formData.grupo_desc} // Asegurarse de que esté mostrando el nombre del grupo
            onChange={(e: SelectChangeEvent<string>) => {
              const selectedGroup = e.target.value;
              setFormData((prevFormData) => ({
                ...prevFormData,
                grupo_desc: selectedGroup,
                categoria: categoryToLetterMap[selectedGroup], // Actualiza la categoría a la letra correspondiente
              }));
            }}
          >
            <MenuItem value="Aseo">Aseo</MenuItem>
            <MenuItem value="Cafeteria">Cafeteria</MenuItem>
            <MenuItem value="Mercadeo">Mercadeo</MenuItem>
            <MenuItem value="Papeleria">Papeleria</MenuItem>
            <MenuItem value="Repuestos de Mantenimiento">Repuestos de Mantenimiento</MenuItem>
            <MenuItem value="Sistemas de insumos">Sistemas de insumos</MenuItem>
            <MenuItem value="Tamizaje">Tamizaje</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Tipo</InputLabel>
          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          >
            <MenuItem value="I">Interno</MenuItem>
            <MenuItem value="E">Externo</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Precio"
          value={formData.precio}
          onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Presentacion</InputLabel>
          <Select
            label="Presentacion"
            value={formData.presentacion}
            onChange={(e) => setFormData({ ...formData, presentacion: e.target.value })}
          >
            <MenuItem value="UND">Unidad</MenuItem>
            <MenuItem value="GAL">Galon</MenuItem>
            <MenuItem value="PAQ">Paquete</MenuItem>
            <MenuItem value="FCO">Fco</MenuItem>
            <MenuItem value="CAJ">Caja</MenuItem>
            <MenuItem value="BOL">Bolsa</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.visible === 1}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked ? 1 : 0 })}
            />
          }
          label="Visible"
        />
        <TextField
          label="Código"
          value={formData.codigo}
          onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
          fullWidth
          margin="normal"
        />

        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} startIcon={<Iconify icon="mingcute:save-line" />}>
          Guardar
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>
          Cancelar
        </Button>
      </Card>
    </DashboardContent>
  );
}