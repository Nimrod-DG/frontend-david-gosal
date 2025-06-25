import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Grid, TextField, Autocomplete, Box, Alert, Chip } from '@mui/material';
import { 
  loadCountries, loadPorts, loadGoods, setSelectedCountry, 
  setSelectedPort, setSelectedGood, clearForm,setTouchedField,selectTotalPrice,formatDisplay,formatCurrency
} from '../../store/slices/formSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import toast, { Toaster } from 'react-hot-toast';

const FormPage = () => {
  const dispatch = useDispatch();
  const [hasMounted, setHasMounted] = useState(false);
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { 
    countries, 
    ports, 
    goods, 
    selectedCountry, 
    selectedPort, 
    selectedGood, 
    loading, 
    error,
    touchedFields
  } = useSelector((state) => state.form);
  
  const total = useSelector(selectTotalPrice);

  useEffect(() => {
    if (isAuthenticated) {
      const savedFormState = JSON.parse(localStorage.getItem('formState')) || {};
      if (savedFormState.selectedCountry) dispatch(setSelectedCountry(savedFormState.selectedCountry));
      if (savedFormState.selectedPort) dispatch(setSelectedPort(savedFormState.selectedPort));
      if (savedFormState.selectedGood) dispatch(setSelectedGood(savedFormState.selectedGood));
      dispatch(loadCountries());
      setHasMounted(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (hasMounted && isAuthenticated) {
      localStorage.setItem('formState', JSON.stringify({
        selectedCountry,
        selectedPort,
        selectedGood
      }));
    }
  }, [selectedCountry, selectedPort, selectedGood, hasMounted, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && hasMounted) {
      dispatch(clearForm());
      localStorage.removeItem('formState');
    }
  }, [isAuthenticated, hasMounted]);

  const handleSelectionChange = (type, newValue) => {
    dispatch(setTouchedField({ field: type, touched: true }));
    
    if (type === 'country') {
      dispatch(setSelectedCountry(newValue));
      if (newValue) {
        dispatch(loadPorts(newValue.id_negara));
      }
    } 
    else if (type === 'port') {
      dispatch(setSelectedPort(newValue));
      if (newValue) {
        dispatch(loadGoods(newValue.id_pelabuhan));
      }
    } 
    else {
      dispatch(setSelectedGood(newValue));
    }
  };

  const handleRetry = () => {
    dispatch(clearForm());
    dispatch(loadCountries());
    localStorage.removeItem('formState');
  };

  const SelectionSummaryItem = ({ label, value, color }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      {value ? <Chip label={value} color={color} size="small" /> : <Typography variant="body2">Not selected</Typography>}
    </Box>
  );

  if (loading && countries.length === 0) {
    return <LoadingSpinner message="Loading countries..." />;
  }

  return (
    <Container maxWidth="lg">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      
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
                {['country', 'port', 'goods'].map((type) => (
                  <Grid item xs={12} key={type}>
                    <Autocomplete
                      options={type === 'country' ? countries : 
                               type === 'port' ? ports : goods}
                      getOptionLabel={(option) => 
                        formatDisplay(option[`id_${type === 'country' ? 'negara' : type === 'port' ? 'pelabuhan' : 'barang'}`], 
                                    option[`nama_${type === 'country' ? 'negara' : type === 'port' ? 'pelabuhan' : 'barang'}`])
                      }
                      value={type === 'country' ? selectedCountry : 
                            type === 'port' ? selectedPort : selectedGood}
                      onChange={(e, newValue) => handleSelectionChange(type, newValue)}
                      loading={loading}
                      disabled={type === 'port' ? !selectedCountry : type === 'goods' ? !selectedPort : false}
                      isOptionEqualToValue={(option, value) => 
                        option[`id_${type === 'country' ? 'negara' : type === 'port' ? 'pelabuhan' : 'barang'}`] === 
                        value[`id_${type === 'country' ? 'negara' : type === 'port' ? 'pelabuhan' : 'barang'}`]
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`${type.charAt(0).toUpperCase() + type.slice(1)} / ${
                            type === 'country' ? 'Negara' : type === 'port' ? 'Pelabuhan' : 'Barang'
                          }`}
                          placeholder={
                            type === 'port' ? (selectedCountry ? "Select a port..." : "First select a country") :
                            type === 'goods' ? (selectedPort ? "Select a product..." : "First select a port") :
                            "Select a country..."
                          }
                          required
                          error={
                            (touchedFields[type] && !(type === 'country' ? selectedCountry : 
                             type === 'port' ? selectedPort : selectedGood)) &&
                            (type === 'country' || (type === 'port' && selectedCountry) || 
                             (type === 'goods' && selectedPort))
                          }
                          helperText={
                            touchedFields[type] && 
                            !(type === 'country' ? selectedCountry : 
                              type === 'port' ? selectedPort : selectedGood) &&
                            (type === 'country' || (type === 'port' && selectedCountry) || 
                             (type === 'goods' && selectedPort)) ?
                            `Please select a ${type}` : ""
                          }
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Typography variant="body1">
                            {formatDisplay(
                              option[`id_${type === 'country' ? 'negara' : type === 'port' ? 'pelabuhan' : 'barang'}`],
                              option[`nama_${type === 'country' ? 'negara' : type === 'port' ? 'pelabuhan' : 'barang'}`]
                            )}
                          </Typography>
                          {type === 'country' && option.kode_negara && (
                            <Typography variant="caption" color="text.secondary" ml={1}>
                              {option.kode_negara}
                            </Typography>
                          )}
                          {type === 'goods' && (
                            <Typography variant="caption" color="text.secondary" ml={1}>
                              {formatCurrency(option.harga)} | {option.diskon}%
                            </Typography>
                          )}
                        </Box>
                      )}
                    />
                  </Grid>
                ))}

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
                value={selectedCountry ? formatDisplay(selectedCountry.id_negara, selectedCountry.nama_negara) : null}
                color="primary"
              />

              <SelectionSummaryItem
                label="Port"
                value={selectedPort ? formatDisplay(selectedPort.id_pelabuhan, selectedPort.nama_pelabuhan) : null}
                color="secondary"
              />

              <SelectionSummaryItem
                label="Product"
                value={selectedGood ? formatDisplay(selectedGood.id_barang, selectedGood.nama_barang) : null}
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