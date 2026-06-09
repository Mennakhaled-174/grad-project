// import { Injectable } from '@nestjs/common';
// import Stripe from 'stripe';

// @Injectable()
// export class StripeService {

//   private stripe = new Stripe(
//     process.env.STRIPE_SECRET_KEY!,
//     {
//       apiVersion: '2026-04-22.dahlia',
//     },
//   );

//   // Old checkout session (keep for reference)
//   async createCheckoutSession(price: number, bookingId: string) {
//     const session = await this.stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'egp',
//             product_data: { name: 'Cleaning Service' },
//             unit_amount: Math.round(price * 100),  // ✅ converts EGP to piastres
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `http://localhost:3000/booking/payment-success/${bookingId}`,
//       cancel_url:  `http://127.0.0.1:5500/booking.html`,
//     });
//     return session.url;
//   }

//   // New: create payment intent for embedded form
//   async createPaymentIntent(price: number, bookingId: string) {
//     const paymentIntent = await this.stripe.paymentIntents.create({
//       amount: price * 100,
//       currency: 'egp',
//       metadata: { bookingId },
//       automatic_payment_methods: { enabled: true },
//     });

//     return {
//       clientSecret: paymentIntent.client_secret,
//       paymentIntentId: paymentIntent.id,
//     };
//   }
// }