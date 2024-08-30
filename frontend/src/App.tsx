import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Card, CardContent, Typography, Slider, Switch, TextField, Button, CircularProgress, Snackbar, IconButton, Grid, Box } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EvStationIcon from '@mui/icons-material/EvStation';
import SpeedIcon from '@mui/icons-material/Speed';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import { lightTheme, darkTheme } from './theme';
import LeftMenu from './components/LeftMenu';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: '2rem auto',
  marginLeft: '280px',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderRadius: '16px',
  [theme.breakpoints.down('md')]: {
    marginLeft: '80px',
    marginRight: '20px',
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
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
    padding: '12px 15px',
    backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : '#333',
    borderRadius: '8px',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    '&:focus': {
      backgroundColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#444',
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
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

const AVERAGE_USAGE_CYCLES = 100_000_000_000; // 100 billion cycles per month

const cyclesInfoText = [
  { icon: <SpeedIcon fontSize="large" />, title: 'Performance', content: 'Powers IC Computation' },
  { icon: <AccountBalanceWalletIcon fontSize="large" />, title: 'Economy', content: '1 ICP = 10T Cycles' },
  { icon: <BarChartIcon fontSize="large" />, title: 'Usage', content: `Avg: ${abbreviateNumber(AVERAGE_USAGE_CYCLES)} Cycles/Month` },
  { icon: <EvStationIcon fontSize="large" />, title: 'Refill', content: 'Top up your cycles here' },
];

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isICP, setIsICP] = useState(false);
  const [amount, setAmount] = useState(10);
  const [cycles, setCycles] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [icpPrice, setIcpPrice] = useState(7.5);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const price = await backend.get_icp_price();
        setIcpPrice(Number(price));
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
        <LeftMenu />
        <StyledCard>
          <CardContent>
            <Box display="flex" alignItems="center" mb={4}>
              <EvStationIcon fontSize="large" color="primary" style={{ marginRight: '16px' }} />
              <Typography variant="h3" color="textPrimary" style={{ fontWeight: 'bold' }}>
                Cycle Refill Station
              </Typography>
            </Box>
            <Grid container spacing={3} style={{ marginBottom: '32px' }}>
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
                      {info.content}
                    </Typography>
                  </InfoBox>
                </Grid>
              ))}
            </Grid>
            <Typography variant="h5" gutterBottom color="textPrimary" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
              Refill Your Cycles
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
              style={{ marginTop: '1.5rem', padding: '12px', borderRadius: '8px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Refill Cycles'}
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
