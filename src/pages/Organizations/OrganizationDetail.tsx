import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { organizationApi } from '../../api/organization';
import type { Organization } from '../../utils/types';
import { LoadingSpinner } from '../../components/Common/LoadingSpinner';
import { ErrorMessage } from '../../components/Common/ErrorMessage';
import { formatDate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export const OrganizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (id) {
      fetchOrganization(id);
    }
  }, [id]);

  const fetchOrganization = async (orgId: string) => {
    try {
      setLoading(true);
      const response = await organizationApi.getOrganizationById(orgId);
      setOrganization(response.payload || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!organization) return <Typography>Organization not found</Typography>;

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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">{organization.name}</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
              Type
            </Typography>
            <Typography variant="body1" gutterBottom>
              {organization.type}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
              Size
            </Typography>
            <Typography variant="body1" gutterBottom>
              {organization.size}
            </Typography>
          </Grid>
          {organization.createdAt && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Created At
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(organization.createdAt)}
              </Typography>
            </Grid>
          )}
          {organization.updatedAt && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Updated At
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(organization.updatedAt)}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

