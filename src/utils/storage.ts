import { User, JobRequest } from '../types/index.ts';

const USER_STORAGE_KEY = 'fixmate_real_user_profile';
const JOBS_STORAGE_KEY = 'fixmate_real_user_jobs';

export const DEFAULT_USER: User = {
  id: '',
  name: '',
  email: '',
  phone: '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  role: 'customer',
  address: '',
  location: {
    lat: 12.9716,
    lng: 77.5946
  },
  authProvider: 'phone'
};

export const loadStoredUser = (): User | null => {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load user profile from storage', err);
    return null;
  }
};

export const saveStoredUser = (user: User): void => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user profile to storage', err);
  }
};

export const clearStoredUser = (): void => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear user from storage', err);
  }
};

export const loadStoredJobs = (): JobRequest[] | null => {
  try {
    const data = localStorage.getItem(JOBS_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load jobs from storage', err);
    return null;
  }
};

export const saveStoredJobs = (jobs: JobRequest[]): void => {
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  } catch (err) {
    console.error('Failed to save jobs to storage', err);
  }
};
