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

import type { UserProps, AgenciaProps } from '../agency-table-row';

interface EditUserViewProps {
  user: UserProps;
  onClose: () => void;
  onSave: (user: UserProps) => Promise<void>;
  agencies: AgenciaProps[]; // Lista de agencias disponibles
}

export function EditUserView({ user, onClose, onSave, agencies }: EditUserViewProps) {
  const [formData, setFormData] = useState<UserProps>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSave = async () => {
    try {
      await onSave(formData); // Guardamos los cambios
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleAgencyChange = (event: SelectChangeEvent<string>) => {
    const selectedAgencyId = event.target.value;
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

  if (!user) return <Typography>Cargando...</Typography>;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Editar Usuario
        </Typography>
      </Box>
      <Card sx={{ p: 3 }}>
        <TextField
          label="ID"
          value={formData.item}
          disabled
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nombres"
          value={formData.nombres}
          onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Apellidos"
          value={formData.apellidos}
          onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="CC"
          value={formData.cc}
          onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cargo"
          value={formData.cargo}
          onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Correo"
          value={formData.correo}
          onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
          fullWidth
          margin="normal"
        />

        {/* Campo para seleccionar la Agencia */}
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
        <TextField
          select
          label="Estado"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          fullWidth
          margin="normal"
          variant="outlined"
        >
          <MenuItem value="activo">Activo</MenuItem>
          <MenuItem value="inactivo">Inactivo</MenuItem>
          <MenuItem value="suspendido">Suspendido</MenuItem>
        </TextField>

        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} startIcon={<Iconify icon="mingcute:save-line" />}>
          Guardar
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>Cancelar</Button>
      </Card>
    </DashboardContent>
  );
}