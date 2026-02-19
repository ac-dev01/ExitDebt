import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/subscription/status?userId=xxx
 * Check subscription status (trial/active/expired).
 * Returns: { success, status, plan, expiresAt, daysRemaining }
 *
 * NOTE: Mock implementation. In production, query database.
 */
export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { success: false, error: "Missing 'userId' query parameter." },
            { status: 400 }
        );
    }

    // Mock: All users are on trial
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    return NextResponse.json({
        success: true,
        userId,
        status: "trial", // trial | active | expired
        plan: null,
        trialEndsAt: trialEnd.toISOString(),
        daysRemaining: 7,
        features: {
            healthCheck: true,
            dashboardBasic: true,
            dashboardAdvanced: false,
            prioritizer: true,
            expertCallback: true,
            lenderOffers: false,
        },
    });
}
