import type { ProductProps } from 'src/sections/product/product-table-row';

import { useState } from 'react';

import { Dialog, DialogContent } from '@mui/material';

import { CreateProductView } from 'src/sections/product/view/product-create-view';

export function useCreateProductDialog(onSave: (product: ProductProps) => Promise<void>) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const AddProductDialog = (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <CreateProductView
          onClose={handleClose}
          onSave={async (product) => {
            await onSave(product); // Llama a la función para guardar el usuario
            handleClose(); // Cierra el modal
          }}
        />
      </DialogContent>
    </Dialog>
  );

  return { AddProductDialog, handleOpenAddProductModal: handleOpen };
}