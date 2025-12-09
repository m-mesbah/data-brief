import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Grid2,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { platformApi } from '../../api/platform';
import type { Platform } from '../../utils/types';
import { LoadingSpinner } from '../../components/Common/LoadingSpinner';
import { ErrorMessage } from '../../components/Common/ErrorMessage';
import { formatDate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export const PlatformList: React.FC = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      const response = await platformApi.getPlatforms();
      setPlatforms(response.payload?.platforms || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Platforms
      </Typography>

      <Grid2 container spacing={3} sx={{ mt: 2 }}>
        {platforms.length === 0 ? (
          <Grid2 xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">No platforms found</Typography>
            </Paper>
          </Grid2>
        ) : (
          platforms.map((platform) => (
            <Grid2 xs={12} sm={6} md={4} key={platform.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {platform.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {platform.description}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Created: {formatDate(platform.createdAt)}
                  </Typography>
                  <Box mt={2}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(ROUTES.PLATFORM_DETAIL(platform.id))}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          ))
        )}
      </Grid2>
    </Box>
  );
};

