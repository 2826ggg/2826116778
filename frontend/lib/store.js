'use client';

import create from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuthStore = create((set) => ({
  token: Cookies.get('token') || null,
  user: null,
  isLoading: false,
  error: null,

  register: async (email, password, username, phone) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/register', {
        email,
        password,
        username,
        phone,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      const { token, user } = response.data;
      Cookies.set('token', token, { expires: 7 });
      set({ token, user, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  adminLogin: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/admin-login', {
        username,
        password,
      });
      const { token, admin } = response.data;
      Cookies.set('admin_token', token, { expires: 7 });
      set({ token, user: admin, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  logout: () => {
    Cookies.remove('token');
    Cookies.remove('admin_token');
    set({ token: null, user: null });
  },
}));

export const useMarketStore = create((set) => ({
  symbols: [],
  candles: [],
  isLoading: false,

  fetchSymbols: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/market/symbols');
      set({ symbols: response.data, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  fetchCandles: async (symbol, period) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/market/candles', {
        params: { symbol, period },
      });
      set({ candles: response.data.candles, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));

export const useTradeStore = create((set) => ({
  orders: [],
  positions: [],
  isLoading: false,

  buyOrder: async (symbol, quantity, price, type) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/trade/buy', {
        symbol,
        quantity,
        price,
        type,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  sellOrder: async (symbol, quantity, price, type) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/trade/sell', {
        symbol,
        quantity,
        price,
        type,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export { axiosInstance, API_URL };
