'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState } from 'react';

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('My SME Business');
  const [email, setEmail] = useState('owner@mybusiness.co.za');
  const [currency, setCurrency] = useState('ZAR (R)');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleSave = () => {
    setSnackOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 720 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage your business profile and preferences.
      </Typography>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Business Profile
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Contact email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              fullWidth
              helperText="Currently set to South African Rand"
            />
          </Box>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Notifications
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                color="primary"
              />
            }
            label="Email me when an invoice is overdue"
          />
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      <Button variant="contained" onClick={handleSave}>
        Save Changes
      </Button>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackOpen(false)}>
          Settings saved (demo only – not persisted yet)
        </Alert>
      </Snackbar>
    </Box>
  );
}
