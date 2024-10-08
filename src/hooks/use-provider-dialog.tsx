
import type { ProviderProps } from 'src/sections/providers/provider-table-row';

import { useState } from 'react';

import { Dialog, DialogContent } from '@mui/material';

import { CreateProviderView } from 'src/sections/providers/view/provider-create-view';

export function useCreateProviderDialog(onSave: (provider: ProviderProps) => Promise<void>) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const AddProductDialog = (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <CreateProviderView
          onClose={handleClose}
          onSave={async (provider) => {
            await onSave(provider); // Llama a la función para guardar el usuario
            handleClose(); // Cierra el modal
          }}
        />
      </DialogContent>
    </Dialog>
  );

  return { AddProductDialog, handleOpenAddProductModal: handleOpen };
}