import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Card, CardContent, Typography, Slider, Switch, TextField, Button, CircularProgress, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '2rem auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

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
        alert(`Successfully purchased ${result.ok} cycles!`);
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

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h4" gutterBottom color="textPrimary">
          Purchase IC Cycles
        </Typography>
        <div className="flex justify-between items-center mb-4">
          <Typography color="textSecondary">Dark Mode</Typography>
          <Switch
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            color="primary"
          />
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
            {`${Number(cycles).toLocaleString()} cycles`}
          </Typography>
        )}
        <TextField
          label="Card Number"
          variant="outlined"
          fullWidth
          className="mt-4"
          InputLabelProps={{
            style: { color: '#666666' },
          }}
        />
        <TextField
          label="Expiration Date"
          variant="outlined"
          fullWidth
          className="mt-4"
          InputLabelProps={{
            style: { color: '#666666' },
          }}
        />
        <TextField
          label="CVV"
          variant="outlined"
          fullWidth
          className="mt-4"
          InputLabelProps={{
            style: { color: '#666666' },
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
      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={error}
      />
    </StyledCard>
  );
};

export default App;
