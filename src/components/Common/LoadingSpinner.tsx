import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
  const content = (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={fullScreen ? '100vh' : '200px'}
    >
      <CircularProgress />
    </Box>
  );

  return content;
};

