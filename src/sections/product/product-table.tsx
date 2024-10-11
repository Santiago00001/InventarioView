import React from 'react';

import { Table, TableRow, TableBody, TableCell, TableHead, Typography, TableContainer } from '@mui/material';

export type ProductProps = {
  _id: string;
  item: number;
  nombre: string;
  categoria: string;
  grupo_desc: string;
  tipo: string;
  precio: number;
  presentacion: string;
  cta_cont: number;
  codigo: number;
  visible: number;
};

type ProductTableProps = {
  products: ProductProps[];
};

export function ProductTable({ products }: ProductTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Código</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Grupo</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Presentacion</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.codigo}>
              <TableCell>
                <Typography variant="body2">{product.item}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">{product.nombre}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{product.categoria}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{product.grupo_desc}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{product.tipo}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{product.presentacion}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{product.codigo}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}