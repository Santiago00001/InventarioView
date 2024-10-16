import type { SelectChangeEvent } from '@mui/material';
import type { AgenciaProps } from 'src/sections/agencys/agency-table-row';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Select, MenuItem, InputLabel, FormControl, InputAdornment } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import type { UserProps } from '../user-table-row';

interface EditUserViewProps {
  user: UserProps;
  onClose: () => void;
  onSave: (user: UserProps) => Promise<void>;
  agencies: AgenciaProps[]; // Lista de agencias disponibles
}

export function EditUserView({ user, onClose, onSave, agencies }: EditUserViewProps) {
  const [formData, setFormData] = useState<UserProps>(user);

  useEffect(() => {
    if (user) {
      // Separar el nombre del correo del dominio al cargar el usuario
      setFormData({
        ...user,
        correo: user.correo.split('@')[0], // Obtener solo la parte antes de @
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      // Desestructuramos "status" para no incluirlo en la actualización
      const { status, ...formDataWithoutStatus } = formData;
  
      // Creamos una copia de formDataWithoutStatus y concatenamos el dominio en el campo "correo"
      const updatedUserData = {
        ...formDataWithoutStatus,
        correo: `${formDataWithoutStatus.correo}@coopserp.com`, // Concatenar el dominio
      };
  
      // Guardamos los cambios (sin "status" y con el correo actualizado)
      await onSave(updatedUserData);
  
      // Cierra el modal
      onClose();
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
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Cargo</InputLabel>
          <Select
            label="Cargo"
            value={formData.cargo}
            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
          >
            <MenuItem value="DIRECTOR DE AGENCIA">DIRECTOR DE AGENCIA</MenuItem>
            <MenuItem value="JEFE ÁREA REPORTES">JEFE ÁREA REPORTES</MenuItem>
            <MenuItem value="JEFE DEPARTAMENTO">JEFE DEPARTAMENTO</MenuItem>
            <MenuItem value="DIRECTOR GENERAL">DIRECTOR GENERAL</MenuItem>
            <MenuItem value="OFICIAL DE CUMPLIMIENTO">OFICIAL DE CUMPLIMIENTO</MenuItem>
            <MenuItem value="COORDINADOR DE AGENCIAS">COORDINADOR DE AGENCIAS</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Correo (sin @coopserp.com)"
          value={formData.correo}
          onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">@coopserp.com</InputAdornment>
            ),
          }}
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
                {agency.cod} {agency.nombre}
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
        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} startIcon={<Iconify icon="mingcute:save-line" />}>
          Guardar
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>Cancelar</Button>
      </Card>
    </DashboardContent>
  );
}