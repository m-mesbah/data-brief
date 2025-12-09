import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  Typography,
  Stack,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { integrationApi } from '../../api/integration';
import { platformApi } from '../../api/platform';
import { domainApi } from '../../api/domain';
import type { Platform, Domain } from '../../utils/types';
import { ROUTES } from '../../utils/constants';

export const IntegrationCreate: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlatforms();
    fetchDomains();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const response = await platformApi.getPlatforms();
      setPlatforms(response.payload?.platforms || []);
    } catch (err) {
      console.error('Failed to fetch platforms:', err);
    }
  };

  const fetchDomains = async () => {
    try {
      const response = await domainApi.getDomains();
      setDomains(response.payload || []);
      if (response.payload && response.payload.length > 0) {
        setSelectedDomain(response.payload[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch domains:', err);
    }
  };

  const handleGetAuthURL = async () => {
    if (!selectedPlatform || !selectedDomain) {
      setError('Please select both platform and domain');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let response;

      const platform = platforms.find((p) => p.id === selectedPlatform);
      const platformName = platform?.name.toLowerCase() || '';

      if (platformName.includes('google')) {
        response = await integrationApi.getGoogleAuthURL(selectedDomain, selectedPlatform);
      } else if (platformName.includes('facebook')) {
        response = await integrationApi.getFacebookAuthURL(selectedDomain, selectedPlatform);
      } else if (platformName.includes('tiktok')) {
        response = await integrationApi.getTikTokAuthURL(selectedDomain, selectedPlatform);
      } else if (platformName.includes('snapchat')) {
        response = await integrationApi.getSnapchatAuthURL(selectedDomain, selectedPlatform);
      } else {
        setError('Platform not supported');
        return;
      }

      if (response.payload?.url) {
        window.open(response.payload.url, '_blank');
        setStep(2);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get auth URL');
    } finally {
      setLoading(false);
    }
  };

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
        <Typography variant="h4" gutterBottom>
          Create Integration
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === 1 && (
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={selectedPlatform}
                  label="Platform"
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  {platforms.map((platform) => (
                    <MenuItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Domain</InputLabel>
                <Select
                  value={selectedDomain}
                  label="Domain"
                  onChange={(e) => setSelectedDomain(e.target.value)}
                >
                  {domains.map((domain) => (
                    <MenuItem key={domain.id} value={domain.id}>
                      {domain.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              onClick={handleGetAuthURL}
              disabled={loading || !selectedPlatform || !selectedDomain}
            >
              {loading ? 'Loading...' : 'Authenticate'}
            </Button>
          </Stack>
        )}

        {step === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Authentication Complete
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Please complete the authentication in the popup window, then return here to continue.
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => navigate(ROUTES.INTEGRATIONS)}>
                Back to Integrations
              </Button>
            </CardActions>
          </Card>
        )}
      </Paper>
    </Box>
  );
};

