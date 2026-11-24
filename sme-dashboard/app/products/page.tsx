'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Snackbar, Alert, Chip,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  category: string;
};

const initialProducts: Product[] = [
  { id: 'PRD-001', name: 'Office Chair Pro', sku: 'CHAIR-001', price: 'R 2,450', stock: 34, category: 'Furniture' },
  { id: 'PRD-002', name: 'Wireless Mouse', sku: 'MOUSE-022', price: 'R 320', stock: 128, category: 'Electronics' },
  { id: 'PRD-003', name: 'A4 Paper Ream', sku: 'PAPER-100', price: 'R 89', stock: 450, category: 'Stationery' },
  { id: 'PRD-004', name: 'Standing Desk', sku: 'DESK-050', price: 'R 5,800', stock: 12, category: 'Furniture' },
  { id: 'PRD-005', name: 'USB-C Hub', sku: 'HUB-015', price: 'R 650', stock: 67, category: 'Electronics' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '', price: '', stock: '', category: '' });

  useEffect(() => {
    const saved = loadFromStorage<Product[]>('sme-products', initialProducts);
    setProducts(saved);
  }, []);

  useEffect(() => {
    saveToStorage('sme-products', products);
  }, [products]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: '', sku: '', price: '', stock: '', category: '' });
  };

  const handleCreate = () => {
    if (!form.name.trim() || !form.price.trim()) return;
    const nextId = `PRD-${String(products.length + 1).padStart(3, '0')}`;
    const priceValue = form.price.startsWith('R') ? form.price : `R ${form.price}`;
    setProducts([{
      id: nextId,
      name: form.name.trim(),
      sku: form.sku.trim() || nextId,
      price: priceValue,
      stock: Number(form.stock) || 0,
      category: form.category.trim() || 'General',
    }, ...products]);
    handleClose();
    setSnackOpen(true);
  };

  const handleDelete = (id: string) => setProducts(products.filter((p) => p.id !== id));

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Products</Typography>
          <Typography variant="body2" color="text.secondary">Manage your product catalogue and stock levels.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>Add Product</Button>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                    <TableCell>{row.sku}</TableCell>
                    <TableCell><Chip label={row.category} size="small" variant="outlined" /></TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color={row.stock < 20 ? 'error.main' : 'text.primary'} fontWeight={row.stock < 20 ? 600 : 400}>
                        {row.stock}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required autoFocus />
          <TextField label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} fullWidth />
          <TextField label="Price (e.g. 450 or R 450)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} fullWidth required />
          <TextField label="Stock quantity" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} fullWidth />
          <TextField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth placeholder="e.g. Electronics, Furniture" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!form.name || !form.price}>Add Product</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSnackOpen(false)}>Product added successfully!</Alert>
      </Snackbar>
    </Box>
  );
}
