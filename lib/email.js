import nodemailer from 'nodemailer';

let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  // For testing purposes, Ethereal creates fake email accounts
  // It gives you a URL to view the generated email instead of actually sending it
  let testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  return transporter;
}

export async function sendOrderConfirmation(order) {
  const t = await getTransporter();
  
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #3f6212; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Beauty Bees</h1>
        <p style="margin: 5px 0 0 0;">Thank you for your order!</p>
      </div>
      <div style="padding: 20px;">
        <p>Hi <strong>${order.customer}</strong>,</p>
        <p>We have received your order <strong>#${order.id}</strong>. We will notify you once your items are shipped.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: right;">Quantity</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
          ${order.items.map(item => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px;">${item.name}</td>
              <td style="padding: 10px; text-align: right;">${item.quantity}</td>
              <td style="padding: 10px; text-align: right;">Rs. ${item.price}</td>
            </tr>
          `).join('')}
        </table>
        
        <div style="margin-top: 20px; text-align: right; font-size: 1.2em;">
          <strong>Total: Rs. ${order.total}</strong>
        </div>
        
        <div style="margin-top: 30px; font-size: 0.9em; color: #64748b;">
          <p>Delivery Location: ${order.location}</p>
          <p>Payment Method: ${order.paymentMethod}</p>
        </div>
      </div>
    </div>
  `;

  const info = await t.sendMail({
    from: '"Beauty Bees" <orders@beautybees.com>',
    to: order.email,
    subject: `Order Confirmation #${order.id}`,
    html: htmlContent,
  });

  console.log("Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return nodemailer.getTestMessageUrl(info);
}

export async function sendPaymentVerificationEmail(order) {
  const t = await getTransporter();
  
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Payment Verified</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hi <strong>${order.customer}</strong>,</p>
        <p>Great news! We have successfully verified the payment for your order <strong>#${order.id}</strong>.</p>
        <p>Your order is now being processed for shipping. You can track your order status in your customer portal.</p>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="http://localhost:3000/account" style="background-color: #3f6212; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">View My Order</a>
        </div>
      </div>
    </div>
  `;

  const info = await t.sendMail({
    from: '"Beauty Bees" <orders@beautybees.com>',
    to: order.email,
    subject: `Payment Verified: Order #${order.id}`,
    html: htmlContent,
  });

  console.log("Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return nodemailer.getTestMessageUrl(info);
}
