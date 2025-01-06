import * as SecureStore from 'expo-secure-store';
import { Credential } from '../models/Credential';

const STORAGE_KEY = 'credentials';

export const loadCredentials = async (): Promise<Credential[]> => {
  const storedCredentials = await SecureStore.getItemAsync(STORAGE_KEY);
  return storedCredentials ? JSON.parse(storedCredentials) : [];
};

export const saveCredentials = async (credentials: Credential[]): Promise<void> => {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(credentials));
};

export const clearCredentials = async () => {
  try {
    await SecureStore.deleteItemAsync('credentials');
  } catch (error) {
    throw new Error('Failed to clear credentials');
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

export const clearTokens = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('access_token');
  await SecureStore.deleteItemAsync('refresh_token');
};