'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton, Snackbar, Alert,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

type Invoice = {
  id: string;
  customer: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
};

const initialInvoices: Invoice[] = [
  { id: 'INV-001', customer: 'Acme Corp', amount: 'R 12,450', status: 'Paid', date: '2026-09-01' },
  { id: 'INV-002', customer: 'Tech Solutions', amount: 'R 8,200', status: 'Pending', date: '2026-09-02' },
  { id: 'INV-003', customer: 'Green Farms', amount: 'R 15,800', status: 'Paid', date: '2026-09-02' },
  { id: 'INV-004', customer: 'City Builders', amount: 'R 6,750', status: 'Overdue', date: '2026-08-28' },
  { id: 'INV-005', customer: 'Sunrise Retail', amount: 'R 4,320', status: 'Pending', date: '2026-09-05' },
  { id: 'INV-006', customer: 'Blue Ocean Logistics', amount: 'R 22,100', status: 'Paid', date: '2026-09-08' },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [form, setForm] = useState({ customer: '', amount: '', status: 'Pending' as Invoice['status'] });

  useEffect(() => {
    const saved = loadFromStorage<Invoice[]>('sme-invoices', initialInvoices);
    setInvoices(saved);
  }, []);

  useEffect(() => {
    saveToStorage('sme-invoices', invoices);
  }, [invoices]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ customer: '', amount: '', status: 'Pending' });
  };

  const handleCreate = () => {
    if (!form.customer.trim() || !form.amount.trim()) return;
    const nextId = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().slice(0, 10);
    const amountValue = form.amount.startsWith('R') ? form.amount : `R ${form.amount}`;
    setInvoices([{ id: nextId, customer: form.customer.trim(), amount: amountValue, status: form.status, date: today }, ...invoices]);
    handleClose();
    setSnackOpen(true);
  };

  const handleDelete = (id: string) => setInvoices(invoices.filter((inv) => inv.id !== id));
  const handleStatusChange = (id: string, newStatus: Invoice['status']) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv)));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Invoices</Typography>
          <Typography variant="body2" color="text.secondary">Create, view and manage all your invoices.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>New Invoice</Button>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>Invoice</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{row.id}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        color={row.status === 'Paid' ? 'success' : row.status === 'Pending' ? 'warning' : 'error'}
                        onClick={() => {
                          const next = row.status === 'Pending' ? 'Paid' : row.status === 'Paid' ? 'Overdue' : 'Pending';
                          handleStatusChange(row.id, next);
                        }}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
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
        <DialogTitle>Create New Invoice</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Customer name" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} fullWidth required autoFocus />
          <TextField label="Amount (e.g. 12500 or R 12,500)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} fullWidth required />
          <TextField select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Invoice['status'] })} fullWidth>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!form.customer || !form.amount}>Create Invoice</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSnackOpen(false)}>Invoice created successfully!</Alert>
      </Snackbar>
    </Box>
  );
}
