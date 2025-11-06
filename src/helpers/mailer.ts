import User from "@/models/UserModel";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
  try {
    // Hash user ID for secure token storage
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    // Save token in DB
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: Date.now() + 3600000,
      });
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for others
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Define email subject and link based on type
    const subject =
      emailType === "VERIFY" ? "Verify Your Account" : "Reset Your Password";

    // Use DOMAIN from .env (e.g. http://localhost:3000)
    const actionUrl =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verify/${hashedToken}`
        : `${process.env.DOMAIN}/reset-password/${hashedToken}`;

    // Email HTML content
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e5e5e5;border-radius:8px;">
        <h2 style="text-align:center;color:#333;">
          ${emailType === "VERIFY" ? "Verify Your Account" : "Reset Your Password"}
        </h2>
        <p style="color:#555;font-size:16px;">
          Please click the button below to ${emailType === "VERIFY" ? "verify your account" : "reset your password"}:
        </p>
        <p style="text-align:center;margin:30px 0;">
          <a href="${actionUrl}" target="_blank"
             style="background-color:#007BFF;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
            ${emailType === "VERIFY" ? "Verify Account" : "Reset Password"}
          </a>
        </p>
        <p style="color:#999;font-size:14px;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
    `;

    // Send the email
    const mailResponse = await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });

    return mailResponse;
  } catch (error: any) {
    console.error("Email send error:", error);
    throw new Error(error.message || "Failed to send email");
  }
};
