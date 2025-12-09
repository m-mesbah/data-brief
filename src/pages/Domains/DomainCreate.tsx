import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  MenuItem,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { domainApi } from '../../api/domain';
import { organizationApi } from '../../api/organization';
import type { Organization } from '../../utils/types';
import { ROUTES } from '../../utils/constants';
import { useToast } from '../../contexts/ToastContext';

export const DomainCreate: React.FC = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    siteId: '',
    type: 'Shopify',
    organizationId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await organizationApi.getOrganizations();
      setOrganizations(response.payload || []);
      if (response.payload && response.payload.length > 0) {
        setFormData((prev) => ({
          ...prev,
          organizationId: response.payload![0].id,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await domainApi.createDomain(formData);
      showToast('Domain created successfully', 'success');
      navigate(ROUTES.DOMAINS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create domain';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(ROUTES.DOMAINS)}
        sx={{ mb: 2 }}
      >
        Back to Domains
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create Domain
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              required
              fullWidth
              id="name"
              label="Domain Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="example.myshopify.com"
            />
            <TextField
              fullWidth
              id="siteId"
              label="Site ID"
              name="siteId"
              value={formData.siteId}
              onChange={handleChange}
              disabled={loading}
              helperText="Optional site identifier"
            />
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                required
                fullWidth
                select
                id="type"
                label="Domain Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="Shopify">Shopify</MenuItem>
                <MenuItem value="WooCommerce">WooCommerce</MenuItem>
                <MenuItem value="Salla">Salla</MenuItem>
                <MenuItem value="ZID">ZID</MenuItem>
              </TextField>
              <TextField
                required
                fullWidth
                select
                id="organizationId"
                label="Organization"
                name="organizationId"
                value={formData.organizationId}
                onChange={handleChange}
                disabled={loading || organizations.length === 0}
              >
                {organizations.map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Stack>
          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mr: 2 }}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
            <Button onClick={() => navigate(ROUTES.DOMAINS)} disabled={loading}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

