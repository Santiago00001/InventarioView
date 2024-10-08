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

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

export type AgenciaProps = {
  _id: string;
  item: number;
  cod: number;
  nombre: string;
  coordinador: string;
  director: string;
};

export type UserProps = {
  _id: string;
  item: number;
  nombres: string;
  apellidos: string;
  cc: string;
  cargo: string;
  correo: string;
  agencia: AgenciaProps;
  rol?: string;
  verificacion?: boolean;
  status?: string;
  visible: number;
};

// Tipo para actualizar el usuario, con agencia como string o null
export type UserUpdateProps = {
  _id: string;
  item: number;
  nombres: string;
  apellidos: string;
  cc: string;
  cargo: string;
  agencia: string | null; // Permitir null para el caso de no tener agencia
  rol?: string;
  verificacion?: boolean;
  status?: string;
  visible: number;
};

export type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onEditUser: (user: UserProps) => void;
  onDeleteUser: (id: string) => Promise<void>;
  index: number; // Define el tipo de index
};

export function UserTableRow({ row, selected, index, onSelectRow, onEditUser, onDeleteUser }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    onEditUser(row);
    handleClosePopover();
  };

  const handleDelete = () => {
    onDeleteUser(row._id);
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell align="center">{index}</TableCell> {/* Celda para el número de la fila */}
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={`${row.nombres} ${row.apellidos}`} sx={{ bgcolor: 'primary.main' }}>
              {row.nombres.charAt(0)}{row.apellidos.charAt(0)}  {/* Iniciales del usuario */}
            </Avatar>
            {row.nombres}
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box display="flex" alignItems="center">
            {row.apellidos}
          </Box>
        </TableCell>

        <TableCell>{row.cc}</TableCell>

        <TableCell>{row.cargo}</TableCell>
        
        <TableCell>{row.correo}</TableCell>

        {/* Ahora accediendo al campo nombre del objeto agencia */}
        <TableCell>{row.agencia?.nombre}</TableCell>

        <TableCell>{row.rol}</TableCell>

        <TableCell>
          <Label color={(row.status === 'inactivo' && 'error') || 'success'}>{row.status}</Label>
        </TableCell>

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