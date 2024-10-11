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
const groupToCtaMap: Record<string, { category: Category; cta_cont: number }> = {
  ASEO: { category: 'A', cta_cont: 511018 },
  CAFETERIA: { category: 'C', cta_cont: 511020 },
  MERCADEO: { category: 'M', cta_cont: 511034 },
  PAPELERÍA: { category: 'P', cta_cont: 511028 },
  'REPUESTOS DE MTO': { category: 'R', cta_cont: 511012 },
  'SISTEMAS INSUMOS': { category: 'S', cta_cont: 511058 },
  TAMIZAJE: { category: 'T', cta_cont: 511068 },
};

export function CreateProductView({ onClose, onSave }: CreateUserViewProps) {
  const [formData, setFormData] = useState<ProductProps>({
    _id: '',
    item: 0,
    nombre: '',
    categoria: '', // Aquí se guardará la letra correspondiente
    grupo_desc: '',
    tipo: '',
    presentacion: '',
    cta_cont: 0,
    codigo: 0,
    visible: 1,
  });

  const handleSave = async () => {
    if (!formData.nombre || !formData.categoria || !formData.grupo_desc || !formData.tipo || !formData.presentacion || !formData.cta_cont) {
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
            <MenuItem value="FCO">Frasco</MenuItem>
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