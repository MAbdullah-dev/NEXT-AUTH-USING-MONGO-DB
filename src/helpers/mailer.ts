import User from "@/models/UserModel";
import nodemailer from "nodemailer";

interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
  try {
    if (emailType === "VERIFY") {
        // await User.findByIdAndUpdate.fi
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // secure for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Decide content based on type
    const subject =
      emailType === "VERIFY" ? "Verify Your Account" : "Reset Your Password";

    const actionUrl =
      emailType === "VERIFY"
        ? `${process.env.FRONTEND_URL}/verify/${userId}`
        : `${process.env.FRONTEND_URL}/reset-password/${userId}`;

    const html = `
      <p>
        Please click the link below to ${emailType === "VERIFY" ? "verify your account" : "reset your password"}:
      </p>
      <a href="${actionUrl}" target="_blank">
        ${emailType === "VERIFY" ? "Verify Account" : "Reset Password"}
      </a>
      <br><br>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    `;

    const mailOptions = {
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.error("Email send error:", error);
    throw new Error(error.message || "Failed to send email");
  }
};
