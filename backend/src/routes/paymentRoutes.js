import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CLIENT_BASE_URL =
  process.env.CLIENT_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000";

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, locale, userId, address, phone, total } = req.body;

    if (!items?.length) {
      return res.status(400).json({ error: "No items provided in the request body." });
    }

    const baseUrl = CLIENT_BASE_URL;
    const langPrefix = locale ? `/${locale}` : "";

    const success_url = `${baseUrl}${langPrefix}/success`;
    const cancel_url = `${baseUrl}${langPrefix}/cart`;

    console.log("✅ Using baseUrl:", baseUrl);
    console.log("✅ success_url:", success_url);
    console.log("✅ cancel_url:", cancel_url);

    // 🧮 Ensure all prices are discounted
    const line_items = items.map((item) => {
      const discount = Number(item.discount) || 0;
      const price = Number(item.price) || 0;
      const finalPrice =
        item.discountPrice && item.discountPrice > 0
          ? Number(item.discountPrice)
          : discount > 0
          ? Number((price * (1 - discount / 100)).toFixed(2))
          : price;

      const rawImageUrl = item.image || item.images?.[0]?.url;
      const images = [];
      if (typeof rawImageUrl === "string" && rawImageUrl.length > 0) {
        let imageUrl = rawImageUrl;
        if (!rawImageUrl.startsWith("http://") && !rawImageUrl.startsWith("https://")) {
          imageUrl = `${baseUrl}${rawImageUrl.startsWith("/") ? "" : "/"}${rawImageUrl}`;
        }
        if (imageUrl.startsWith("http")) {
          images.push(imageUrl);
        }
      }

      return {
        price_data: {
          currency: "egp",
          product_data: {
            name: item.name?.en || item.name,
            images,
          },
          unit_amount: Math.round(finalPrice * 100),
        },
        quantity: item.quantity,
      };
    });

    // 🧠 Include metadata for webhook use
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url,
      cancel_url,
      metadata: {
        userId: userId || "",
        orderData: JSON.stringify({
          items,
          total,
          method: "Credit Card",
          address,
          phone,
        }),
      },
    });

    console.log("✅ Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    const errorMessage =
      error.message || "An unknown error occurred during Stripe session creation.";
    console.error("❌ Stripe error:", errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});




// ⚡ Stripe Webhook Route
// router.post(
//   "/stripe-webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error("❌ Webhook signature error:", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // ✅ Handle successful payment
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const userId = session.metadata?.userId;
//       const orderData =
//         session.metadata?.orderData &&
//         JSON.parse(session.metadata.orderData);

//       console.log("✅ Payment success for user:", userId);
//       console.log("🧾 Order Data:", orderData);

//       // TODO: You can add logic here:
//       // 1. Save the order in MongoDB
//       // 2. Clear user's cart (if logged in)
//       // 3. Send confirmation email
//     }

//     res.status(200).json({ received: true });
//   }
// );

export default router;
