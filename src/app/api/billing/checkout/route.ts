import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';
import { SubscriptionTier, UserSubscription } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tier,
      billingCycle = 'monthly',
      userId,
      userEmail,
      userName,
      paymentMethod = 'UPI',
    } = body;

    if (!tier || !['starter', 'pro', 'agency'].includes(tier)) {
      return NextResponse.json(
        { success: false, error: 'Invalid subscription tier selected' },
        { status: 400 }
      );
    }

    // Pricing calculation
    const pricingMatrix: Record<
      SubscriptionTier,
      { name: string; monthlyBase: number; annualBase: number }
    > = {
      starter: { name: 'Free Starter', monthlyBase: 0, annualBase: 0 },
      pro: { name: 'Pro Planner', monthlyBase: 1499, annualBase: 14388 }, // ₹1,199/mo equivalent
      agency: { name: 'Studio / Agency', monthlyBase: 4999, annualBase: 47988 }, // ₹3,999/mo equivalent
    };

    const planConfig = pricingMatrix[tier as SubscriptionTier];
    const basePrice = billingCycle === 'annual' ? planConfig.annualBase : planConfig.monthlyBase;
    const gstRate = 0.18; // 18% GST in India
    const gstAmount = Math.round(basePrice * gstRate);
    const totalAmount = basePrice + gstAmount;

    // Calculate expiry (1 month or 1 year)
    const durationDays = tier === 'starter' ? 3650 : billingCycle === 'annual' ? 365 : 30;
    const currentPeriodEnd = new Date(Date.now() + durationDays * 86400000).toISOString();
    const invoiceId = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const subscription: UserSubscription = {
      tier: tier as SubscriptionTier,
      billing_cycle: billingCycle,
      status: 'active',
      current_period_end: currentPeriodEnd,
      plan_name: planConfig.name,
      amount_paid: totalAmount,
      currency: 'INR',
      invoice_id: invoiceId,
      activated_at: new Date().toISOString(),
    };

    // Update in database if userId provided
    if (userId) {
      await ServerDB.updateSubscription(userId, subscription);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully subscribed to ${planConfig.name}!`,
      subscription,
      invoice: {
        invoiceId,
        date: new Date().toISOString(),
        customerName: userName || 'Valued Planner',
        customerEmail: userEmail || '',
        tier: planConfig.name,
        billingCycle,
        basePrice,
        gstRate: '18%',
        gstAmount,
        totalAmount,
        currency: 'INR',
        paymentMethod,
        paymentStatus: 'PAID',
      },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Checkout processing failed' },
      { status: 500 }
    );
  }
}
