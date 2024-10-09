import type { SelectChangeEvent } from '@mui/material';

import { useState } from 'react';

import { Box, Card, Button, Select, Checkbox, MenuItem, TextField, Typography, InputLabel, FormControl, FormControlLabel } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { UserProps, AgenciaProps } from '../agency-table-row';

interface CreateUserViewProps {
  onClose: () => void;
  onSave: (user: UserProps) => Promise<void>;
  agencies: AgenciaProps[];
}

export function CreateUserView({ onClose, onSave, agencies }: CreateUserViewProps) {
  const [formData, setFormData] = useState<UserProps>({
    _id: '',
    item: 0,
    nombres: '',
    apellidos: '',
    cc: '',
    cargo: '',
    correo: '',
    agencia: {
      _id: '', // Solo almacenamos el _id de la agencia
      item: 0,
      cod: 0,
      nombre: '',
      coordinador: '',
      director: '',
    },
    rol: '',
    verificacion: false,
    status: '',
    visible: 0,
  });

  const handleSave = async () => {
    if (
      !formData.nombres ||
      !formData.apellidos ||
      !formData.cc ||
      !formData.agencia._id || // Verificamos que _id de la agencia no esté vacío
      !formData.rol ||
      !formData.status
    ) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    await onSave(formData);
    onClose();
  };

  const handleAgencyChange = (event: SelectChangeEvent<string>) => {
    const selectedAgencyId = event.target.value; // Ahora el valor es del tipo string
    const selectedAgency = agencies.find(agency => agency._id === selectedAgencyId);
    if (selectedAgency) {
      setFormData({
        ...formData,
        agencia: {
          _id: selectedAgency._id,
          item: selectedAgency.item,
          cod: selectedAgency.cod,
          nombre: selectedAgency.nombre,
          coordinador: selectedAgency.coordinador,
          director: selectedAgency.director,
        },
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4">Crear Nuevo Usuario</Typography>
      <Card sx={{ p: 3 }}>
        <TextField
          label="Nombres"
          value={formData.nombres}
          onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Apellidos"
          value={formData.apellidos}
          onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="CC"
          value={formData.cc}
          onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Cargo"
          value={formData.cargo}
          onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Correo"
          value={formData.correo}
          onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        {/* Selección de Agencia */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Agencia</InputLabel>
          <Select
            label="Agencia"
            value={formData.agencia._id}
            onChange={handleAgencyChange}
          >
            {agencies.map(agency => (
              <MenuItem key={agency._id} value={agency._id}>
                {agency.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Rol</InputLabel>
          <Select
            label="Rol"
            value={formData.rol}
            onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Agencia">Agencia</MenuItem>
            <MenuItem value="Coordinacion">Coordinacion</MenuItem>
            <MenuItem value="Jefatura">Jefatura</MenuItem>
            <MenuItem value="Almacenista">Almacenista</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.verificacion}
              onChange={(e) => setFormData({ ...formData, verificacion: e.target.checked })}
            />
          }
          label="Verificado"
        />
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Estado</InputLabel>
          <Select
            label="Estado"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
            <MenuItem value="suspendido">Suspendido</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} startIcon={<Iconify icon="mingcute:add-line" />}>
          Crear Usuario
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>Cancelar</Button>
      </Card>
    </Box>
  );
}