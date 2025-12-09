import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { platformApi } from '../../api/platform';
import type { Platform } from '../../utils/types';
import { LoadingSpinner } from '../../components/Common/LoadingSpinner';
import { ErrorMessage } from '../../components/Common/ErrorMessage';
import { formatDate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export const PlatformDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (id) {
      fetchPlatform(id);
    }
  }, [id]);

  const fetchPlatform = async (platformId: string) => {
    try {
      setLoading(true);
      const response = await platformApi.getPlatformById(platformId);
      setPlatform(response.payload || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!platform) return <Typography>Platform not found</Typography>;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(ROUTES.PLATFORMS)}
        sx={{ mb: 2 }}
      >
        Back to Platforms
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {platform.name}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {platform.description}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
              Created At
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(platform.createdAt)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
              Updated At
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(platform.updatedAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

