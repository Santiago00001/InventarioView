
import type { UserProps } from 'src/sections/user/user-table-row';
import type { AgenciaProps } from 'src/sections/agencys/agency-table-row';

import { useState } from 'react';

import { Box, Card, Button, TextField, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface CreateAgencyViewProps {
  onClose: () => void;
  onSave: (agencies: AgenciaProps) => Promise<void>;
  users: UserProps[];
}

export function CreateAgencyView({ onClose, onSave, users }: CreateAgencyViewProps) {
  const [formData, setFormData] = useState<AgenciaProps>({
    _id: '',
    item: 0,
    nombre: '',
    cod: 0,
    coordinador: '',
    director: '',
  }
);

  const handleSave = async () => {
    if (!formData.nombre || !formData.cod || !formData.director) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    await onSave(formData);
    onClose();
  };

  const handleInputChange = (field: keyof AgenciaProps) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h4">Crear Nueva Agencia</Typography>
      <Card sx={{ p: 3 }}>
        <TextField
          label="Nombre de la Agencia"
          value={formData.nombre}
          onChange={handleInputChange('nombre')}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Código"
          value={formData.cod}
          onChange={handleInputChange('cod')}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Coordinador"
          value={formData.coordinador}
          onChange={handleInputChange('coordinador')}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Director"
          value={formData.director}
          onChange={handleInputChange('director')}
          fullWidth
          margin="normal"
          required
        />
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={handleSave}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Crear Agencia
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
      </Card>
    </Box>
  );
}