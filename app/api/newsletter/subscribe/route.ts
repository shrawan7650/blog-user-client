import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const currentDate = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
      });

    // 1️⃣ Email to site owner (you)
    const ownerTemplate = `
      <div style="font-family: 'Segoe UI', sans-serif; background:#f5f5f5; padding:20px;">
        <h2 style="color:#4f46e5;">📩 New Inspitech Newsletter Subscriber</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subscribed on:</strong> ${currentDate}</p>
        <p>🎯 AI & Tech insights fan just subscribed!</p>
      </div>
    `;

    // 2️⃣ Confirmation email to subscriber
    const subscriberTemplate = `
      <div style="font-family: 'Segoe UI', sans-serif; background:#0f172a; color:#e2e8f0; padding:30px; border-radius:12px;">
        <h2 style="color:#6366f1;">🚀 Welcome to Inspitech!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for subscribing to our newsletter. You’ll now receive the latest AI, tech, and blog insights directly in your inbox weekly!</p>
        <p>Stay tuned for tutorials, guides, and updates from Inspitech.</p>
        <div style="margin:20px 0; text-align:center;">
          <a href=" https://blog-user-client.vercel.app" target="_blank" rel="noopener noreferrer"
             style="background:#6366f1; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
            Visit Inspitech
          </a>
        </div>
        <p style="font-size:12px; opacity:0.7;">If you didn’t subscribe, please ignore this email.</p>
      </div>
    `;

    // Send email to site owner
    await transporter.sendMail({
      from: `"Inspitech Newsletter" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL, 
      subject: "📰 New Newsletter Subscriber",
      html: ownerTemplate,
    });

    // Send confirmation email to subscriber
    await transporter.sendMail({
      from: `"Inspitech Newsletter" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "✅ Welcome to Inspitech Newsletter!",
      html: subscriberTemplate,
    });

    return NextResponse.json({ success: true, message: "Subscribed successfully!" });
  } catch (err) {
    // console.error("Newsletter subscription error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Try again later." },
      { status: 500 }
    );
  }
}
