import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Container, Typography, Card, CardContent, Grid, TextField, Autocomplete, Box,Alert,Chip,} from '@mui/material';
import { apiService } from '../../services/api';
import {setLoading,setError,setCountries,setPorts, setGoods,setSelectedCountry,setSelectedPort,setSelectedGood,clearForm,
        resetPorts,resetGoods,} from '../../store/slices/formSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import toast, { Toaster } from 'react-hot-toast';

const FormPage = () => {
  const dispatch = useDispatch();
  const [hasMounted, setHasMounted] = useState(false);
  const [total, setTotal] = useState(0);
  
  const {countries, ports, goods, selectedCountry, selectedPort, selectedGood, loading, error,} = useSelector((state) => state.form);
  
  useEffect(() => {
    if (!hasMounted) {
      loadCountries();
      setHasMounted(true);
    }
  }, [hasMounted]);

  useEffect(() => {
    if (selectedGood) {
      const price = selectedGood.harga || 0;
      const discount = selectedGood.diskon || 0;
      setTotal(price - (price * (discount / 100)));
    } else {
      setTotal(0);
    }
  }, [selectedGood]);

  const loadCountries = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await apiService.getCountries();
      dispatch(setCountries(data));
    } catch (error) {
      dispatch(setError(error.message));
      toast.error('Failed to load countries', {
        id: 'countries-error',
        position: 'top-center',
        duration: 3000,
        style: {
          background: '#FF3333',
          color: '#fff',
        },
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadPorts = async (countryId) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      dispatch(resetPorts());
      dispatch(resetGoods());
      dispatch(setSelectedPort(null));
      dispatch(setSelectedGood(null));
      
      const data = await apiService.getPortsByCountry(countryId);
      dispatch(setPorts(data));
      
      if (data.length === 0) {
        toast('No ports available for this country', {
          id: 'ports-toast',
          position: 'top-center',
          duration: 3000,
          style: {
            background: '#ffcc00',
            color: '#000',
          },
        });
      }
    } catch (error) {
      dispatch(setError(error.message));
      toast.error('Failed to load ports', {
        id: 'ports-error',
        position: 'top-center',
        duration: 3000,
        style: {
          background: '#FF3333',
          color: '#fff',
        },
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadGoods = async (portId) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      dispatch(resetGoods());
      dispatch(setSelectedGood(null));
      
      const data = await apiService.getGoodsByPort(portId);
      dispatch(setGoods(data));
      
      if (data.length === 0) {
        toast('No products available at this port', {
          id: 'goods-info',
          position: 'top-center',
          duration: 3000,
          style: {
            background: '#ffcc00',
            color: '#000',
          },
        });
      }
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(
        error.message.includes('No data') 
          ? 'Server returned no data' 
          : 'Error loading products',
        { 
          id: 'goods-error',
          position: 'top-center',
          duration: 3000,
          style: {
            background: '#FF3333',
            color: '#fff',
          },
        }
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCountryChange = (event, newValue) => {
    dispatch(setSelectedCountry(newValue));
    if (newValue) {
      dispatch(resetPorts());
      loadPorts(newValue.id_negara);
    } else {
      dispatch(resetPorts());
    }
  };

  const handlePortChange = (event, newValue) => {
    dispatch(setSelectedPort(newValue));
    if (newValue) {
      dispatch(resetGoods());
      loadGoods(newValue.id_pelabuhan);
    } else {
      dispatch(resetGoods());
    }
  };

  const handleGoodChange = (event, newValue) => {
    dispatch(setSelectedGood(newValue));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRetry = () => {
    dispatch(clearForm());
    loadCountries();
  };

  if (loading && countries.length === 0) {
    return <LoadingSpinner message="Loading countries..." />;
  }

  const SelectionSummaryItem = ({ label, value, color }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      {value ? (
        <Chip label={value} color={color} size="small" />
      ) : (
        <Typography variant="body2">Not selected</Typography>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 3000,
          },
        }}
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product Selection Form
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select Country → Port → Product: Pricing Calculation
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <ErrorMessage error={error} onRetry={handleRetry} />
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Selection Form
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(option) => option.nama_negara || ''}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    loading={loading}
                    isOptionEqualToValue={(option, value) => 
                      option.id_negara === value.id_negara
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country / Negara"
                        placeholder="Select a country..."
                        required
                        error={!selectedCountry}
                        helperText={!selectedCountry ? "Please select a country" : ""}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Typography variant="body1">
                          {option.nama_negara}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" ml={1}>
                          {option.kode_negara}
                        </Typography>
                      </Box>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    options={ports}
                    getOptionLabel={(option) => option.nama_pelabuhan || ''}
                    value={selectedPort}
                    onChange={handlePortChange}
                    disabled={!selectedCountry}
                    loading={loading}
                    isOptionEqualToValue={(option, value) => 
                      option.id_pelabuhan === value.id_pelabuhan
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Port / Pelabuhan"
                        placeholder={selectedCountry ? "Select a port..." : "First select a country"}
                        required
                        error={selectedCountry && !selectedPort}
                        helperText={selectedCountry && !selectedPort ? "Please select a port" : ""}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Typography variant="body1">
                          {option.nama_pelabuhan}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" ml={1}>
                          {option.id_pelabuhan}
                        </Typography>
                      </Box>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    options={goods}
                    getOptionLabel={(option) => option.nama_barang || ''}
                    value={selectedGood}
                    onChange={handleGoodChange}
                    disabled={!selectedPort}
                    loading={loading}
                    isOptionEqualToValue={(option, value) => 
                      option.id_barang === value.id_barang
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Product / Barang"
                        placeholder={selectedPort ? "Select a product..." : "First select a port"}
                        required
                        error={selectedPort && !selectedGood}
                        helperText={selectedPort && !selectedGood ? "Please select a product" : ""}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Typography variant="body1">
                          {option.nama_barang}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" ml={1}>
                          {formatCurrency(option.harga)} | {option.diskon}%
                        </Typography>
                      </Box>
                    )}
                  />
                </Grid>

                {selectedGood && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        label="Product Description"
                        value={selectedGood.description || ''}
                        fullWidth
                        multiline
                        rows={3}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Original Price"
                        value={formatCurrency(selectedGood.harga || 0)}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Discount"
                        value={`${selectedGood.diskon || 0}%`}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Final Price (After Discount)"
                        value={formatCurrency(total)}
                        fullWidth
                        InputProps={{ readOnly: true }}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            color: 'primary.main',
                          },
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Selection Summary
              </Typography>

              <SelectionSummaryItem 
                label="Country"
                value={selectedCountry?.nama_negara}
                color="primary"
              />

              <SelectionSummaryItem
                label="Port"
                value={selectedPort?.nama_pelabuhan}
                color="secondary"
              />

              <SelectionSummaryItem
                label="Product"
                value={selectedGood?.nama_barang}
                color="success"
              />

              {selectedGood && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Final Price
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {formatCurrency(total)}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    (Original: {formatCurrency(selectedGood.harga)} - {selectedGood.diskon}% discount)
                  </Typography>
                </Box>
              )}

              {loading && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="info">Loading data...</Alert>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FormPage;