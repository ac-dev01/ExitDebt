'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Endpoint {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    path: string;
    description: string;
    auth?: boolean;
    requestBody?: string;
    responseBody: string;
    params?: string;
}

const PUBLIC_ENDPOINTS: Endpoint[] = [
    {
        method: 'POST',
        path: '/api/otp/send',
        description: 'Send a one-time password to the user\'s phone number.',
        requestBody: `{
  "phone": "+919876543210"
}`,
        responseBody: `{
  "success": true,
  "message": "OTP sent successfully."
}`,
    },
    {
        method: 'POST',
        path: '/api/otp/verify',
        description: 'Verify the OTP code sent to the user\'s phone.',
        requestBody: `{
  "phone": "+919876543210",
  "otp_code": "123456"
}`,
        responseBody: `{
  "success": true,
  "message": "OTP verified.",
  "token": "session-token-here"
}`,
    },
    {
        method: 'POST',
        path: '/api/health-check',
        description: 'Run a full debt health check. Pulls credit data, computes score, and returns results.',
        requestBody: `{
  "pan": "ABCDE1234F",
  "phone": "+919876543210",
  "name": "Priya Mehta",
  "consent": true
}`,
        responseBody: `{
  "id": "uuid",
  "score": 72,
  "category": "Fair",
  "credit_score": 720,
  "total_outstanding": 850000,
  "total_emi": 24500,
  "avg_rate": 18.5,
  "dti_ratio": 0.45,
  "savings_est": 62400,
  "debt_accounts": [...],
  "flagged_accounts": [...],
  "whatsapp_share_link": "https://wa.me/..."
}`,
    },
    {
        method: 'GET',
        path: '/api/health-check/{id}',
        description: 'Retrieve an existing health check result by its ID.',
        params: 'id — Health check UUID',
        responseBody: `{
  "id": "uuid",
  "score": 72,
  "category": "Fair",
  "total_outstanding": 850000,
  ...
}`,
    },
    {
        method: 'POST',
        path: '/api/callback',
        description: 'Schedule a callback and push a lead to Zoho CRM.',
        requestBody: `{
  "user_id": "uuid",
  "preferred_time": "2025-03-01T14:00:00Z"
}`,
        responseBody: `{
  "id": "uuid",
  "user_id": "uuid",
  "preferred_time": "2025-03-01T14:00:00Z",
  "status": "pending",
  "message": "Callback scheduled successfully."
}`,
    },
    {
        method: 'POST',
        path: '/api/advisory/purchase',
        description: 'Purchase an advisory plan (basic, standard, or premium).',
        requestBody: `{
  "user_id": "uuid",
  "tier": "standard"
}`,
        responseBody: `{
  "id": "uuid",
  "user_id": "uuid",
  "tier": "standard",
  "price": 999,
  "status": "pending_payment",
  "payment_url": "upi://pay?...",
  "message": "Advisory plan created."
}`,
    },
    {
        method: 'DELETE',
        path: '/api/user/delete-request',
        description: 'Request data deletion (GDPR/DPDPA compliance). Soft-deletes personal data.',
        requestBody: `{
  "user_id": "uuid",
  "phone": "+919876543210"
}`,
        responseBody: `{
  "success": true,
  "message": "Personal data has been removed."
}`,
    },
];

