import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { domainApi } from '../../api/domain';
import { integrationApi } from '../../api/integration';
import type { Domain, Integration } from '../../utils/types';
import { LoadingSpinner } from '../../components/Common/LoadingSpinner';
import { ErrorMessage } from '../../components/Common/ErrorMessage';
import { formatDate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export const DomainDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (id) {
      fetchDomain(id);
      fetchIntegrations(id);
    }
  }, [id]);

  const fetchDomain = async (domainId: string) => {
    try {
      setLoading(true);
      const response = await domainApi.getDomainById(domainId);
      setDomain(response.payload || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIntegrations = async (domainId: string) => {
    try {
      const response = await integrationApi.getIntegrationsByDomainId(domainId);
      setIntegrations(response.payload?.integrations || []);
    } catch (err) {
      console.error('Failed to fetch integrations:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!domain) return <Typography>Domain not found</Typography>;

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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">{domain.name}</Typography>
          <Chip
            label={domain.status || 'Active'}
            color={domain.status === 'active' ? 'success' : 'default'}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mt: 2 }}>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Type
            </Typography>
            <Typography variant="body1" gutterBottom>
              {domain.type}
            </Typography>
          </Box>
          {domain.siteId && (
            <Box>
              <Typography variant="body2" color="textSecondary">
                Site ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                {domain.siteId}
              </Typography>
            </Box>
          )}
          {domain.createdAt && (
            <Box>
              <Typography variant="body2" color="textSecondary">
                Created At
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(domain.createdAt)}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Integrations ({integrations.length})
        </Typography>
        {integrations.length === 0 ? (
          <Typography color="textSecondary">No integrations found</Typography>
        ) : (
          <List>
            {integrations.map((integration) => (
              <ListItem key={integration.id}>
                <ListItemText
                  primary={integration.platformName || 'Unknown Platform'}
                  secondary={`Status: ${integration.status || 'Active'}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

