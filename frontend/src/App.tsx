import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Card, CardContent, Typography, Slider, Switch, TextField, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '2rem auto',
  padding: theme.spacing(3),
}));

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isICP, setIsICP] = useState(false);
  const [amount, setAmount] = useState(10);
  const [cycles, setCycles] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [icpPrice, setIcpPrice] = useState(7.5);

  useEffect(() => {
    const fetchIcpPrice = async () => {
      const price = await backend.get_icp_price();
      setIcpPrice(Number(price));
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
        }
      } catch (error) {
        console.error('Error calculating cycles:', error);
        setCycles(null);
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
        alert(`Error: ${result.err}`);
      }
    } catch (error) {
      console.error('Error purchasing cycles:', error);
      alert('An error occurred while purchasing cycles.');
    }
    setLoading(false);
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Purchase IC Cycles
        </Typography>
        <div className="flex justify-between items-center mb-4">
          <Typography>Dark Mode</Typography>
          <Switch
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <Typography>{isICP ? 'ICP' : 'USD'}</Typography>
          <Switch
            checked={isICP}
            onChange={(e) => setIsICP(e.target.checked)}
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
        />
        <Typography variant="h6" className="mt-4">
          {isICP ? `${amount} ICP` : `$${amount}`}
        </Typography>
        {cycles !== null && (
          <Typography variant="body1" className="mt-2">
            {`${Number(cycles).toLocaleString()} cycles`}
          </Typography>
        )}
        <TextField
          label="Card Number"
          variant="outlined"
          fullWidth
          className="mt-4"
        />
        <TextField
          label="Expiration Date"
          variant="outlined"
          fullWidth
          className="mt-4"
        />
        <TextField
          label="CVV"
          variant="outlined"
          fullWidth
          className="mt-4"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="mt-4"
          onClick={handlePurchase}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Purchase Cycles'}
        </Button>
      </CardContent>
    </StyledCard>
  );
};

export default App;
