import type { SelectChangeEvent } from '@mui/material/Select';

import { useEffect, useState } from 'react';

import { Box, Card, Button, Select, MenuItem, TextField, Typography, InputLabel, FormControl } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ProductProps } from '../product-table-row';

interface CreateUserViewProps {
  product: ProductProps;
  onClose: () => void;
  onSave: (product: ProductProps) => Promise<void>;
}

interface Category {
  name: string;
  categoryLetter: string;
  cta_cont: number;
}

// New function to fetch categories from the backend
async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}api/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export function CreateProductView({ product, onClose, onSave }: CreateUserViewProps) {
  const [categories, setCategories] = useState<Category[]>([]); // State to hold categories from the backend
  const [customGroup, setCustomGroup] = useState(''); // Estado para el grupo personalizado
  const [customCategory, setCustomCategory] = useState(''); // Estado para la letra de la categoría personalizada
  const [customCtaCont, setCustomCtaCont] = useState<number | ''>(''); // Estado para el código contable personalizado
  const [isCustomGroup, setIsCustomGroup] = useState(false); // Controla si se muestra el campo personalizado
  const [formData, setFormData] = useState<ProductProps>({
    _id: '',
    item: 0,
    nombre: '',
    categoria: '',
    grupo_desc: '',
    tipo: '',
    presentacion: '',
    cta_cont: 0,
    codigo: 0,
    visible: 1,
  });

    // Fetch categories when the component mounts
    useEffect(() => {
      fetchCategories()
        .then((fetchedCategories) => setCategories(fetchedCategories))
        .catch((error) => console.error('Error fetching categories:', error));
    }, []);
  
    useEffect(() => {
      setFormData(product);
    }, [product]);

  const handleSave = async () => {
    if (!formData.nombre || !formData.categoria || !formData.grupo_desc || !formData.tipo || !formData.presentacion || !formData.cta_cont) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    await onSave(formData);
    onClose();
  };

  const handleGroupChange = (event: SelectChangeEvent<string>) => {
    const selectedGroup = event.target.value;

    if (selectedGroup === 'OTRO') {
      setIsCustomGroup(true); // Mostrar campo de texto para grupo personalizado
      setFormData((prevFormData) => ({
        ...prevFormData,
        grupo_desc: '', // Limpia el valor del grupo
        categoria: '' as Category['categoryLetter'], // Limpia la categoría
        cta_cont: 0, // Limpia el código contable
      }));
    } else {
      setIsCustomGroup(false); // Oculta el campo de texto personalizado
      const groupData = categories.find((category) => category.name === selectedGroup);
      setFormData((prevFormData) => ({
        ...prevFormData,
        grupo_desc: selectedGroup,
        categoria: groupData?.categoryLetter ?? '', // Categoría si existe
        cta_cont: groupData?.cta_cont ?? 0, // Código contable si existe
      }));
    }
  };

  const handleAddCustomGroup = async () => {
    if (customGroup && customCategory && customCtaCont && !categories.some((cat) => cat.name === customGroup)) {
      const newCategory = {
        name: customGroup,
        categoryLetter: customCategory,
        cta_cont: Number(customCtaCont),
      };

      try {
        // Hacer una petición POST al backend para guardar la nueva categoría
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}api/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCategory),
        });

        if (!response.ok) {
          throw new Error('Failed to save category');
        }

        // Si la categoría se guarda correctamente, actualiza el estado de categorías
        const savedCategory = await response.json();
        setCategories([...categories, savedCategory]);

        // Actualiza el formulario con el nuevo grupo
        setFormData({
          ...formData,
          grupo_desc: customGroup,
          categoria: customCategory as Category['categoryLetter'],
          cta_cont: Number(customCtaCont),
        });

        // Restablece los campos de la categoría personalizada
        setIsCustomGroup(false);
        setCustomGroup('');
        setCustomCategory('');
        setCustomCtaCont('');

      } catch (error) {
        console.error('Error saving category:', error);
        alert('Failed to save the category. Please try again.');
      }
    }
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
            onChange={handleGroupChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.name} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
            <MenuItem value="OTRO">OTRO</MenuItem>
          </Select>
        </FormControl>

        {/* Mostrar campos si selecciona "OTRO" */}
        {isCustomGroup && (
          <>
            <TextField
              label="Nombre del grupo personalizado"
              value={customGroup}
              onChange={(e) => setCustomGroup(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Letra de la categoría"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value.toUpperCase())} // Asegúrate de que sea una letra mayúscula
              fullWidth
              margin="normal"
            />
            <TextField
              label="Código contable (CTA CONT)"
              value={customCtaCont}
              onChange={(e) => setCustomCtaCont(Number(e.target.value) || '')} // Convertir a número
              fullWidth
              margin="normal"
              type="number"
            />
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              onClick={handleAddCustomGroup}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Agregar nuevo grupo
            </Button>
          </>
        )}
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