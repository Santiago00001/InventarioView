import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Checkbox, FormControlLabel } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import type { ProviderProps } from '../provider-table-row';

interface EditProviderViewProps {
  provider: ProviderProps;
  onClose: () => void;
  onSave: (provider: ProviderProps) => Promise<void>;
}

export function EditProviderView({ provider, onClose, onSave }: EditProviderViewProps) {
  const [formData, setFormData] = useState<ProviderProps>({
    ...provider,
    fecha_inag: new Date(provider.fecha_inag), // Convierte a Date
    cod_ins_fecha: new Date(provider.cod_ins_fecha), // Convierte a Date
    cod_dat_fecha: new Date(provider.cod_dat_fecha), // Convierte a Date
  });

  useEffect(() => {
    setFormData({
      ...provider,
      fecha_inag: new Date(provider.fecha_inag), // Asegura que se convierta a Date
      cod_ins_fecha: new Date(provider.cod_ins_fecha), // Asegura que se convierta a Date
      cod_dat_fecha: new Date(provider.cod_dat_fecha), // Asegura que se convierta a Date
    });
  }, [provider]);

  const handleSave = async () => {
    try {
      await onSave(formData); // Guardamos los cambios
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error updating provider:', error);
    }
  };

  if (!provider) return <Typography>Cargando...</Typography>;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Editar Proveedor
        </Typography>
      </Box>
      <Card sx={{ p: 3 }}>
        <TextField
          label="NIT"
          value={formData.nit}
          onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Razón Social"
          value={formData.razon_social}
          onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Dirección"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Ciudad"
          value={formData.ciudad}
          onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Teléfono"
          value={formData.tel}
          onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Celular"
          value={formData.cel}
          onChange={(e) => setFormData({ ...formData, cel: e.target.value })}
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
        <TextField
          label="Contacto"
          value={formData.contacto}
          onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Actividad Económica"
          value={formData.act_eco}
          onChange={(e) => setFormData({ ...formData, act_eco: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Fundacion"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.fecha_inag.toISOString().split('T')[0]} // Convierte la fecha a formato 'YYYY-MM-DD'
          onChange={(e) => {
            const selectedDate = new Date(e.target.value); // Convierte el valor de string a objeto Date
            setFormData({ ...formData, fecha_inag: selectedDate }); // Actualiza el estado
          }}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Código INS"
          value={formData.cod_ins}
          onChange={(e) => setFormData({ ...formData, cod_ins: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Inscripción"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.cod_ins_fecha.toISOString().split('T')[0]} // Convierte la fecha a formato 'YYYY-MM-DD'
          onChange={(e) => {
            const selectedDate = new Date(e.target.value); // Convierte el valor de string a objeto Date
            setFormData({ ...formData, cod_ins_fecha: selectedDate }); // Actualiza el estado
          }}
          fullWidth
          margin="normal"
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.ver_ins}
              onChange={(e) => setFormData({ ...formData, ver_ins: e.target.checked })}
            />
          }
          label="Verificado INS"
        />
        <TextField
          label="Código DAT"
          value={formData.cod_dat}
          onChange={(e) => setFormData({ ...formData, cod_dat: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Inscripción DAT"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.cod_dat_fecha.toISOString().split('T')[0]} // Convierte la fecha a formato 'YYYY-MM-DD'
          onChange={(e) => {
            const selectedDate = new Date(e.target.value); // Convierte el valor de string a objeto Date
            setFormData({ ...formData, cod_dat_fecha: selectedDate }); // Actualiza el estado
          }}
          fullWidth
          margin="normal"
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.ver_dat}
              onChange={(e) => setFormData({ ...formData, ver_dat: e.target.checked })}
            />
          }
          label="Verificado DAT"
        />
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={handleSave}
            startIcon={<Iconify icon="mingcute:save-line" />}
          >
            Guardar
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </Card>
    </DashboardContent>
  );
}