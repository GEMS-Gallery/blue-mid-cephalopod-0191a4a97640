import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Card, CardContent, Typography, Slider, Switch, TextField, Button, CircularProgress, Snackbar, IconButton, Grid, Box } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { lightTheme, darkTheme } from './theme';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: '2rem auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  borderRadius: '12px',
}));

const InfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: '8px',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '10px 15px',
    backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : '#333',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    '&:focus': {
      backgroundColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#444',
    },
  },
}));

const abbreviateNumber = (num: number): string => {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const magnitude = Math.floor(Math.log10(Math.abs(num)) / 3);
  const scaled = num / Math.pow(10, magnitude * 3);
  const suffix = suffixes[Math.min(magnitude, suffixes.length - 1)];
  return scaled.toFixed(2) + suffix;
};

const cyclesInfoText = [
  { icon: <MemoryIcon fontSize="large" />, title: 'Computation', content: 'Powers IC' },
  { icon: <StorageIcon fontSize="large" />, title: 'Resources', content: 'CPU, Memory, Network' },
  { icon: <MonetizationOnIcon fontSize="large" />, title: 'Conversion', content: '1 ICP = 10T Cycles' },
  { icon: <NetworkCheckIcon fontSize="large" />, title: 'Usage', content: 'Avg: {avgUsage} Cycles/Month' },
];

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isICP, setIsICP] = useState(false);
  const [amount, setAmount] = useState(10);
  const [cycles, setCycles] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [icpPrice, setIcpPrice] = useState(7.5);
  const [error, setError] = useState<string | null>(null);
  const [averageUsage, setAverageUsage] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const price = await backend.get_icp_price();
        setIcpPrice(Number(price));
        const avgUsage = await backend.get_average_usage();
        setAverageUsage(Number(avgUsage));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const calculateCycles = async () => {
      setLoading(true);
      try {
        const result = await backend.calculate_cycles(amount, isICP);
        if ('ok' in result) {
          setCycles(result.ok);
        } else {
          console.error(result.err);
          setCycles(null);
          setError(result.err);
        }
      } catch (error) {
        console.error('Error calculating cycles:', error);
        setCycles(null);
        setError('An error occurred while calculating cycles. Please try again.');
      }
      setLoading(false);
    };
    calculateCycles();
  }, [amount, isICP]);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const result = await backend.purchase_cycles(amount, isICP);
      if ('ok' in result) {
        alert(`Successfully purchased ${abbreviateNumber(Number(result.ok))} cycles!`);
      } else {
        setError(`Error: ${result.err}`);
      }
    } catch (error) {
      console.error('Error purchasing cycles:', error);
      setError('An error occurred while purchasing cycles. Please try again.');
    }
    setLoading(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <div style={{ minHeight: '100vh', backgroundColor: darkMode ? '#121212' : '#f5f5f5', transition: 'background-color 0.3s' }}>
        <StyledCard>
          <CardContent>
            <Typography variant="h3" gutterBottom color="textPrimary" style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>
              What are Cycles?
            </Typography>
            <Grid container spacing={3} style={{ marginBottom: '24px' }}>
              {cyclesInfoText.map((info, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <InfoBox>
                    <Box className="info-icon" color="primary.main">
                      {info.icon}
                    </Box>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {info.title}
                    </Typography>
                    <Typography variant="body2">
                      {info.title === 'Usage' ? info.content.replace('{avgUsage}', abbreviateNumber(averageUsage)) : info.content}
                    </Typography>
                  </InfoBox>
                </Grid>
              ))}
            </Grid>
            <Typography variant="h4" gutterBottom color="textPrimary" style={{ marginTop: '2rem' }}>
              Purchase IC Cycles
            </Typography>
            <div className="flex justify-between items-center mb-4">
              <Typography color="textSecondary">{isICP ? 'ICP' : 'USD'}</Typography>
              <Switch
                checked={isICP}
                onChange={(e) => setIsICP(e.target.checked)}
                color="primary"
              />
            </div>
            <Slider
              value={amount}
              onChange={(_, newValue) => setAmount(newValue as number)}
              min={1}
              max={isICP ? 20 : 100}
              step={isICP ? 0.1 : 1}
              marks
              valueLabelDisplay="auto"
              color="primary"
            />
            <Typography variant="h6" className="mt-4" color="textPrimary">
              {isICP ? `${amount} ICP` : `$${amount}`}
            </Typography>
            {cycles !== null && (
              <Typography variant="body1" className="mt-2" color="textSecondary">
                {`${abbreviateNumber(Number(cycles))} cycles`}
              </Typography>
            )}
            <Box sx={{ mt: 4 }}>
              <StyledTextField
                label="Card Number"
                variant="outlined"
                fullWidth
                placeholder="1234 5678 9012 3456"
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StyledTextField
                    label="Expiration Date"
                    variant="outlined"
                    fullWidth
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StyledTextField
                    label="CVV"
                    variant="outlined"
                    fullWidth
                    placeholder="123"
                  />
                </Grid>
              </Grid>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handlePurchase}
              disabled={loading}
              style={{ marginTop: '1.5rem', padding: '12px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Purchase Cycles'}
            </Button>
          </CardContent>
        </StyledCard>
        <div className="dark-mode-toggle">
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>
        <Snackbar
          open={error !== null}
          autoHideDuration={6000}
          onClose={handleCloseError}
          message={error}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
