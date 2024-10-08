import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

export type ProviderProps = {
  _id: string;
  nit: string;
  razon_social: string;
  direccion: string;
  ciudad: string;
  tel: string;
  cel: string;
  correo: string;
  contacto: string;
  act_eco: string;
  fecha_inag: Date;
  cod_ins: string;
  cod_ins_fecha: Date;
  ver_ins?: boolean;
  cod_dat: string;
  cod_dat_fecha: Date;
  ver_dat?: boolean;
  visible: number;
};

export type ProviderTableRowProps = {
  row: ProviderProps; // Datos del producto
  selected: boolean; // Estado de selección
  onSelectRow: () => void; // Función para seleccionar la fila
  onEditProduct: (provider: ProviderProps) => void; // Función para editar el producto
  onDeleteProduct: (id: string) => Promise<void>; // Función para eliminar el producto
  index: number; // Define el tipo de index
};

export function ProductTableRow({ row, selected, index, onSelectRow, onEditProduct, onDeleteProduct }: ProviderTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    onEditProduct(row); // Llama al callback para editar el producto
    handleClosePopover();
  };

  const handleDelete = () => {
    onDeleteProduct(row._id); // Llama al callback para eliminar el producto por "item"
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell align="center">{index}</TableCell> {/* Celda para el número de la fila */}

        <TableCell>{row.nit}</TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.razon_social} />
            {row.razon_social}
          </Box>
        </TableCell>

        <TableCell>{row.direccion}</TableCell>
        <TableCell>{row.ciudad}</TableCell>
        <TableCell>{row.tel}</TableCell>
        <TableCell>{row.cel}</TableCell>
        <TableCell>{row.correo}</TableCell>
        <TableCell>{row.contacto}</TableCell>
        <TableCell>{row.act_eco}</TableCell>
        <TableCell>{row.fecha_inag.toString()}</TableCell> {/* Convertir Date a string para mostrar */}
        <TableCell>{row.cod_ins}</TableCell>
        <TableCell>{row.cod_ins_fecha.toString()}</TableCell>
        <TableCell>{row.ver_ins ? 'Sí' : 'No'}</TableCell>
        <TableCell>{row.cod_dat}</TableCell>
        <TableCell>{row.cod_dat_fecha.toString()}</TableCell>
        <TableCell>{row.ver_dat ? 'Sí' : 'No'}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Eliminar
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}