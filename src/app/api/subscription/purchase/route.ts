import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscription/purchase
 * Body: { userId: string, plan: "annual" }
 * Initiate UPI payment for ₹999/year subscription.
 * Returns: { success, subscriptionId, paymentLink, amount }
 *
 * NOTE: Mock implementation. In production, integrate with
 * Razorpay/Cashfree/PhonePe for UPI payment flow.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, plan } = body;

        if (!userId || typeof userId !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'userId' field." },
                { status: 400 }
            );
        }

        if (plan !== "annual") {
            return NextResponse.json(
                { success: false, error: "Only 'annual' plan is currently supported." },
                { status: 400 }
            );
        }

        // Mock payment initiation
        const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        return NextResponse.json({
            success: true,
            subscriptionId,
            plan: "annual",
            amount: 999,
            currency: "INR",
            paymentLink: `https://pay.exitdebt.com/${subscriptionId}`, // Mock
            expiresIn: 900, // 15 minutes to complete payment
            message: "Payment link generated. Complete payment via UPI.",
            createdAt: new Date().toISOString(),
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body." },
            { status: 400 }
        );
    }
}
