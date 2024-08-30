import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Card, CardContent, Typography, Slider, Switch, TextField, Button, CircularProgress, Snackbar, IconButton } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { lightTheme, darkTheme } from './main';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '2rem auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const abbreviateNumber = (num: number): string => {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const magnitude = Math.floor(Math.log10(Math.abs(num)) / 3);
  const scaled = num / Math.pow(10, magnitude * 3);
  const suffix = suffixes[Math.min(magnitude, suffixes.length - 1)];
  return scaled.toFixed(2) + suffix;
};

const cyclesInfoText = `Cycles are the fuel that powers computation on the Internet Computer. They're used to pay for resources like CPU, memory, and network bandwidth. At the current ICP price of $7.50, 1 ICP buys you 10 trillion cycles. On average, a simple dapp might use about 100 billion cycles per month, which is equivalent to $0.075 worth of ICP.`;

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isICP, setIsICP] = useState(false);
  const [amount, setAmount] = useState(10);
  const [cycles, setCycles] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [icpPrice, setIcpPrice] = useState(7.5);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIcpPrice = async () => {
      try {
        const price = await backend.get_icp_price();
        setIcpPrice(Number(price));
      } catch (error) {
        console.error('Error fetching ICP price:', error);
        setError('Failed to fetch ICP price. Please try again later.');
      }
    };
    fetchIcpPrice();
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
            <Typography variant="h4" gutterBottom color="textPrimary">
              Purchase IC Cycles
            </Typography>
            <div className={`info-section ${darkMode ? 'dark' : ''}`}>
              <Typography variant="subtitle1" className="info-title" color="textPrimary">
                What are Cycles?
              </Typography>
              <Typography variant="body2" className="info-content" color="textSecondary">
                {cyclesInfoText}
              </Typography>
            </div>
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
            <TextField
              label="Card Number"
              variant="outlined"
              fullWidth
              className="mt-4"
              InputLabelProps={{
                style: { color: darkMode ? '#b3b3b3' : '#666666' },
              }}
            />
            <TextField
              label="Expiration Date"
              variant="outlined"
              fullWidth
              className="mt-4"
              InputLabelProps={{
                style: { color: darkMode ? '#b3b3b3' : '#666666' },
              }}
            />
            <TextField
              label="CVV"
              variant="outlined"
              fullWidth
              className="mt-4"
              InputLabelProps={{
                style: { color: darkMode ? '#b3b3b3' : '#666666' },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="mt-4"
              onClick={handlePurchase}
              disabled={loading}
              style={{ marginTop: '1rem' }}
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
