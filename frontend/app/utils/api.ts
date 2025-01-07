import axios from 'axios';
import { AuthResponse } from '../models/AuthResponse';
import { BackendAccount } from '../models/BackendAccount';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://10.0.2.2:8000/api';

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${BASE_URL}/user/login`, { username, password });
  return response.data;
};

export const register = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${BASE_URL}/user/register`, { username, password });
  return response.data;
};

export const syncAccounts = async (accounts: BackendAccount[], token: string) => {
  try {
    await axiosInstance.put(`${BASE_URL}/accounts/accounts/sync`, accounts, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to sync accounts');
  }
};

export const fetchAccounts = async (token: string): Promise<BackendAccount[]> => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/accounts/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch accounts');
  }
};

export const refreshToken = async (refreshToken: string): Promise<string> => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/user/refresh`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    const { access_token } = response.data; 
    return access_token;
  } catch (error: any) {
    console.error("Error refreshing token:", error.response?.data);
    throw new Error(error.response?.data?.detail || 'Failed to refresh token');
  }
};
