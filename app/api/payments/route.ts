/*import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { handleCheckoutSessionCompleted, handleSubscriptionDeleted } from "@/lib/payments";
import { sub } from "date-fns";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (req: NextRequest) => {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "No Stripe signature found in request" },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout session completed');
        
        const sessionId = event.data.object.id;
        const session = await stripe.checkout.sessions.retrieve(sessionId,{
          expand: ['line_items']
        });
        
        await handleCheckoutSessionCompleted({session, stripe});


        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const subscriptionId = event.data.object.id;

        await handleSubscriptionDeleted({ subscriptionId, stripe });
        console.log(subscription);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error('Webhook error:', err);
    if (err instanceof Error) {
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unknown webhook error occurred" },
      { status: 400 }
    );
  }
};
*/
