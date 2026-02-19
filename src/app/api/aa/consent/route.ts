import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/aa/consent
 * Body: { userId: string, phone: string }
 * Initiate Account Aggregator consent flow for data linking.
 * Returns: { success, consentId, redirectUrl }
 *
 * NOTE: Mock implementation. In production, integrate with
 * Setu/OneMoney/Finvu AA framework.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, phone } = body;

        if (!userId || typeof userId !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'userId' field." },
                { status: 400 }
            );
        }

        if (!phone || typeof phone !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'phone' field." },
                { status: 400 }
            );
        }

        // Mock AA consent initiation
        const consentId = `aa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        return NextResponse.json({
            success: true,
            consentId,
            status: "PENDING",
            redirectUrl: `https://aa.exitdebt.com/consent/${consentId}`, // Mock
            expiresIn: 600, // 10 minutes
            dataTypes: ["DEPOSIT", "TERM_DEPOSIT", "RECURRING_DEPOSIT", "CREDIT_CARD", "LOAN"],
            fiTypes: ["SAVINGS", "DEPOSITS", "TERM-DEPOSIT", "CREDIT-CARD"],
            message: "Consent request created. Redirect user to complete AA approval.",
            createdAt: new Date().toISOString(),
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body." },
            { status: 400 }
        );
    }
}
