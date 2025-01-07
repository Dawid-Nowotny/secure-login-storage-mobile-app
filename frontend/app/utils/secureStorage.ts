import * as SecureStore from 'expo-secure-store';
import { Account } from '../models/Account';

const STORAGE_KEY = 'accounts';

export const loadAccounts= async (): Promise<Account[]> => {
  const storedAccounts = await SecureStore.getItemAsync(STORAGE_KEY);
  return storedAccounts ? JSON.parse(storedAccounts) : [];
};

export const saveAccounts = async (accounts: Account[]): Promise<void> => {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(accounts));
};

export const clearAccounts = async () => {
  try {
    await SecureStore.deleteItemAsync('accounts');
  } catch (error) {
    throw new Error('Failed to clear accounts');
  }
};

export const setTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  await SecureStore.setItemAsync('access_token', accessToken);
  await SecureStore.setItemAsync('refresh_token', refreshToken);
};

export const getAccessToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('access_token');
};

export const getRefreshToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('refresh_token');
};

export const getTokens = async () => {
  const accessToken = await SecureStore.getItemAsync('access_token');
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  return { access_token: accessToken, refresh_token: refreshToken };
};

export const clearTokens = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('access_token');
  await SecureStore.deleteItemAsync('refresh_token');
};