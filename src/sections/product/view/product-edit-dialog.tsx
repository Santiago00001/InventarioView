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
const groupToCtaMap: Record<string, { category: Category; cta_cont: number }> = {
  ASEO: { category: 'A', cta_cont: 511018 },
  CAFETERIA: { category: 'C', cta_cont: 511020 },
  MERCADEO: { category: 'M', cta_cont: 511034 },
  PAPELERÍA: { category: 'P', cta_cont: 511028 },
  'REPUESTOS DE MTO': { category: 'R', cta_cont: 511012 },
  'SISTEMAS INSUMOS': { category: 'S', cta_cont: 511058 },
  TAMIZAJE: { category: 'T', cta_cont: 511068 },
};

async function updateProduct(ProductId: string, productData: ProductProps) {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}api/products/${ProductId}`, {
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
          value={formData._id}
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
            value={formData.grupo_desc}
            onChange={(e: SelectChangeEvent<string>) => {
              const selectedGroup = e.target.value;
              const groupData = groupToCtaMap[selectedGroup];

              setFormData((prevFormData) => ({
                ...prevFormData,
                grupo_desc: selectedGroup,
                categoria: groupData.category, // Actualiza la categoría
                cta_cont: groupData.cta_cont, // Actualiza el código contable
              }));
            }}
          >
            <MenuItem value="ASEO">Aseo</MenuItem>
            <MenuItem value="CAFETERIA">Cafeteria</MenuItem>
            <MenuItem value="MERCADEO">Mercadeo</MenuItem>
            <MenuItem value="PAPELERÍA">Papeleria</MenuItem>
            <MenuItem value="REPUESTOS DE MTO">Repuestos de Mantenimiento</MenuItem>
            <MenuItem value="SISTEMAS INSUMOS">Sistemas insumos</MenuItem>
            <MenuItem value="TAMIZAJE">Tamizaje</MenuItem>
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
          onChange={(e) => setFormData({ ...formData, codigo: Number(e.target.value) })} // Convierte a número
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