export type EmailTemplate = {
  subject: string;
  text: string;
  html: string;
};

export type OrderEmailItem = {
  name: string;
  quantity: number;
  price: number;
};

export type OrderStatus = "success" | "failed" | "pending" | string;

export type OrderStatusEmailInput = {
  customerName?: string;
  orderId?: string;
  orderStatus: OrderStatus;
  totalAmount?: number;
  paymentId?: string;
  createdAt?: string;
  shippingAddress?: string;
  failureReason?: string;
  items?: OrderEmailItem[];
};

export type CartAddedEmailInput = {
  customerName?: string;
  productName: string;
  quantity: number;
  unitPrice?: number;
  lineTotal?: number;
  cartTotal?: number;
  addedAt?: string;
};

const formatCurrency = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
  return `$${value.toFixed(2)}`;
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const normalizeOrderStatus = (status: OrderStatus) =>
  String(status || "pending").toLowerCase();

const getOrderStatusCopy = (status: OrderStatus, failureReason?: string) => {
  const normalized = normalizeOrderStatus(status);

  if (["success", "paid", "completed"].includes(normalized)) {
    return {
      label: "Successful",
      short: "Your order has been placed successfully.",
      long: "Payment was received and we are preparing your items for delivery.",
    };
  }

  if (["failed", "declined", "cancelled", "canceled"].includes(normalized)) {
    const reason = failureReason?.trim() || "Payment verification failed";
    return {
      label: "Failed",
      short: "Your order could not be completed.",
      long: `Reason: ${reason}. Please try again or use a different payment method.`,
    };
  }

  return {
    label: "Pending",
    short: "Your order was received and is pending confirmation.",
    long: "We will notify you as soon as the payment and fulfillment status is confirmed.",
  };
};

const renderOrderItemsText = (items?: OrderEmailItem[]) => {
  if (!items?.length) return "No order items provided.";

  return items
    .map((item, index) => {
      const itemTotal = item.quantity * item.price;
      return `${index + 1}. ${item.name} x${item.quantity} - ${formatCurrency(itemTotal)}`;
    })
    .join("\n");
};

const renderOrderItemsHtml = (items?: OrderEmailItem[]) => {
  if (!items?.length) return "<p>No order items provided.</p>";

  const rows = items
    .map((item) => {
      const lineTotal = item.quantity * item.price;
      return `<tr>
        <td style=\"padding:8px;border-bottom:1px solid #eee;\">${escapeHtml(item.name)}</td>
        <td style=\"padding:8px;border-bottom:1px solid #eee;text-align:center;\">${item.quantity}</td>
        <td style=\"padding:8px;border-bottom:1px solid #eee;text-align:right;\">${formatCurrency(item.price)}</td>
        <td style=\"padding:8px;border-bottom:1px solid #eee;text-align:right;\">${formatCurrency(lineTotal)}</td>
      </tr>`;
    })
    .join("");

  return `<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse;font-size:14px;\">
    <thead>
      <tr>
        <th style=\"padding:8px;text-align:left;border-bottom:1px solid #ddd;\">Item</th>
        <th style=\"padding:8px;text-align:center;border-bottom:1px solid #ddd;\">Qty</th>
        <th style=\"padding:8px;text-align:right;border-bottom:1px solid #ddd;\">Unit</th>
        <th style=\"padding:8px;text-align:right;border-bottom:1px solid #ddd;\">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
};

export const createOrderStatusEmailTemplate = (
  input: OrderStatusEmailInput
): EmailTemplate => {
  const name = input.customerName?.trim() || "Customer";
  const orderId = input.orderId?.trim() || "N/A";
  const statusCopy = getOrderStatusCopy(input.orderStatus, input.failureReason);

  const subject = `[Order ${statusCopy.label}] Order #${orderId}`;

  const text = [
    `Hi ${name},`,
    "",
    statusCopy.short,
    statusCopy.long,
    "",
    `Order ID: ${orderId}`,
    `Order Date: ${formatDate(input.createdAt)}`,
    `Order Status: ${statusCopy.label}`,
    `Total Amount: ${formatCurrency(input.totalAmount)}`,
    `Payment ID: ${input.paymentId || "N/A"}`,
    `Shipping Address: ${input.shippingAddress || "N/A"}`,
    "",
    "Order Items:",
    renderOrderItemsText(input.items),
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f2937;">
      <h2 style="margin:0 0 12px;">Order Update</h2>
      <p>Hi ${escapeHtml(name)},</p>
      <p><strong>${escapeHtml(statusCopy.short)}</strong></p>
      <p>${escapeHtml(statusCopy.long)}</p>

      <div style="margin:16px 0;padding:12px;background:#f9fafb;border:1px solid #e5e7eb;">
        <p style="margin:4px 0;"><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
        <p style="margin:4px 0;"><strong>Order Date:</strong> ${escapeHtml(formatDate(input.createdAt))}</p>
        <p style="margin:4px 0;"><strong>Status:</strong> ${escapeHtml(statusCopy.label)}</p>
        <p style="margin:4px 0;"><strong>Total Amount:</strong> ${escapeHtml(formatCurrency(input.totalAmount))}</p>
        <p style="margin:4px 0;"><strong>Payment ID:</strong> ${escapeHtml(input.paymentId || "N/A")}</p>
        <p style="margin:4px 0;"><strong>Shipping Address:</strong> ${escapeHtml(input.shippingAddress || "N/A")}</p>
      </div>

      <h3 style="margin:16px 0 8px;">Order Items</h3>
      ${renderOrderItemsHtml(input.items)}
    </div>
  `;

  return { subject, text, html };
};

export const createCartAddedEmailTemplate = (
  input: CartAddedEmailInput
): EmailTemplate => {
  const name = input.customerName?.trim() || "Customer";
  const lineTotal =
    typeof input.lineTotal === "number"
      ? input.lineTotal
      : typeof input.unitPrice === "number"
        ? input.unitPrice * input.quantity
        : undefined;

  const subject = `Added to Cart: ${input.productName}`;

  const text = [
    `Hi ${name},`,
    "",
    `You added ${input.quantity} x ${input.productName} to your cart.`,
    `Unit Price: ${formatCurrency(input.unitPrice)}`,
    `Line Total: ${formatCurrency(lineTotal)}`,
    `Current Cart Total: ${formatCurrency(input.cartTotal)}`,
    `Added On: ${formatDate(input.addedAt)}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f2937;">
      <h2 style="margin:0 0 12px;">Cart Update</h2>
      <p>Hi ${escapeHtml(name)},</p>
      <p>You added an item to your cart.</p>

      <div style="margin:16px 0;padding:12px;background:#f9fafb;border:1px solid #e5e7eb;">
        <p style="margin:4px 0;"><strong>Product:</strong> ${escapeHtml(input.productName)}</p>
        <p style="margin:4px 0;"><strong>Quantity:</strong> ${input.quantity}</p>
        <p style="margin:4px 0;"><strong>Unit Price:</strong> ${escapeHtml(formatCurrency(input.unitPrice))}</p>
        <p style="margin:4px 0;"><strong>Line Total:</strong> ${escapeHtml(formatCurrency(lineTotal))}</p>
        <p style="margin:4px 0;"><strong>Current Cart Total:</strong> ${escapeHtml(formatCurrency(input.cartTotal))}</p>
        <p style="margin:4px 0;"><strong>Added On:</strong> ${escapeHtml(formatDate(input.addedAt))}</p>
      </div>
    </div>
  `;

  return { subject, text, html };
};
