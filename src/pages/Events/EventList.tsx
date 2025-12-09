import { Box, Paper, Typography } from '@mui/material';

export const EventList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="textSecondary">
          Event management interface coming soon. Events are received via webhooks from integrated platforms.
        </Typography>
      </Paper>
    </Box>
  );
};

