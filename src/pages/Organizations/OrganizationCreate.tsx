import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { organizationApi } from '../../api/organization';
import { ROUTES } from '../../utils/constants';
import { useToast } from '../../contexts/ToastContext';

export const OrganizationCreate: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    size: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await organizationApi.createOrganization(formData);
      showToast('Organization created successfully', 'success');
      navigate(ROUTES.ORGANIZATIONS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create organization';
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
        onClick={() => navigate(ROUTES.ORGANIZATIONS)}
        sx={{ mb: 2 }}
      >
        Back to Organizations
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create Organization
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
            }}
          >
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <TextField
                required
                fullWidth
                id="name"
                label="Organization Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </Box>
            <Box>
              <TextField
                required
                fullWidth
                id="type"
                label="Organization Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={loading}
                helperText="Enter organization type ID"
              />
            </Box>
            <Box>
              <TextField
                required
                fullWidth
                id="size"
                label="Organization Size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                disabled={loading}
                helperText="Enter number of employees"
              />
            </Box>
          </Box>
          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mr: 2 }}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
            <Button onClick={() => navigate(ROUTES.ORGANIZATIONS)} disabled={loading}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

