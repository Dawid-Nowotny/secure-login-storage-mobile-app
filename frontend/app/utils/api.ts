import axios from 'axios';
import { AuthResponse } from '../models/AuthResponse';

const BASE_URL = 'http://10.0.2.2:8000/api';

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${BASE_URL}/user/login`, { username, password });
  return response.data;
};

export const register = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${BASE_URL}/user/register`, { username, password });
  return response.data;
};