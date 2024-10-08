import type { SelectChangeEvent } from '@mui/material/Select';

import { useState } from 'react';

import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

type UserTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilter: () => void;
  onAddUser: () => void;
  selectedAgency: string;
  onSelectAgency: (event: SelectChangeEvent<string>) => void;
  selectedStatus: string;
  onSelectStatus: (event: SelectChangeEvent<string>) => void;
};

export function UserTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  onClearFilter,
  onAddUser,
  selectedAgency,
  onSelectAgency,
  selectedStatus,
  onSelectStatus,
}: UserTableToolbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearFilters = () => {
    onClearFilter();
    handleClose(); // Cerrar el popover después de limpiar
  };

  const open = Boolean(anchorEl);

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} seleccionados
        </Typography>
      ) : (
        <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Buscar..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Eliminar">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Filtrar lista">
            <IconButton onClick={handleClick}>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <Select
                value={selectedAgency}
                onChange={onSelectAgency}
                displayEmpty
                sx={{ minWidth: 120, marginBottom: 2, fontSize: '0.875rem' }}
              >
                <MenuItem value="">
                  <em>Agencia</em>
                </MenuItem>
                <MenuItem value="Agencia A">Agencia A</MenuItem>
                <MenuItem value="Agencia B">Agencia B</MenuItem>
                <MenuItem value="Agencia C">Agencia C</MenuItem>
              </Select>
              <Select
                value={selectedStatus}
                onChange={onSelectStatus}
                displayEmpty
                sx={{ minWidth: 120, marginBottom: 2, fontSize: '0.875rem' }}
              >
                <MenuItem value="">
                  <em>Estado</em>
                </MenuItem>
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </Select>
              <Button
                variant="contained"
                onClick={handleClearFilters}
                sx={{ marginTop: 2, fontSize: '0.875rem' }}
              >
                Borrar Filtros
              </Button>
            </div>
          </Popover>
        </>
      )}
    </Toolbar>
  );
}