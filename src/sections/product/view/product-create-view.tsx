import type { SelectChangeEvent } from '@mui/material/Select';

import { useState } from 'react';

import { Box, Card, Button, Select, MenuItem, TextField, Typography, InputLabel, FormControl } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ProductProps } from '../product-table-row';

interface CreateUserViewProps {
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

export function CreateProductView({ onClose, onSave }: CreateUserViewProps) {
  const [formData, setFormData] = useState<ProductProps>({
    _id: '',
    item: 0,
    nombre: '',
    categoria: '', // Aquí se guardará la letra correspondiente
    grupo_desc: '',
    tipo: '',
    precio: 0,
    presentacion: '',
    cta_cont: '',
    codigo: '',
    visible: 1,
  });

  const handleSave = async () => {
    if (!formData.nombre || !formData.categoria || !formData.grupo_desc || !formData.tipo || !formData.precio || !formData.presentacion || !formData.cta_cont) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    await onSave(formData);
    onClose();
  };

  return (
    <Box>
      <Typography variant="h4">Crear Nuevo Producto</Typography>
      <Card sx={{ p: 3 }}>
        <TextField
          label="Nombre del producto"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Grupo</InputLabel>
          <Select
            label="Grupo"
            value={formData.grupo_desc}
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
            <MenuItem value="interno">Interno</MenuItem>
            <MenuItem value="externo">Externo</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Precio"
          type="number"
          value={formData.precio}
          onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
          fullWidth
          margin="normal"
          required
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

        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} startIcon={<Iconify icon="mingcute:add-line" />}>
          Crear Producto
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>Cancelar</Button>
      </Card>
    </Box>
  );
}