import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Visibility as ViewIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { integrationApi } from '../../api/integration';
import { domainApi } from '../../api/domain';
import type { Integration, Domain } from '../../utils/types';
import { LoadingSpinner } from '../../components/Common/LoadingSpinner';
import { ErrorMessage } from '../../components/Common/ErrorMessage';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { ROUTES } from '../../utils/constants';
import { useToast } from '../../contexts/ToastContext';

export const IntegrationList: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [integrationToDelete, setIntegrationToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchDomains();
  }, []);

  useEffect(() => {
    if (selectedDomainId) {
      fetchIntegrations(selectedDomainId);
    } else {
      setIntegrations([]);
    }
  }, [selectedDomainId]);

  const fetchDomains = async () => {
    try {
      const response = await domainApi.getDomains();
      setDomains(response.payload || []);
      if (response.payload && response.payload.length > 0) {
        setSelectedDomainId(response.payload[0].id);
      }
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const fetchIntegrations = async (domainId: string) => {
    try {
      setLoading(true);
      const response = await integrationApi.getIntegrationsByDomainId(domainId);
      setIntegrations(response.payload?.integrations || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setIntegrationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!integrationToDelete) return;

    try {
      await integrationApi.deleteIntegration(integrationToDelete);
      showToast('Integration deleted successfully', 'success');
      setDeleteDialogOpen(false);
      setIntegrationToDelete(null);
      if (selectedDomainId) {
        fetchIntegrations(selectedDomainId);
      }
    } catch (err) {
      showToast('Failed to delete integration', 'error');
      console.error('Failed to delete integration:', err);
    }
  };

  if (loading && integrations.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Integrations</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(ROUTES.INTEGRATION_CREATE)}
        >
          Create Integration
        </Button>
      </Box>

      <FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>
        <InputLabel>Filter by Domain</InputLabel>
        <Select
          value={selectedDomainId}
          label="Filter by Domain"
          onChange={(e) => setSelectedDomainId(e.target.value)}
        >
          {domains.map((domain) => (
            <MenuItem key={domain.id} value={domain.id}>
              {domain.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Platform</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {integrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="textSecondary">No integrations found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              integrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell>{integration.platformName || 'Unknown'}</TableCell>
                  <TableCell>{integration.status || 'Active'}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(ROUTES.INTEGRATION_DETAIL(integration.id))}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(integration.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Integration"
        message="Are you sure you want to delete this integration? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setIntegrationToDelete(null);
        }}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

