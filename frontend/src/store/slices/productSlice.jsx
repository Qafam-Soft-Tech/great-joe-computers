import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchProducts = createAsyncThunk('products/fetch', async (filters = {}, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/products', { params: filters });
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/products/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
      })
      .addCase(fetchProduct.pending, (state) => { state.loading = true; })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load product';
      });
  },
});

export default productSlice.reducer;