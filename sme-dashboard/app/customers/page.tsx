'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Snackbar, Alert, Avatar,
} from '@mui/material';
import { Add, Delete, Person } from '@mui/icons-material';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: string;
};

const initialCustomers: Customer[] = [
  { id: 'CUS-001', name: 'Acme Corp', email: 'billing@acme.co.za', phone: '011 555 0101', totalSpent: 'R 48,200' },
  { id: 'CUS-002', name: 'Tech Solutions', email: 'accounts@techsol.co.za', phone: '021 555 0202', totalSpent: 'R 31,450' },
  { id: 'CUS-003', name: 'Green Farms', email: 'finance@greenfarms.co.za', phone: '031 555 0303', totalSpent: 'R 67,800' },
  { id: 'CUS-004', name: 'City Builders', email: 'pay@citybuilders.co.za', phone: '012 555 0404', totalSpent: 'R 22,100' },
  { id: 'CUS-005', name: 'Sunrise Retail', email: 'orders@sunrise.co.za', phone: '041 555 0505', totalSpent: 'R 15,670' },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const saved = loadFromStorage<Customer[]>('sme-customers', initialCustomers);
    setCustomers(saved);
  }, []);

  useEffect(() => {
    saveToStorage('sme-customers', customers);
  }, [customers]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: '', email: '', phone: '' });
  };

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const nextId = `CUS-${String(customers.length + 1).padStart(3, '0')}`;
    setCustomers([{
      id: nextId,
      name: form.name.trim(),
      email: form.email.trim() || '—',
      phone: form.phone.trim() || '—',
      totalSpent: 'R 0',
    }, ...customers]);
    handleClose();
    setSnackOpen(true);
  };

  const handleDelete = (id: string) => setCustomers(customers.filter((c) => c.id !== id));

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Customers</Typography>
          <Typography variant="body2" color="text.secondary">Manage your customer list and contact details.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>Add Customer</Button>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Total Spent</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <Person fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>{row.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{row.id}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.totalSpent}</TableCell>
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
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Company / Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required autoFocus />
          <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
          <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!form.name}>Add Customer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSnackOpen(false)}>Customer added successfully!</Alert>
      </Snackbar>
    </Box>
  );
}
