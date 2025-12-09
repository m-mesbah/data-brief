import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  Business as BusinessIcon,
  Domain as DomainIcon,
  Extension as ExtensionIcon,
} from '@mui/icons-material';
import { organizationApi } from '../api/organization';
import { domainApi } from '../api/domain';
import { integrationApi } from '../api/integration';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { ErrorMessage } from '../components/Common/ErrorMessage';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    organizations: 0,
    domains: 0,
    integrations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [orgsRes, domainsRes] = await Promise.all([
          organizationApi.getOrganizations(),
          domainApi.getDomains(),
        ]);

        const orgs = orgsRes.payload || [];
        const domains = domainsRes.payload || [];
        
        // Get integrations count from first domain if available
        let integrationsCount = 0;
        if (domains.length > 0) {
          try {
            const integrationsRes = await integrationApi.getIntegrationsByDomainId(domains[0].id);
            integrationsCount = integrationsRes.payload?.integrations?.length || 0;
          } catch {
            // Ignore errors for integrations
          }
        }

        setStats({
          organizations: orgs.length,
          domains: domains.length,
          integrations: integrationsCount,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const statCards = [
    {
      title: 'Organizations',
      value: stats.organizations,
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Domains',
      value: stats.domains,
      icon: <DomainIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
    },
    {
      title: 'Integrations',
      value: stats.integrations,
      icon: <ExtensionIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mt: 2 }}>
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    {card.title}
                  </Typography>
                  <Typography variant="h3">{card.value}</Typography>
                </Box>
                <Box sx={{ color: card.color }}>{card.icon}</Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

