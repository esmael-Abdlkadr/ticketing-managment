import asyncHandler from "./asyncHandler";
import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";
interface EmailOption {
  email: string;
  template: string;
  date: any;
  subject: string;
}
const sendEmail = async (Option: EmailOption) => {
  // Gmail transporter configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  const { email, template, date } = Option;
  const emailTemplate = path.join(__dirname, `../email/${template}.ejs`);
  const html: string = await ejs.renderFile(emailTemplate, date);
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: Option.email,
    subject: Option.subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};
export default sendEmail;
