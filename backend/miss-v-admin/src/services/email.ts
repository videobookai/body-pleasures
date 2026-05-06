import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'Ms V <info@videobook.ai>';

const CHECKOUT_NOTIFY = 'vernettanbr1@att.net';
const CHECKOUT_BCC = 'info@metagig.app';

export async function sendWelcomeEmail(username: string, email: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#fdf6f0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6f0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#8b4513 0%,#c8703a 100%);padding:48px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:32px;letter-spacing:2px;font-weight:normal;">Body Pleasures</h1>
              <p style="margin:8px 0 0;color:#f5deb3;font-size:14px;letter-spacing:1px;">Artisan Soaps &amp; Body Care</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;">
              <h2 style="margin:0 0 16px;color:#5c2e0a;font-size:24px;font-weight:normal;">Welcome, ${username}!</h2>
              <p style="margin:0 0 20px;color:#555;font-size:16px;line-height:1.7;">
                Thank you for joining the Body Pleasures family. We handcraft every bar, balm, and blend with the finest natural ingredients — because your skin deserves nothing less.
              </p>
              <p style="margin:0 0 32px;color:#555;font-size:16px;line-height:1.7;">
                Explore our collections of artisan soaps, luxurious body butters, and wellness essentials, all made with love and care.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="background:#8b4513;border-radius:6px;text-align:center;">
                    <a href="https://body-pleasures.vercel.app" style="display:inline-block;padding:14px 36px;color:#ffffff;text-decoration:none;font-size:15px;letter-spacing:1px;">Shop Now</a>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #f0e0d0;margin:32px 0;" />

              <p style="margin:0;color:#888;font-size:13px;line-height:1.6;text-align:center;">
                Questions? Reply to this email or contact us at <a href="mailto:vernettanbr1@att.net" style="color:#8b4513;">vernettanbr1@att.net</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fdf0e6;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#aaa;font-size:12px;">© ${new Date().getFullYear()} Body Pleasures. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Welcome to Ms V's Body Pleasures, ${username}!`,
    html,
  });
}

interface OrderItem {
  quantity: number;
  price: number;
  docId?: string;
  product?: { name?: string; title?: string };
}

interface OrderData {
  username: string;
  email: string;
  address?: string;
  zip?: string;
  phone?: string;
  totalAmount: number;
  paymentId?: string;
  order?: OrderItem[];
}

export async function sendCheckoutEmail(orderData: OrderData) {
  const { username, email, address, zip, phone, totalAmount, paymentId, order = [] } = orderData;

  const itemsHtml = order
    .map((item) => {
      const name = item.product?.name || item.product?.title || `Product (${item.docId || 'N/A'})`;
      return `
        <tr>
          <td style="padding:10px 0;color:#444;font-size:14px;border-bottom:1px solid #f0e0d0;">${name}</td>
          <td style="padding:10px 0;color:#444;font-size:14px;border-bottom:1px solid #f0e0d0;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 0;color:#444;font-size:14px;border-bottom:1px solid #f0e0d0;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#fdf6f0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6f0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#8b4513 0%,#c8703a 100%);padding:48px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:32px;letter-spacing:2px;font-weight:normal;">Body Pleasures</h1>
              <p style="margin:8px 0 0;color:#f5deb3;font-size:14px;letter-spacing:1px;">Order Confirmation</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;">
              <h2 style="margin:0 0 8px;color:#5c2e0a;font-size:22px;font-weight:normal;">Thank you, ${username}!</h2>
              <p style="margin:0 0 32px;color:#555;font-size:15px;line-height:1.7;">
                Your order has been received and is being prepared with care. Here's a summary:
              </p>

              <!-- Order Items -->
              ${order.length > 0 ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <thead>
                  <tr>
                    <th style="padding:8px 0;color:#8b4513;font-size:13px;text-align:left;border-bottom:2px solid #c8703a;">Item</th>
                    <th style="padding:8px 0;color:#8b4513;font-size:13px;text-align:center;border-bottom:2px solid #c8703a;">Qty</th>
                    <th style="padding:8px 0;color:#8b4513;font-size:13px;text-align:right;border-bottom:2px solid #c8703a;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              ` : ''}

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:14px 0;color:#5c2e0a;font-size:17px;font-weight:bold;">Total</td>
                  <td style="padding:14px 0;color:#5c2e0a;font-size:17px;font-weight:bold;text-align:right;">$${Number(totalAmount).toFixed(2)}</td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #f0e0d0;margin:0 0 28px;" />

              <!-- Shipping & Payment Details -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" valign="top" style="padding-right:20px;">
                    <h3 style="margin:0 0 10px;color:#8b4513;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Shipping To</h3>
                    <p style="margin:0;color:#555;font-size:14px;line-height:1.7;">
                      ${username}<br/>
                      ${address || ''}${zip ? `, ${zip}` : ''}<br/>
                      ${phone ? `Phone: ${phone}` : ''}
                    </p>
                  </td>
                  <td width="50%" valign="top">
                    <h3 style="margin:0 0 10px;color:#8b4513;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Payment</h3>
                    <p style="margin:0;color:#555;font-size:14px;line-height:1.7;">
                      Method: PayPal<br/>
                      Status: Confirmed<br/>
                      ${paymentId ? `ID: ${paymentId}` : ''}
                    </p>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #f0e0d0;margin:32px 0;" />

              <p style="margin:0;color:#888;font-size:13px;line-height:1.6;text-align:center;">
                Questions about your order? Contact us at <a href="mailto:vernettanbr1@att.net" style="color:#8b4513;">vernettanbr1@att.net</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fdf0e6;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#aaa;font-size:12px;">© ${new Date().getFullYear()} Body Pleasures. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  await resend.emails.send({
    from: FROM,
    to: [email, CHECKOUT_NOTIFY],
    bcc: CHECKOUT_BCC,
    subject: `Order Confirmed - Body Pleasures`,
    html,
  });
}
