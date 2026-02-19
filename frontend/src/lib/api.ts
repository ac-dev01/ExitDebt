/**
 * API client for ExitDebt backend.
 * All functions are typed and handle errors consistently.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface APIError {
  detail: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error: APIError = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Types ────────────────────────────────────────────────────────────────

export interface OTPResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface DebtAccount {
  id: string;
  lender_name: string;
  account_type: string;
  outstanding: number;
  interest_rate: number | null;
  emi_amount: number | null;
  status: string;
}

export interface FlaggedAccount {
  lender_name: string;
  account_type: string;
  reason: string;
  outstanding: number;
}

export interface HealthCheckResponse {
  id: string;
  score: number;
  category: string;
  credit_score: number | null;
  total_outstanding: number;
  total_emi: number;
  avg_rate: number;
  dti_ratio: number | null;
  savings_est: number;
  debt_accounts: DebtAccount[];
  flagged_accounts: FlaggedAccount[];
  whatsapp_share_link: string | null;
}

export interface CallbackResponse {
  id: string;
  user_id: string;
  preferred_time: string;
  status: string;
  message: string;
}

export interface AdvisoryResponse {
  id: string;
  user_id: string;
  tier: string;
  price: number;
  status: string;
  plan_data: Record<string, unknown> | null;
  payment_url: string | null;
  message: string;
}

// ─── API Functions ───────────────────────────────────────────────────────

export async function sendOTP(phone: string): Promise<OTPResponse> {
  return apiRequest<OTPResponse>('/api/otp/send', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOTP(phone: string, otp_code: string): Promise<OTPResponse> {
  return apiRequest<OTPResponse>('/api/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, otp_code }),
  });
}

export async function submitHealthCheck(data: {
  pan: string;
  phone: string;
  name: string;
  consent: boolean;
}): Promise<HealthCheckResponse> {
  return apiRequest<HealthCheckResponse>('/api/health-check', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getHealthCheck(id: string): Promise<HealthCheckResponse> {
  return apiRequest<HealthCheckResponse>(`/api/health-check/${id}`);
}

export async function submitCallback(
  user_id: string,
  preferred_time: string
): Promise<CallbackResponse> {
  return apiRequest<CallbackResponse>('/api/callback', {
    method: 'POST',
    body: JSON.stringify({ user_id, preferred_time }),
  });
}

export async function purchaseAdvisory(
  user_id: string,
  tier: string
): Promise<AdvisoryResponse> {
  return apiRequest<AdvisoryResponse>('/api/advisory/purchase', {
    method: 'POST',
    body: JSON.stringify({ user_id, tier }),
  });
}

export async function getAdvisory(id: string): Promise<AdvisoryResponse> {
  return apiRequest<AdvisoryResponse>(`/api/advisory/${id}`);
}

export async function deleteUser(user_id: string, phone: string): Promise<{ success: boolean; message: string }> {
  return apiRequest('/api/user/delete-request', {
    method: 'DELETE',
    body: JSON.stringify({ user_id, phone }),
  });
}
