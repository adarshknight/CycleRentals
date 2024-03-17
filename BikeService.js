// BikeService.js

import React from 'react';
import { Container, Typography, Button } from '@mui/material'; // Import Material-UI components

const BikeService = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Service Options
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <Button variant="contained" color="primary">
          Service Your Bike
        </Button>
        <Button variant="contained" color="secondary">
          Rental Bike Service
        </Button>
      </div>
    </Container>
  );
};

export default BikeService;
