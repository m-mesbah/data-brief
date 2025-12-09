import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { integrationApi } from '../../api/integration';
import type { Integration } from '../../utils/types';
import { LoadingSpinner } from '../../components/Common/LoadingSpinner';
import { ErrorMessage } from '../../components/Common/ErrorMessage';
import { formatDate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export const IntegrationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (id) {
      fetchIntegration(id);
    }
  }, [id]);

  const fetchIntegration = async (integrationId: string) => {
    try {
      setLoading(true);
      const response = await integrationApi.getIntegrationById(integrationId);
      setIntegration(response.payload || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!integration) return <Typography>Integration not found</Typography>;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(ROUTES.INTEGRATIONS)}
        sx={{ mb: 2 }}
      >
        Back to Integrations
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">
            {integration.platformName || 'Integration'}
          </Typography>
          <Chip
            label={integration.status || 'Active'}
            color={integration.status === 'active' ? 'success' : 'default'}
          />
        </Box>

        <Grid2 container spacing={3}>
          <Grid2 xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
              Platform ID
            </Typography>
            <Typography variant="body1" gutterBottom>
              {integration.platformId}
            </Typography>
          </Grid2>
          <Grid2 xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
              Domain ID
            </Typography>
            <Typography variant="body1" gutterBottom>
              {integration.domainId}
            </Typography>
          </Grid2>
          {integration.createdAt && (
            <Grid2 xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Created At
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(integration.createdAt)}
              </Typography>
            </Grid2>
          )}
        </Grid2>
      </Paper>
    </Box>
  );
};

