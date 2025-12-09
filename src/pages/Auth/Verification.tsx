import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES, FIREBASE_API_KEY } from '../../utils/constants';
import { useToast } from '../../contexts/ToastContext';

export const Verification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setFirebaseUserFromRest } = useAuth();
  const { showToast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    // Prevent running verification multiple times
    if (hasVerified || status === 'success') {
      return;
    }

    const verifyMagicLink = async () => {
      setHasVerified(true);
      try {
        // Firebase email links can have different parameter names
        // Try multiple possible parameter names
        const oobCode = 
          searchParams.get('oobCode') || 
          searchParams.get('oobcode') || 
          searchParams.get('code') ||
          new URLSearchParams(window.location.hash.substring(1)).get('oobCode') ||
          new URLSearchParams(window.location.hash.substring(1)).get('code');
        
        // Get email from URL and decode it (email might be URL encoded like %40 for @)
        let email = 
          searchParams.get('email') || 
          new URLSearchParams(window.location.hash.substring(1)).get('email') ||
          localStorage.getItem('emailForSignIn');
        
        // Decode URL-encoded email if needed
        if (email) {
          email = decodeURIComponent(email);
        }

        // Get API key from URL if available, otherwise use env variable
        const apiKeyFromUrl = searchParams.get('apiKey');
        const firebaseApiKey = apiKeyFromUrl || FIREBASE_API_KEY;

        const mode = searchParams.get('mode'); // signIn, verifyEmail, etc.

        console.log('🔐 Starting Firebase verification...');
        console.log('📧 Email:', email);
        console.log('🔑 oobCode:', oobCode);
        console.log('🔑 Mode:', mode);
        console.log('🔑 API Key from URL:', apiKeyFromUrl ? 'Yes' : 'No');
        console.log('🔗 Full URL:', window.location.href);
        console.log('🔗 Search params:', window.location.search);
        console.log('🔗 Hash:', window.location.hash);

        if (!oobCode) {
          console.error('❌ Missing oobCode parameter');
          setError('Invalid verification link. Missing verification code.');
          setStatus('error');
          showToast('Invalid verification link - missing code', 'error');
          setTimeout(() => navigate(ROUTES.LOGIN), 3000);
          return;
        }

        if (!email) {
          console.error('❌ Missing email parameter');
          setError('Invalid verification link. Please try logging in again.');
          setStatus('error');
          showToast('Invalid verification link - missing email', 'error');
          setTimeout(() => navigate(ROUTES.LOGIN), 3000);
          return;
        }

        if (!firebaseApiKey) {
          console.error('❌ Firebase API key not configured');
          setError('Firebase API key not configured. Please check your environment variables.');
          setStatus('error');
          showToast('Configuration error', 'error');
          return;
        }

        // Use Firebase REST API to sign in with email link
        const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithEmailLink?key=${firebaseApiKey}`;

        console.log('📡 Calling Firebase API...');

        const response = await fetch(firebaseAuthUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oobCode,
            email,
          }),
        });

        console.log('📨 Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Firebase error:', errorData);
          const errorMessage = errorData.error?.message || 'Verification failed';
          
          // Reset hasVerified so user can try again
          setHasVerified(false);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('✅ Firebase verification successful');

        if (data.idToken) {
          console.log('🎟️ Firebase ID token obtained');
          console.log('📦 Response data:', data);

          // Update auth context (this will store token and user data)
          setFirebaseUserFromRest(data.localId, data.email || email, data.idToken);

          // Clear the email from storage
          localStorage.removeItem('emailForSignIn');

          // Wait a bit to ensure state is updated before redirecting
          setStatus('success');
          showToast('Signed in successfully!', 'success');

          // Give React time to update the auth context before navigating
          setTimeout(() => {
            console.log('🔄 Redirecting to dashboard...');
            console.log('🔐 Token stored:', !!localStorage.getItem('auth_token'));
            console.log('👤 User stored:', !!localStorage.getItem('user'));
            navigate(ROUTES.DASHBOARD, { replace: true });
          }, 1500);
        } else {
          console.error('❌ No token in response');
          console.error('📦 Full response:', data);
          throw new Error('No token received from Firebase');
        }
      } catch (err: unknown) {
        console.error('❌ Verification error:', err);
        setStatus('error');

        let errorMessage = 'Verification failed';

        // Handle specific Firebase errors
        if (err instanceof Error) {
          const errorMsg = err.message || '';
          if (errorMsg.includes('INVALID_OOB_CODE') || errorMsg.includes('EXPIRED_OOB_CODE')) {
            errorMessage = 'This link has expired or has already been used. Please request a new magic link.';
          } else if (errorMsg.includes('INVALID_EMAIL')) {
            errorMessage = 'Invalid email address. Please try logging in again.';
          } else if (errorMsg.includes('USER_DISABLED')) {
            errorMessage = 'This account has been disabled. Please contact support.';
          } else if (errorMsg.includes('EMAIL_NOT_FOUND')) {
            errorMessage = 'Email not found. Please sign up first.';
          } else if (errorMsg.includes('INVALID_ID_TOKEN')) {
            errorMessage = 'Invalid token. Please try logging in again.';
          } else {
            errorMessage = errorMsg || 'Verification failed. Please try again.';
          }
        }

        setError(errorMessage);
        showToast(errorMessage, 'error');
        // Don't auto-redirect on error, let user click the button
      }
    };

    verifyMagicLink();
  }, [searchParams, navigate, setFirebaseUserFromRest, showToast, hasVerified, status]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          {status === 'verifying' && (
            <>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Verifying your email...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we verify your email address.
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Email Verified Successfully!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your email has been verified. Redirecting to dashboard...
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(ROUTES.DASHBOARD)}
              >
                Go to Dashboard
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Verification Failed
              </Typography>
              <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
                {error || 'An error occurred during verification.'}
              </Alert>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Go to Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    const email = localStorage.getItem('emailForSignIn');
                    if (email) {
                      navigate(ROUTES.LOGIN);
                    } else {
                      navigate(ROUTES.LOGIN);
                    }
                  }}
                >
                  Request New Link
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

