import nodemailer from "nodemailer";

if (
  !process.env.NODEMAILER_HOST ||
  !process.env.NODEMAILER_PORT ||
  !process.env.NODEMAILER_EMAIL ||
  !process.env.NODEMAILER_PASSWORD
) {
  throw new Error("Nodemailer environment variables are missing");
}

// ✅ Reusable transporter (better performance)
const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT),
  secure: Number(process.env.NODEMAILER_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  if (!to || typeof to !== "string") {
    throw new Error("Invalid recipient email");
  }

  if (!subject) {
    throw new Error("Email subject is required");
  }

  try {
    return await transporter.sendMail({
      from: `"Serpwear" <${process.env.NODEMAILER_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};