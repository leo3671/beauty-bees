import nodemailer from 'nodemailer';

let transporter;

const STORE_DETAILS = {
  name: "Beauty Bees Cosmetics Nepal",
  address: "Kathmandu, Nepal",
  phone: "+977 9800000000",
  email: "support@beautybees.com.np",
  website: "https://beautybees.com.np"
};

const EMAIL_STYLE = `
  background-color: #fff5f7;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const CARD_STYLE = `
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid #fce7f3;
`;

async function getTransporter() {
  if (transporter) return transporter;

  // Use Environment Variables for Production
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Fallback to Ethereal for testing
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return transporter;
}

function getHeader(title, color = "#f2b6c1") {
  return `
    <div style="background-color: ${color}; padding: 30px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">BEAUTY BEES</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">${title}</p>
    </div>
  `;
}

function getFooter() {
  return `
    <div style="padding: 30px; background-color: #fcfcfc; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px;">
      <p style="margin: 0 0 10px 0;"><strong>${STORE_DETAILS.name}</strong></p>
      <p style="margin: 0;">${STORE_DETAILS.address} | ${STORE_DETAILS.phone}</p>
      <p style="margin: 5px 0 0 0;"><a href="${STORE_DETAILS.website}" style="color: #f2b6c1; text-decoration: none;">Visit our Website</a></p>
      <p style="margin: 20px 0 0 0; font-style: italic;">Thank you for being part of our hive! 🐝</p>
    </div>
  `;
}

export async function sendOrderConfirmation(order) {
  const t = await getTransporter();
  
  const html = `
    <div style="${EMAIL_STYLE}">
      <div style="${CARD_STYLE}">
        ${getHeader("Order Confirmed!")}
        <div style="padding: 30px; color: #334155; line-height: 1.6;">
          <p>Hi <strong>${order.customer}</strong>,</p>
          <p>Your order <strong>${order.id}</strong> has been successfully placed. We're getting your K-Beauty treats ready!</p>
          
          <div style="margin: 25px 0; padding: 20px; background-color: #fdf2f8; border-radius: 12px;">
            <h3 style="margin-top: 0; color: #be185d; font-size: 16px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${order.items.map(item => `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #fce7f3;">${item.name} x${item.quantity}</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #fce7f3; text-align: right;">Rs. ${item.price * item.quantity}</td>
                </tr>
              `).join('')}
              <tr>
                <td style="padding: 15px 0 0 0; font-weight: bold;">Grand Total</td>
                <td style="padding: 15px 0 0 0; font-weight: bold; text-align: right; font-size: 18px; color: #be185d;">Rs. ${order.total}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 14px;"><strong>Shipping to:</strong><br/>${order.location}</p>
        </div>
        ${getFooter()}
      </div>
    </div>
  `;

  const info = await t.sendMail({
    from: '"Beauty Bees Cosmetics" <orders@beautybees.com.np>',
    to: order.email,
    subject: `Order Confirmed: ${order.id} 🐝`,
    html: html,
  });

  console.log("Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

export async function sendOrderDelivered(order) {
  const t = await getTransporter();
  const html = `
    <div style="${EMAIL_STYLE}">
      <div style="${CARD_STYLE}">
        ${getHeader("Your order has arrived!", "#16a34a")}
        <div style="padding: 30px; color: #334155; line-height: 1.6; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">🎁</div>
          <h2>Delivered!</h2>
          <p>Hi <strong>${order.customer}</strong>, your order <strong>${order.id}</strong> has been delivered successfully.</p>
          <p>We hope you love your new skincare products! Don't forget to leave a review and share your glow.</p>
          <div style="margin-top: 30px;">
            <a href="${STORE_DETAILS.website}/account" style="background-color: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Review Your Items</a>
          </div>
        </div>
        ${getFooter()}
      </div>
    </div>
  `;

  await t.sendMail({
    from: '"Beauty Bees Cosmetics" <orders@beautybees.com.np>',
    to: order.email,
    subject: `Delivered: Your Beauty Bees Cosmetics Order ${order.id} 💖`,
    html: html,
  });
}

export async function sendOrderCancelled(order) {
  const t = await getTransporter();
  const html = `
    <div style="${EMAIL_STYLE}">
      <div style="${CARD_STYLE}">
        ${getHeader("Order Cancelled", "#ef4444")}
        <div style="padding: 30px; color: #334155; line-height: 1.6;">
          <p>Hi <strong>${order.customer}</strong>,</p>
          <p>Your order <strong>${order.id}</strong> has been cancelled.</p>
          <p>If this was a mistake or you have questions regarding a refund, please contact our support hive immediately.</p>
          <div style="margin: 25px 0; padding: 20px; background-color: #fef2f2; border-radius: 12px; border-left: 4px solid #ef4444;">
             <strong>Reason:</strong> Customer requested cancellation or payment issue.
          </div>
        </div>
        ${getFooter()}
      </div>
    </div>
  `;

  await t.sendMail({
    from: '"Beauty Bees Cosmetics" <security@beautybees.com.np>',
    to: order.email,
    subject: `Cancelled: Order ${order.id}`,
    html: html,
  });
}

export async function sendPaymentVerificationEmail(order) {
  const t = await getTransporter();
  const html = `
    <div style="${EMAIL_STYLE}">
      <div style="${CARD_STYLE}">
        ${getHeader("Payment Verified", "#3b82f6")}
        <div style="padding: 30px; color: #334155; line-height: 1.6;">
          <p>Hi <strong>${order.customer}</strong>,</p>
          <p>We have successfully verified your payment for order <strong>${order.id}</strong>.</p>
          <p>Your package is now moving to our shipping station. Bzzzz! 🐝</p>
        </div>
        ${getFooter()}
      </div>
    </div>
  `;

  await t.sendMail({
    from: '"Beauty Bees Cosmetics" <billing@beautybees.com.np>',
    to: order.email,
    subject: `Payment Verified: Order ${order.id}`,
    html: html,
  });
}

export async function sendCancellationRequest(order, reason) {
  const t = await getTransporter();
  const html = `
    <div style="${EMAIL_STYLE}">
      <div style="${CARD_STYLE}">
        ${getHeader("Cancellation Request Received", "#e11d48")}
        <div style="padding: 30px; color: #334155; line-height: 1.6;">
          <p>Hi <strong>${order.customer}</strong>,</p>
          <p>We have received your request to cancel order <strong>${order.id}</strong>.</p>
          <p>Our support team is reviewing your request and will process it shortly. No further action is required from your side.</p>
          <div style="margin: 25px 0; padding: 20px; background-color: #fff1f2; border-radius: 12px; border-left: 4px solid #e11d48;">
            <strong>Reason for Cancellation:</strong><br/>
            ${reason || 'No reason provided'}
          </div>
        </div>
        ${getFooter()}
      </div>
    </div>
  `;

  // Send email to customer
  await t.sendMail({
    from: '"Beauty Bees Cosmetics" <support@beautybees.com.np>',
    to: order.email,
    subject: `Cancellation Request: Order ${order.id} 🐝`,
    html: html,
  });

  // Also send email alert to admin
  const adminHtml = `
    <div style="${EMAIL_STYLE}">
      <div style="${CARD_STYLE}">
        ${getHeader("NEW Cancellation Request", "#e11d48")}
        <div style="padding: 30px; color: #334155; line-height: 1.6;">
          <p><strong>Admin Notice:</strong> A customer has requested cancellation of their order.</p>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer Name:</strong> ${order.customer}</p>
          <p><strong>Customer Email:</strong> ${order.email}</p>
          <p><strong>Order Total:</strong> Rs. ${order.total}</p>
          <p><strong>Reason:</strong> ${reason || 'No reason provided'}</p>
          <div style="margin-top: 20px;">
            <a href="${STORE_DETAILS.website}/admin/orders" style="background-color: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Go to Admin Panel</a>
          </div>
        </div>
        ${getFooter()}
      </div>
    </div>
  `;

  await t.sendMail({
    from: '"Beauty Bees Cosmetics" <system@beautybees.com.np>',
    to: STORE_DETAILS.email,
    subject: `ALERT: Cancellation Request for Order ${order.id}`,
    html: adminHtml,
  });
}
