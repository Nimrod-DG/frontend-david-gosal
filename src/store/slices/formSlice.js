import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

export const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(amount);

export const formatDisplay = (id, name) => `${id} - ${name}`;

export const loadCountries = createAsyncThunk(
  'form/loadCountries',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.getCountries();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadPorts = createAsyncThunk(
  'form/loadPorts',
  async (countryId, { rejectWithValue }) => {
    try {
      return await apiService.getPortsByCountry(countryId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadGoods = createAsyncThunk(
  'form/loadGoods',
  async (portId, { rejectWithValue }) => {
    try {
      return await apiService.getGoodsByPort(portId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  countries: [],
  ports: [],
  goods: [],
  selectedCountry: null,
  selectedPort: null,
  selectedGood: null,
  loading: false,
  error: null,
  touchedFields: {
    country: false,
    port: false,
    goods: false
  }
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setTouchedField: (state, action) => {
      const { field, touched } = action.payload;
      state.touchedFields[field] = touched;
    },
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
      state.ports = [];
      state.selectedPort = null;
      state.goods = [];
      state.selectedGood = null;
    },
    setSelectedPort: (state, action) => {
      state.selectedPort = action.payload;
      state.goods = [];
      state.selectedGood = null;
    },
    setSelectedGood: (state, action) => {
      state.selectedGood = action.payload;
    },
    clearForm: (state) => {
      state.selectedCountry = null;
      state.selectedPort = null;
      state.selectedGood = null;
      state.ports = [];
      state.goods = [];
      state.touchedFields = {
        country: false,
        port: false,
        goods: false
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(loadCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadPorts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPorts.fulfilled, (state, action) => {
        state.loading = false;
        state.ports = action.payload;
      })
      .addCase(loadPorts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadGoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadGoods.fulfilled, (state, action) => {
        state.loading = false;
        state.goods = action.payload;
      })
      .addCase(loadGoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const selectTotalPrice = (state) => {
  const { selectedGood } = state.form;
  if (!selectedGood) return 0;
  const price = selectedGood.harga || 0;
  const discount = selectedGood.diskon || 0;
  return price - (price * (discount / 100));
};

export const {
  setTouchedField,
  setSelectedCountry,
  setSelectedPort,
  setSelectedGood,
  clearForm,
} = formSlice.actions;

export default formSlice.reducer;