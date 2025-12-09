import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Stack,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { useToast } from '../../contexts/ToastContext';

export const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    organization_name: '',
    organization_type: '',
    organization_size: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Store email for verification page
      localStorage.setItem('emailForSignIn', formData.email);
      await signUp(formData);
      setSuccess(true);
      showToast('Account created successfully! Magic link sent to your email.', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Create your account and organization
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Account created successfully! Redirecting to login...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Box>
              <TextField
                required
                fullWidth
                id="organization_name"
                label="Organization Name"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleChange}
                disabled={loading}
              />
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  required
                  fullWidth
                  id="organization_type"
                  label="Organization Type"
                  name="organization_type"
                  value={formData.organization_type}
                  onChange={handleChange}
                  disabled={loading}
                  helperText="Enter organization type ID"
                />
                <TextField
                  required
                  fullWidth
                  id="organization_size"
                  label="Organization Size"
                  name="organization_size"
                  value={formData.organization_size}
                  onChange={handleChange}
                  disabled={loading}
                  helperText="Enter number of employees"
                />
              </Box>
            </Stack>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate(ROUTES.LOGIN)}
                sx={{ cursor: 'pointer' }}
              >
                Already have an account? Login
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

