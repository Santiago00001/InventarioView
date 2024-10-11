import { useState } from 'react';

import { Box, Card, Button, TextField, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ProviderProps } from '../provider-table-row';

interface CreateProviderViewProps {
  onClose: () => void;
  onSave: (provider: ProviderProps) => Promise<void>;
}

export function CreateProviderView({ onClose, onSave }: CreateProviderViewProps) {
  const [formData, setFormData] = useState<ProviderProps>({
    _id: '',
    nit: '',
    razon_social: '',
    direccion: '',
    ciudad: '',
    tel: '',
    cel: '',
    correo: '',
    contacto: '',
    act_eco: '',
    fecha_inag: new Date(),
    cod_ins: '',
    cod_ins_fecha: new Date(),
    ver_ins: false,
    cod_dat: '',
    cod_dat_fecha: new Date(),
    ver_dat: false,
    visible: 1,
  });

  const handleSave = async () => {
    // Validaciones básicas para campos requeridos
    if (!formData.nit || !formData.razon_social || !formData.direccion ||
      !formData.ciudad || !formData.tel || !formData.cel ||
      !formData.correo || !formData.contacto ||
      !formData.act_eco || !formData.fecha_inag) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    // En este caso, `fecha_inag` ya está en el formato adecuado (YYYY-MM-DD)
    await onSave(formData);
    onClose();
  };

  return (
    <Box>
      <Typography variant="h4">Crear Nuevo Proveedor</Typography>
      <Card sx={{ p: 3 }}>
        <TextField
          label="NIT"
          value={formData.nit}
          onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Razón Social"
          value={formData.razon_social}
          onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Dirección"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Ciudad"
          value={formData.ciudad}
          onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Teléfono"
          value={formData.tel}
          onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Celular"
          value={formData.cel}
          onChange={(e) => setFormData({ ...formData, cel: e.target.value })}
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
        <TextField
          label="Contacto"
          value={formData.contacto}
          onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Actividad Económica"
          value={formData.act_eco}
          onChange={(e) => setFormData({ ...formData, act_eco: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Fecha de Ingreso"
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
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={handleSave}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Crear Proveedor
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>
          Cancelar
        </Button>
      </Card>
    </Box>
  );
}