const INTERNAL_ENDPOINTS: Endpoint[] = [
    {
        method: 'GET',
        path: '/api/internal/users',
        description: 'List all users with pagination. Supports phone search.',
        auth: true,
        params: 'page (int), page_size (int), search (string, phone)',
        responseBody: `{
  "items": [{ "id": "uuid", "name": "...", "phone": "...", "created_at": "..." }],
  "total": 150,
  "page": 1,
  "page_size": 20,
  "total_pages": 8
}`,
    },
    {
        method: 'GET',
        path: '/api/internal/users/{id}',
        description: 'Get detailed user info including all health scores and callbacks.',
        auth: true,
        params: 'id — User UUID',
        responseBody: `{
  "id": "uuid",
  "name": "Priya Mehta",
  "phone": "+919876543210",
  "pan_hash": "sha256...",
  "health_scores": [...],
  "callbacks": [...]
}`,
    },
    {
        method: 'GET',
        path: '/api/internal/callbacks',
        description: 'List all callbacks with optional status filter.',
        auth: true,
        params: 'page, page_size, status (pending|confirmed|completed|cancelled)',
        responseBody: `{
  "items": [{ "id": "uuid", "user_name": "...", "status": "pending", ... }],
  "total": 42,
  ...
}`,
    },
    {
        method: 'PATCH',
        path: '/api/internal/callbacks/{id}/status',
        description: 'Update a callback status.',
        auth: true,
        requestBody: `{
  "status": "confirmed"
}`,
        responseBody: `{
  "id": "uuid",
  "status": "confirmed",
  "updated": true
}`,
    },
    {
        method: 'GET',
        path: '/api/internal/health-checks',
        description: 'List all health checks with pagination.',
        auth: true,
        params: 'page, page_size',
        responseBody: `{
  "items": [{ "id": "uuid", "user_name": "...", "score": 72, ... }],
  "total": 500,
  ...
}`,
    },
    {
        method: 'GET',
        path: '/api/internal/health-checks/{id}',
        description: 'Get a single health check detail.',
        auth: true,
        params: 'id — Health check UUID',
        responseBody: `{
  "id": "uuid",
  "user_name": "...",
  "score": 72,
  "avg_rate": 18.5,
  "savings_est": 62400,
  ...
}`,
    },
    {
        method: 'GET',
        path: '/api/internal/stats/overview',
        description: 'Dashboard-level stats: totals, averages, and callback breakdown.',
        auth: true,
        responseBody: `{
  "total_users": 1250,
  "total_health_checks": 3400,
  "total_callbacks": 420,
  "avg_health_score": 64.3,
  "total_savings_found": 24000000,
  "callbacks_pending": 15,
  "callbacks_confirmed": 38,
  "callbacks_completed": 350,
  "callbacks_cancelled": 17
}`,
    },
];

const METHOD_COLORS: Record<string, string> = {
    GET: '#22c55e',
    POST: '#3b82f6',
    PATCH: '#f59e0b',
    DELETE: '#ef4444',
};

