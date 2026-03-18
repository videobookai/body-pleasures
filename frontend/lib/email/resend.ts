import { Resend } from "resend";
import {
  CartAddedEmailInput,
  OrderStatusEmailInput,
  createCartAddedEmailTemplate,
  createOrderStatusEmailTemplate,
} from "./templates";

const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ensureEmailConfig = () => {
  if (!resend) {
    throw new Error("Resend is not configured. Missing RESEND_API_KEY.");
  }

  if (!resendFromEmail) {
    throw new Error("Resend sender is not configured. Missing RESEND_FROM_EMAIL.");
  }
};

export const sendOrderStatusEmail = async (
  to: string,
  payload: OrderStatusEmailInput
) => {
  ensureEmailConfig();

  const template = createOrderStatusEmailTemplate(payload);

  return resend!.emails.send({
    from: resendFromEmail!,
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

export const sendCartAddedEmail = async (
  to: string,
  payload: CartAddedEmailInput
) => {
  ensureEmailConfig();

  const template = createCartAddedEmailTemplate(payload);

  return resend!.emails.send({
    from: resendFromEmail!,
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

export const sendAdminOrderStatusEmail = async (
  payload: OrderStatusEmailInput
) => {
  if (!adminEmail) {
    throw new Error("Admin email is not configured. Missing ADMIN_EMAIL.");
  }

  return sendOrderStatusEmail(adminEmail, payload);
};
