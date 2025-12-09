import { Alert, AlertTitle } from '@mui/material';
import { getErrorMessage } from '../../utils/helpers';

interface ErrorMessageProps {
  error: unknown;
  title?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, title = 'Error' }) => {
  return (
    <Alert severity="error">
      <AlertTitle>{title}</AlertTitle>
      {getErrorMessage(error)}
    </Alert>
  );
};

