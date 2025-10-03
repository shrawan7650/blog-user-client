import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, type, message } = await req.json();

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

    const currentDate = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    let ownerTemplate = "";
    let subscriberTemplate = "";
    let ownerSubject = "";
    let subscriberSubject = "";

    // Common email styles
    const baseStyles = `
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6c757d; font-size: 14px; }
        .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
        .info-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .highlight { color: #667eea; font-weight: 600; }
      </style>
    `;

    switch (type) {
      case "newsletter":
        ownerSubject = "📰 New Newsletter Subscriber";
        ownerTemplate = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8">${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 New Subscriber!</h1>
              </div>
              <div class="content">
                <p style="font-size: 16px; color: #333; line-height: 1.6;">You have a new newsletter subscriber:</p>
                <div class="info-box">
                  <p style="margin: 8px 0;"><strong>👤 Name:</strong> ${name}</p>
                  <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${email}</p>
                  <p style="margin: 8px 0;"><strong>🕐 Subscribed:</strong> ${currentDate}</p>
                </div>
                <p style="color: #6c757d; font-size: 14px; margin-top: 20px;">Your community is growing! 🚀</p>
              </div>
              <div class="footer">
                <p>Inspitech Newsletter System</p>
              </div>
            </div>
          </body>
          </html>
        `;

        subscriberSubject = "✅ Welcome to Inspitech - Let's Begin! 🚀";
        subscriberTemplate = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8">${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Inspitech! 🎉</h1>
              </div>
              <div class="content">
                <h2 style="color: #333; font-size: 24px;">Hey ${name}! 👋</h2>
                <p style="font-size: 16px; color: #555; line-height: 1.8;">
                  We're thrilled to have you join our community of tech enthusiasts and innovators! 
                  You've just taken the first step towards staying ahead in the world of AI and technology.
                </p>
                
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #667eea;">📬 What to Expect:</h3>
                  <ul style="color: #555; line-height: 1.8;">
                    <li>Weekly insights on AI & emerging technologies</li>
                    <li>Exclusive tutorials and tips</li>
                    <li>Industry news and trends</li>
                    <li>Behind-the-scenes content</li>
                  </ul>
                </div>

                <p style="font-size: 16px; color: #555; line-height: 1.8;">
                  Our next newsletter drops soon, so keep an eye on your inbox! 👀
                </p>

                <div style="text-align: center;">
                  <a href="https://blog-user-client.vercel.app" class="button">Explore Inspitech</a>
                </div>

                <p style="font-size: 14px; color: #6c757d; margin-top: 30px; line-height: 1.6;">
                  Have questions or suggestions? Just hit reply - we'd love to hear from you!
                </p>
              </div>
              <div class="footer">
                <p style="margin: 5px 0;"><strong>Inspitech</strong></p>
                <p style="margin: 5px 0;">Inspiring Innovation, One Email at a Time</p>
                <p style="margin: 15px 0; font-size: 12px;">
                  <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                  <a href="#" style="color: #667eea; text-decoration: none;">View in Browser</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case "contact":
        ownerSubject = "📬 New Contact Form Submission";
        ownerTemplate = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8">${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📩 New Message Received</h1>
              </div>
              <div class="content">
                <p style="font-size: 16px; color: #333; line-height: 1.6;">Someone reached out through your contact form:</p>
                
                <div class="info-box">
                  <p style="margin: 8px 0;"><strong>👤 Name:</strong> ${name}</p>
                  <p style="margin: 8px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a></p>
                  <p style="margin: 8px 0;"><strong>🕐 Sent:</strong> ${currentDate}</p>
                </div>

                <div style="background: #ffffff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #333; font-size: 18px;">💬 Message:</h3>
                  <p style="color: #555; line-height: 1.8; white-space: pre-wrap;">${message || "No message provided"}</p>
                </div>

                <div style="text-align: center;">
                  <a href="mailto:${email}" class="button">Reply Now</a>
                </div>
              </div>
              <div class="footer">
                <p>Inspitech Contact System</p>
              </div>
            </div>
          </body>
          </html>
        `;

        subscriberSubject = "✅ We Got Your Message! - Inspitech";
        subscriberTemplate = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8">${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thanks for Reaching Out! 💙</h1>
              </div>
              <div class="content">
                <h2 style="color: #333; font-size: 24px;">Hi ${name}! 👋</h2>
                
                <p style="font-size: 16px; color: #555; line-height: 1.8;">
                  Thanks for contacting <span class="highlight">Inspitech</span>! We've received your message 
                  and we're excited to connect with you.
                </p>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #667eea;">📝 Your Message:</h3>
                  <p style="color: #555; line-height: 1.8; font-style: italic; white-space: pre-wrap;">"${message || "No message provided"}"</p>
                </div>

                <div style="background: #f0f7ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
                  <h3 style="margin-top: 0; color: #333; font-size: 18px;">⚡ What's Next?</h3>
                  <p style="color: #555; line-height: 1.8; margin: 0;">
                    Our team will review your message and get back to you within <strong>24-48 hours</strong>. 
                    We appreciate your patience! 🙏
                  </p>
                </div>

                <p style="font-size: 16px; color: #555; line-height: 1.8;">
                  In the meantime, feel free to explore our latest content and resources:
                </p>

                <div style="text-align: center;">
                  <a href="https://blog-user-client.vercel.app" class="button">Visit Inspitech</a>
                </div>

                <p style="font-size: 14px; color: #6c757d; margin-top: 30px; line-height: 1.6;">
                  <strong>Note:</strong> This is an automated confirmation. Please don't reply to this email. 
                  We'll respond from our team's email address soon!
                </p>
              </div>
              <div class="footer">
                <p style="margin: 5px 0;"><strong>Inspitech</strong></p>
                <p style="margin: 5px 0;">We'll be in touch soon! ✨</p>
                <p style="margin: 15px 0; font-size: 12px;">
                  <a href="#" style="color: #667eea; text-decoration: none;">Visit Website</a> | 
                  <a href="#" style="color: #667eea; text-decoration: none;">Follow Us</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid type provided." },
          { status: 400 }
        );
    }

    // Send to owner
    await transporter.sendMail({
      from: `"Inspitech" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: ownerSubject,
      html: ownerTemplate,
    });

    // Send to subscriber
    await transporter.sendMail({
      from: `"Inspitech" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subscriberSubject,
      html: subscriberTemplate,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 }
    );
  }
}