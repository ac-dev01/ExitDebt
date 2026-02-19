import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/aa/fetch?userId=xxx
 * Fetch latest data from Account Aggregator.
 * Returns: { success, data, lastFetched }
 *
 * NOTE: Mock implementation. In production, fetch from AA after consent.
 */
export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { success: false, error: "Missing 'userId' query parameter." },
            { status: 400 }
        );
    }

    // Mock: Return empty data — real data would come from AA after consent
    return NextResponse.json({
        success: true,
        userId,
        status: "NO_CONSENT", // NO_CONSENT | PENDING | ACTIVE | EXPIRED
        data: null,
        message: "No active AA consent found. Initiate consent via POST /api/aa/consent first.",
        lastFetched: null,
    });
}
