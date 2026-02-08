const DEFAULT_API_BASE_URL = import.meta.env.DEV
	? 'http://localhost:8000'
	: 'https://skillhire-qs64.onrender.com';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

export const USER_API_END_POINT = `${API_BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${API_BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${API_BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${API_BASE_URL}/api/v1/company`;
