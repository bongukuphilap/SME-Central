'use client';

import { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Snackbar, Alert,
} from '@mui/material';
import { TrendingUp, People, Inventory, Receipt, Add } from '@mui/icons-material';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

type Invoice = {
  id: string;
  customer: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
};

const initialStats = [
  { title: 'Total Revenue', value: 'R 284,500', change: '+12.5%', icon: <TrendingUp />, color: '#1976d2' },
  { title: 'Customers', value: '1,248', change: '+8.2%', icon: <People />, color: '#2e7d32' },
  { title: 'Products', value: '342', change: '+3.1%', icon: <Inventory />, color: '#ed6c02' },
  { title: 'Pending Invoices', value: '47', change: '-2.4%', icon: <Receipt />, color: '#9c27b0' },
];

const initialInvoices: Invoice[] = [
  { id: 'INV-001', customer: 'Acme Corp', amount: 'R 12,450', status: 'Paid', date: '2026-09-01' },
  { id: 'INV-002', customer: 'Tech Solutions', amount: 'R 8,200', status: 'Pending', date: '2026-09-02' },
  { id: 'INV-003', customer: 'Green Farms', amount: 'R 15,800', status: 'Paid', date: '2026-09-02' },
  { id: 'INV-004', customer: 'City Builders', amount: 'R 6,750', status: 'Overdue', date: '2026-08-28' },
];

export default function HomePage() {
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

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Welcome back! Here&apos;s what&apos;s happening with your business today.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>New Invoice</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {initialStats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{stat.title}</Typography>
                    <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                    <Typography variant="caption" sx={{ color: stat.change.startsWith('+') ? 'success.main' : 'error.main' }}>
                      {stat.change} from last month
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: stat.color, color: 'white', p: 1.2, borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>Recent Invoices</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>Invoice</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{row.id}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>
                      <Chip label={row.status} size="small" color={row.status === 'Paid' ? 'success' : row.status === 'Pending' ? 'warning' : 'error'} />
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
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