function EndpointCard({ ep }: { ep: Endpoint }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            style={{
                border: '1px solid #2a2a3a',
                borderRadius: 12,
                marginBottom: 12,
                overflow: 'hidden',
                background: '#16162a',
            }}
        >
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 20px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                }}
            >
                <span
                    style={{
                        background: METHOD_COLORS[ep.method] || '#888',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontFamily: 'monospace',
                        minWidth: 60,
                        textAlign: 'center',
                    }}
                >
                    {ep.method}
                </span>
                <code style={{ color: '#e2e8f0', fontSize: 14, flex: 1 }}>{ep.path}</code>
                {ep.auth && (
                    <span
                        style={{
                            background: '#7c3aed33',
                            color: '#a78bfa',
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: 6,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}
                    >
                        API Key
                    </span>
                )}
                <span style={{ color: '#94a3b8', fontSize: 13 }}>{open ? '▲' : '▼'}</span>
            </button>

            {open && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #2a2a3a' }}>
                    <p style={{ color: '#94a3b8', fontSize: 14, margin: '16px 0 12px' }}>
                        {ep.description}
                    </p>

                    {ep.params && (
                        <div style={{ marginBottom: 12 }}>
                            <p style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                                Parameters
                            </p>
                            <code style={{ color: '#cbd5e1', fontSize: 13 }}>{ep.params}</code>
                        </div>
                    )}

                    {ep.requestBody && (
                        <div style={{ marginBottom: 12 }}>
                            <p style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                                Request Body
                            </p>
                            <pre
                                style={{
                                    background: '#0f0f1e',
                                    border: '1px solid #2a2a3a',
                                    borderRadius: 8,
                                    padding: 14,
                                    overflow: 'auto',
                                    color: '#a5f3fc',
                                    fontSize: 13,
                                    lineHeight: 1.5,
                                }}
                            >
                                {ep.requestBody}
                            </pre>
                        </div>
                    )}

                    <div>
                        <p style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                            Response
                        </p>
                        <pre
                            style={{
                                background: '#0f0f1e',
                                border: '1px solid #2a2a3a',
                                borderRadius: 8,
                                padding: 14,
                                overflow: 'auto',
                                color: '#86efac',
                                fontSize: 13,
                                lineHeight: 1.5,
                            }}
                        >
                            {ep.responseBody}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DocsPage() {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #0a0a1a 0%, #12122a 100%)',
                color: '#e2e8f0',
                fontFamily: "'Inter', -apple-system, sans-serif",
            }}
        >
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 80px' }}>
                {/* Header */}
                <div style={{ marginBottom: 48 }}>
                    <Link href="/" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                        ← Back to ExitDebt
                    </Link>
                    <h1 style={{ fontSize: 36, fontWeight: 800, marginTop: 16, marginBottom: 8 }}>
                        API Documentation
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6 }}>
                        Complete reference for the ExitDebt API. Base URL: <code style={{ background: '#1e1e3a', padding: '2px 8px', borderRadius: 4, fontSize: 14 }}>http://localhost:8000</code>
                    </p>
                </div>

                {/* Auth Section */}
                <div
                    style={{
                        background: '#1a1a2e',
                        border: '1px solid #2a2a3a',
                        borderRadius: 12,
                        padding: 24,
                        marginBottom: 40,
                    }}
                >
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>🔐 Authentication</h2>
                    <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
                        <strong style={{ color: '#e2e8f0' }}>Public endpoints</strong> require no authentication. They are used by the frontend app for OTP, health checks, and callbacks.
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
                        <strong style={{ color: '#e2e8f0' }}>Internal endpoints</strong> require an <code style={{ background: '#0f0f1e', padding: '2px 6px', borderRadius: 4 }}>X-API-Key</code> header. Set this in your backend <code style={{ background: '#0f0f1e', padding: '2px 6px', borderRadius: 4 }}>.env</code> as <code style={{ background: '#0f0f1e', padding: '2px 6px', borderRadius: 4 }}>INTERNAL_API_KEY</code>.
                    </p>
                    <pre
                        style={{
                            background: '#0f0f1e',
                            border: '1px solid #2a2a3a',
                            borderRadius: 8,
                            padding: 14,
                            color: '#fbbf24',
                            fontSize: 13,
                        }}
                    >
                        {`curl -H "X-API-Key: your-secret-key" \\
  http://localhost:8000/api/internal/stats/overview`}
                    </pre>
                </div>

                {/* Zoho CRM */}
                <div
                    style={{
                        background: '#1a1a2e',
                        border: '1px solid #2a2a3a',
                        borderRadius: 12,
                        padding: 24,
                        marginBottom: 40,
                    }}
                >
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>🔗 Zoho CRM Integration</h2>
                    <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
                        Leads are automatically pushed to Zoho CRM when a callback is scheduled. Configure these in your <code style={{ background: '#0f0f1e', padding: '2px 6px', borderRadius: 4 }}>.env</code>:
                    </p>
                    <pre
                        style={{
                            background: '#0f0f1e',
                            border: '1px solid #2a2a3a',
                            borderRadius: 8,
                            padding: 14,
                            color: '#86efac',
                            fontSize: 13,
                            lineHeight: 1.6,
                        }}
                    >
                        {`ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token
ZOHO_REDIRECT_URI=https://exitdebt.in/oauth/callback
ZOHO_ACCOUNTS_URL=https://accounts.zoho.in/oauth/v2/token`}
                    </pre>
                    <p style={{ color: '#64748b', fontSize: 13, marginTop: 12 }}>
                        When <code style={{ background: '#0f0f1e', padding: '2px 6px', borderRadius: 4 }}>ZOHO_REFRESH_TOKEN</code> is empty, the system uses a mock CRM that logs to console.
                    </p>
                </div>

                {/* Public Endpoints */}
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Public Endpoints</h2>
                <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
                    Used by the frontend. No authentication required.
                </p>
                {PUBLIC_ENDPOINTS.map((ep, i) => (
                    <EndpointCard key={i} ep={ep} />
                ))}

                {/* Internal Endpoints */}
                <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
                    Internal Endpoints
                </h2>
                <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
                    Admin access for managing users, callbacks, and viewing stats.
                    All require <code style={{ background: '#0f0f1e', padding: '2px 6px', borderRadius: 4 }}>X-API-Key</code> header.
                </p>
                {INTERNAL_ENDPOINTS.map((ep, i) => (
                    <EndpointCard key={i} ep={ep} />
                ))}

                {/* Rate Limits */}
                <div
                    style={{
                        background: '#1a1a2e',
                        border: '1px solid #2a2a3a',
                        borderRadius: 12,
                        padding: 24,
                        marginTop: 40,
                    }}
                >
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>⚡ Rate Limits</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #2a2a3a' }}>
                                <th style={{ textAlign: 'left', padding: '8px 0', color: '#64748b', fontWeight: 600 }}>Endpoint</th>
                                <th style={{ textAlign: 'left', padding: '8px 0', color: '#64748b', fontWeight: 600 }}>Limit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #1e1e3a' }}>
                                <td style={{ padding: '10px 0', color: '#cbd5e1' }}>CIBIL pulls (per phone)</td>
                                <td style={{ padding: '10px 0', color: '#fbbf24' }}>3 per 24 hours</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #1e1e3a' }}>
                                <td style={{ padding: '10px 0', color: '#cbd5e1' }}>OTP sends (per phone)</td>
                                <td style={{ padding: '10px 0', color: '#fbbf24' }}>5 per 15 minutes</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px 0', color: '#cbd5e1' }}>Internal API</td>
                                <td style={{ padding: '10px 0', color: '#fbbf24' }}>No limit (API key required)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Error Codes */}
                <div
                    style={{
                        background: '#1a1a2e',
                        border: '1px solid #2a2a3a',
                        borderRadius: 12,
                        padding: 24,
                        marginTop: 24,
                    }}
                >
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>❌ Error Codes</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #2a2a3a' }}>
                                <th style={{ textAlign: 'left', padding: '8px 0', color: '#64748b', fontWeight: 600 }}>Code</th>
                                <th style={{ textAlign: 'left', padding: '8px 0', color: '#64748b', fontWeight: 600 }}>Meaning</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ['400', 'Bad request — invalid input (e.g., bad PAN format)'],
                                ['401', 'Missing API key (internal endpoints)'],
                                ['403', 'Invalid API key'],
                                ['404', 'Resource not found'],
                                ['429', 'Rate limit exceeded'],
                                ['502', 'External service failure (CIBIL, Zoho)'],
                            ].map(([code, msg]) => (
                                <tr key={code} style={{ borderBottom: '1px solid #1e1e3a' }}>
                                    <td style={{ padding: '10px 0' }}>
                                        <code style={{ color: '#f87171', fontWeight: 600 }}>{code}</code>
                                    </td>
                                    <td style={{ padding: '10px 0', color: '#cbd5e1' }}>{msg}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: 48, color: '#475569', fontSize: 13 }}>
                    <p>
                        FastAPI auto-docs also available at{' '}
                        <a href="http://localhost:8000/docs" style={{ color: '#7c3aed' }}>
                            /docs (Swagger)
                        </a>{' '}
                        and{' '}
                        <a href="http://localhost:8000/redoc" style={{ color: '#7c3aed' }}>
                            /redoc
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
