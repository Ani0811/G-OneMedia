/* global process */

// Internal layout builder helper to deduplicate HTML/CSS structure
const buildEmailLayout = ({
  title,
  headerBg = '#0f172a',
  headerSubtitle,
  badgeHtml = '',
  contentHtml,
  actionHtml = '',
  footerContent,
  footerBg = '#f8fafc',
  footerBorderColor = '#e2e8f0',
  innerBorderColor = '#e2e8f0'
}) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${title}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid ${innerBorderColor}; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
            
            <!-- HEADER -->
            <tr>
              <td style="padding: 32px 40px; background: ${headerBg}; text-align: center;">
                <h1 style="margin:0; font-size:24px; font-weight:600; color:#ffffff; letter-spacing:-0.5px;">G-One Media</h1>
                ${headerSubtitle ? `<p style="margin:6px 0 0; font-size:14px; color:#94a3b8;">${headerSubtitle}</p>` : ''}
              </td>
            </tr>

            ${badgeHtml}

            <!-- CONTENT -->
            <tr>
              <td style="padding: 32px 40px;">
                ${contentHtml}
              </td>
            </tr>

            <!-- ACTION -->
            ${actionHtml ? `
            <tr>
              <td style="padding: 0 40px 40px;" align="center">
                ${actionHtml}
              </td>
            </tr>
            ` : ''}

            <!-- FOOTER -->
            <tr>
              <td style="background:${footerBg}; border-top:1px solid ${footerBorderColor}; padding:24px 40px; text-align: center;">
                ${footerContent}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

export const getContactEmailTemplate = ({ name, email, service, budget, content, isDiscoveryCall }) => {
  const title = `${isDiscoveryCall ? 'Discovery Call Request' : 'New Message'} — G-One Media`;
  const headerSubtitle = isDiscoveryCall ? '✦ New Discovery Booking Request' : '✦ New Contact Request';
  
  const contentHtml = `
    <!-- Contact Info -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
      <tr>
        <td style="padding-bottom: 8px;">
          <p style="margin:0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#64748b; font-weight:600;">Client Details</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="100" style="font-size:14px; color:#64748b; padding-bottom:12px;">Name:</td>
              <td style="font-size:14px; font-weight:600; color:#0f172a; padding-bottom:12px;">${name}</td>
            </tr>
            <tr>
              <td width="100" style="font-size:14px; color:#64748b; padding-bottom:${isDiscoveryCall ? '12px' : '0px'};">Email:</td>
              <td style="font-size:14px; font-weight:600; padding-bottom:${isDiscoveryCall ? '12px' : '0px'};">
                <a href="mailto:${email}" style="color:#2563eb; text-decoration:none;">${email}</a>
              </td>
            </tr>
            ${isDiscoveryCall ? `
            <tr>
              <td width="100" style="font-size:14px; color:#64748b; padding-bottom:12px;">Service:</td>
              <td style="font-size:14px; font-weight:600; color:#06b6d4; padding-bottom:12px;">${service}</td>
            </tr>
            <tr>
              <td width="100" style="font-size:14px; color:#64748b;">Budget Focus:</td>
              <td style="font-size:14px; font-weight:600; color:#0f172a;">${budget}</td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>

    <!-- Message -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-bottom: 8px;">
          <p style="margin:0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#64748b; font-weight:600;">
            ${isDiscoveryCall ? 'Project Description' : 'Message'}
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 24px; border: 1px solid #e2e8f0; border-left: 4px solid #0f172a; border-radius: 4px; background-color: #ffffff;">
          <p style="margin:0; font-size:15px; color:#334155; line-height:1.6; white-space:pre-wrap;">${content.replace(/\n/g, '<br/>')}</p>
        </td>
      </tr>
    </table>
  `;

  const actionHtml = `
    <a href="mailto:${email}?subject=Re: Your inquiry with G-One Media" style="display:inline-block; background-color:#2563eb; color:#ffffff; font-weight:500; font-size:14px; text-decoration:none; padding:12px 32px; border-radius:6px;">
      Reply to ${name}
    </a>
  `;

  const footerContent = `
    <p style="margin:0; font-size:13px; color:#64748b;">This email was sent from the G-One Media website.</p>
  `;

  return buildEmailLayout({ title, headerSubtitle, contentHtml, actionHtml, footerContent });
};

export const getPaymentSuccessTemplate = ({ userAmount, razorpay_payment_id }) => {
  const title = 'Payment Receipt — G-One Media';
  const headerSubtitle = '✦ Payment Successful';

  const contentHtml = `
    <h2 style="margin:0 0 20px; font-size:20px; color:#0f172a;">Thank you for your payment!</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #f1f5f9; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
      <tr>
        <td width="120" style="font-size:14px; color:#64748b; padding-bottom:12px;">Amount Paid:</td>
        <td style="font-size:14px; font-weight:600; color:#06b6d4; padding-bottom:12px;">INR ${userAmount}</td>
      </tr>
      <tr>
        <td width="120" style="font-size:14px; color:#64748b;">Payment ID:</td>
        <td style="font-size:14px; font-weight:600; color:#0f172a;">${razorpay_payment_id}</td>
      </tr>
    </table>
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6; margin-bottom:20px;">
      Please keep this Payment ID for your records. If you are dissatisfied with our service, you can use this ID to request an instant refund on our website within the guarantee period.
    </p>
  `;

  const actionHtml = `
    <a href="${process.env.FRONTEND_ORIGIN || 'https://g-onemedia.com'}/refund?payment_id=${razorpay_payment_id}" 
       style="display:inline-block; background-color:#d946ef; color:#ffffff; font-weight:600; font-size:14px; text-decoration:none; padding:12px 24px; border-radius:6px;">
      Request a Refund
    </a>
  `;

  const footerContent = `
    <p style="margin:0; font-size:13px; color:#64748b;">Best regards,<br/>G-One Media Team</p>
  `;

  return buildEmailLayout({ title, headerSubtitle, contentHtml, actionHtml, footerContent });
};

export const getRefundInitiatedTemplate = ({ amount, payment_id }) => {
  const title = 'Refund Initiated — G-One Media';
  const headerSubtitle = '✦ Refund Processed';

  const contentHtml = `
    <h2 style="margin:0 0 20px; font-size:20px; color:#0f172a;">Your refund has been initiated</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #f1f5f9; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
      <tr>
        <td width="140" style="font-size:14px; color:#64748b; padding-bottom:12px;">Refund Amount:</td>
        <td style="font-size:14px; font-weight:600; color:#06b6d4; padding-bottom:12px;">INR ${amount}</td>
      </tr>
      <tr>
        <td width="140" style="font-size:14px; color:#64748b;">Original Payment ID:</td>
        <td style="font-size:14px; font-weight:600; color:#0f172a;">${payment_id}</td>
      </tr>
    </table>
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6; margin-bottom:16px;">
      We have successfully initiated an instant refund for your payment. The amount should reflect in your source account within 1-2 business days, depending on your bank.
    </p>
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6;">
      We are sorry to see you go. If there's anything we could have done better, please reply to this email and let us know!
    </p>
  `;

  const footerContent = `
    <p style="margin:0; font-size:13px; color:#64748b;">Best regards,<br/>G-One Media Team</p>
  `;

  return buildEmailLayout({ title, headerSubtitle, contentHtml, footerContent });
};

export const getRefundSuccessTemplate = ({ amount, payment_id, refund_id }) => {
  const title = 'Refund Successful — G-One Media';
  const headerSubtitle = '✦ Refund Successful';

  const contentHtml = `
    <h2 style="margin:0 0 20px; font-size:20px; color:#0f172a;">Your refund is complete</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #f1f5f9; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
      <tr>
        <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Refunded Amount:</td>
        <td style="font-size:14px; font-weight:600; color:#06b6d4; padding-bottom:12px;">INR ${amount}</td>
      </tr>
      <tr>
        <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Original Payment ID:</td>
        <td style="font-size:14px; font-weight:600; color:#0f172a;">${payment_id}</td>
      </tr>
      <tr>
        <td width="150" style="font-size:14px; color:#64748b;">Refund Reference ID:</td>
        <td style="font-size:14px; font-weight:600; color:#0f172a;">${refund_id}</td>
      </tr>
    </table>
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6; margin-bottom:16px;">
      We are pleased to inform you that your refund has been successfully processed and completed by our system.
    </p>
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6; margin-bottom:16px;">
      Depending on your bank, it may take a short time for the transaction to reflect on your card or bank statement.
    </p>
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6;">
      If you have any further questions or if we can assist you with other services in the future, please do not hesitate to contact us.
    </p>
  `;

  const footerContent = `
    <p style="margin:0; font-size:13px; color:#64748b;">Best regards,<br/>G-One Media Team</p>
  `;

  return buildEmailLayout({ title, headerSubtitle, contentHtml, footerContent });
};

export const getChatBookingTemplate = ({ name, email, service, budget, details, type = 'enquiry' }) => {
  const title = `${type === 'booking' ? 'New Booking' : 'New Enquiry'} via AI Chat — G-One Media`;
  const headerBg = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)';
  const headerSubtitle = `${type === 'booking' ? '🗓️ New Booking Request' : '💬 New Enquiry'} — via AI Chat`;
  
  const badgeHtml = `
    <!-- AI CHAT BADGE -->
    <tr>
      <td style="padding: 16px 40px 0; text-align:center;">
        <span style="display:inline-block; background:#f0fdf4; border:1px solid #86efac; color:#16a34a; font-size:12px; font-weight:700; padding:6px 16px; border-radius:99px; letter-spacing:0.05em;">📩 CAPTURED VIA AI CHAT AGENT</span>
      </td>
    </tr>
  `;

  const contentHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
      <tr><td style="padding-bottom:8px;"><p style="margin:0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#64748b; font-weight:600;">Client Details</p></td></tr>
      <tr>
        <td style="background-color:#f1f5f9; padding:20px; border-radius:6px; border:1px solid #e2e8f0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="100" style="font-size:14px; color:#64748b; padding-bottom:10px;">Name:</td>
              <td style="font-size:14px; font-weight:600; color:#0f172a; padding-bottom:10px;">${name}</td>
            </tr>
            <tr>
              <td width="100" style="font-size:14px; color:#64748b; padding-bottom:${service ? '10px' : '0'};">Email:</td>
              <td style="font-size:14px; font-weight:600; padding-bottom:${service ? '10px' : '0'};"><a href="mailto:${email}" style="color:#2563eb; text-decoration:none;">${email}</a></td>
            </tr>
            ${service ? `<tr><td width="100" style="font-size:14px; color:#64748b; padding-bottom:${budget ? '10px' : '0'};">Service:</td><td style="font-size:14px; font-weight:600; color:#06b6d4; padding-bottom:${budget ? '10px' : '0'};">${service}</td></tr>` : ''}
            ${budget ? `<tr><td width="100" style="font-size:14px; color:#64748b;">Budget:</td><td style="font-size:14px; font-weight:600; color:#0f172a;">${budget}</td></tr>` : ''}
          </table>
        </td>
      </tr>
    </table>
    ${details ? `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding-bottom:8px;"><p style="margin:0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#64748b; font-weight:600;">${type === 'booking' ? 'Project Details' : 'Message'}</p></td></tr>
      <tr><td style="padding:20px; border:1px solid #e2e8f0; border-left:4px solid #6366f1; border-radius:4px; background:#ffffff;"><p style="margin:0; font-size:15px; color:#334155; line-height:1.6; white-space:pre-wrap;">${details.replace(/\n/g, '<br/>')}</p></td></tr>
    </table>` : ''}
  `;

  const actionHtml = `
    <a href="mailto:${email}?subject=Re: Your ${type === 'booking' ? 'booking' : 'enquiry'} with G-One Media" style="display:inline-block; background:#2563eb; color:#ffffff; font-weight:500; font-size:14px; text-decoration:none; padding:12px 32px; border-radius:6px;">Reply to ${name}</a>
  `;

  const footerContent = `
    <p style="margin:0; font-size:12px; color:#94a3b8;">This lead was captured automatically by the G-ONE AI Chat Agent.</p>
  `;

  return buildEmailLayout({ title, headerBg, headerSubtitle, badgeHtml, contentHtml, actionHtml, footerContent });
};

export const getChatRefundRequestTemplate = ({ name, email, payment_id, reason }) => {
  const title = 'Refund Request (Manual Review) — G-One Media';
  const headerBg = 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)';
  const headerSubtitle = '⚠️ Refund Request — Manual Review Required';
  const innerBorderColor = '#fecaca';
  const footerBg = '#fef2f2';
  const footerBorderColor = '#fecaca';

  const badgeHtml = `
    <!-- WARNING BADGE -->
    <tr>
      <td style="padding: 20px 40px 0; text-align:center;">
        <span style="display:inline-block; background:#fff7ed; border:1px solid #fdba74; color:#c2410c; font-size:12px; font-weight:700; padding:8px 20px; border-radius:6px; letter-spacing:0.05em;">🔒 DO NOT PROCESS AUTOMATICALLY — VERIFY BEFORE ACTIONING</span>
      </td>
    </tr>
  `;

  const contentHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px; background:#fef2f2; padding:20px; border-radius:6px; border:1px solid #fecaca;">
      <tr>
        <td width="140" style="font-size:14px; color:#64748b; padding-bottom:12px;">Client Name:</td>
        <td style="font-size:14px; font-weight:600; color:#0f172a; padding-bottom:12px;">${name || 'Not provided'}</td>
      </tr>
      <tr>
        <td width="140" style="font-size:14px; color:#64748b; padding-bottom:12px;">Client Email:</td>
        <td style="font-size:14px; font-weight:600; padding-bottom:12px;"><a href="mailto:${email}" style="color:#2563eb; text-decoration:none;">${email}</a></td>
      </tr>
      <tr>
        <td width="140" style="font-size:14px; color:#64748b; padding-bottom:${reason ? '12px' : '0'};">Payment ID:</td>
        <td style="font-size:14px; font-weight:700; color:#dc2626; padding-bottom:${reason ? '12px' : '0'}; font-family:monospace;">${payment_id}</td>
      </tr>
      ${reason ? `<tr><td width="140" style="font-size:14px; color:#64748b;">Reason:</td><td style="font-size:14px; color:#0f172a; line-height:1.5;">${reason}</td></tr>` : ''}
    </table>
    <p style="margin:0 0 12px; font-size:15px; color:#334155; line-height:1.6;">Please log into the <strong>Razorpay Dashboard</strong> to verify this payment ID and process the refund if approved.</p>
    <p style="margin:0; font-size:13px; color:#64748b; line-height:1.6;">Once actioned, update the status in your Supabase <code>chat_refund_requests</code> table to <strong>'approved'</strong> or <strong>'rejected'</strong>.</p>
  `;

  const actionHtml = `
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:12px;">
        <a href="https://dashboard.razorpay.com/app/payments/${payment_id}" target="_blank" style="display:inline-block; background:#2563eb; color:#ffffff; font-weight:600; font-size:14px; text-decoration:none; padding:12px 24px; border-radius:6px;">View in Razorpay →</a>
      </td>
      <td>
        <a href="mailto:${email}?subject=Your Refund Request — G-One Media" style="display:inline-block; background:#f1f5f9; color:#0f172a; font-weight:600; font-size:14px; text-decoration:none; padding:12px 24px; border-radius:6px; border:1px solid #e2e8f0;">Email Client</a>
      </td>
    </tr></table>
  `;

  const footerContent = `
    <p style="margin:0; font-size:12px; color:#94a3b8;">This refund request was submitted via the G-ONE AI Chat Agent and requires manual review.</p>
  `;

  return buildEmailLayout({
    title,
    headerBg,
    headerSubtitle,
    badgeHtml,
    contentHtml,
    actionHtml,
    footerContent,
    innerBorderColor,
    footerBg,
    footerBorderColor
  });
};

export const getDiscoveryEmailTemplate = ({ name, email, company, website, service, budget, details, referral }) => {
  const title = `Discovery Call Booking — G-One Media`;
  const headerSubtitle = `✦ New Discovery Call Booking`;

  const contentHtml = `
    <!-- Client Details -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
      <tr>
        <td style="padding-bottom: 8px;">
          <p style="margin:0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#64748b; font-weight:600;">Client & Brand Profile</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Name:</td>
              <td style="font-size:14px; font-weight:600; color:#0f172a; padding-bottom:12px;">${name}</td>
            </tr>
            <tr>
              <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Email:</td>
              <td style="font-size:14px; font-weight:600; padding-bottom:12px;">
                <a href="mailto:${email}" style="color:#2563eb; text-decoration:none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Company / Brand:</td>
              <td style="font-size:14px; font-weight:600; color:#0f172a; padding-bottom:12px;">${company || 'N/A'}</td>
            </tr>
            <tr>
              <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Website / Links:</td>
              <td style="font-size:14px; font-weight:600; padding-bottom:12px;">
                ${website ? `<a href="${website.startsWith('http') ? website : 'http://' + website}" target="_blank" style="color:#2563eb; text-decoration:none;">${website}</a>` : 'N/A'}
              </td>
            </tr>
            <tr>
              <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Service Focus:</td>
              <td style="font-size:14px; font-weight:600; color:#06b6d4; padding-bottom:12px;">${service}</td>
            </tr>
            <tr>
              <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Budget Focus:</td>
              <td style="font-size:14px; font-weight:600; color:#0f172a; padding-bottom:12px;">${budget}</td>
            </tr>
            <tr>
              <td width="150" style="font-size:14px; color:#64748b;">How they found us:</td>
              <td style="font-size:14px; font-weight:600; color:#0f172a;">${referral || 'N/A'}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Project Goals -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-bottom: 8px;">
          <p style="margin:0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#64748b; font-weight:600;">
            Project Description & Goals
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 24px; border: 1px solid #e2e8f0; border-left: 4px solid #0f172a; border-radius: 4px; background-color: #ffffff;">
          <p style="margin:0; font-size:15px; color:#334155; line-height:1.6; white-space:pre-wrap;">${(details || 'No additional details provided.').replace(/\n/g, '<br/>')}</p>
        </td>
      </tr>
    </table>
  `;

  const actionHtml = `
    <a href="mailto:${email}?subject=Re: G-One Media Discovery Call Booking" style="display:inline-block; background-color:#2563eb; color:#ffffff; font-weight:500; font-size:14px; text-decoration:none; padding:12px 32px; border-radius:6px;">
      Reply to ${name}
    </a>
  `;

  const footerContent = `
    <p style="margin:0; font-size:13px; color:#64748b;">This email was sent from the G-One Media Discovery Booking Page.</p>
  `;

  return buildEmailLayout({ title, headerSubtitle, contentHtml, actionHtml, footerContent });
};

export const getClientConfirmationEmailTemplate = ({ name, service, budget, content }) => {
  const title = `We've received your inquiry — G-One Media`;
  const headerSubtitle = `✦ Project Inquiry Confirmation`;
  
  const contentHtml = `
    <h2 style="margin:0 0 20px; font-size:20px; color:#0f172a;">Hi ${name},</h2>
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6; margin-bottom:20px;">
      Thank you for reaching out to G-One Media! We have received your project details and estimate request. Our team is already reviewing your requirements.
    </p>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #f1f5f9; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
      ${service ? `
      <tr>
        <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Service Focus:</td>
        <td style="font-size:14px; font-weight:600; color:#06b6d4; padding-bottom:12px;">${service}</td>
      </tr>
      ` : ''}
      ${budget ? `
      <tr>
        <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Budget Estimate:</td>
        <td style="font-size:14px; font-weight:600; color:#0f172a; padding-bottom:12px;">${budget}</td>
      </tr>
      ` : ''}
      <tr>
        <td width="150" style="font-size:14px; color:#64748b; vertical-align: top;">Your Message:</td>
        <td style="font-size:14px; color:#334155; white-space:pre-wrap; line-height:1.5;">${content}</td>
      </tr>
    </table>
    
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6; margin-bottom:12px;">
      We will get back to you with a detailed proposal and timeline within 24 hours.
    </p>
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6;">
      In the meantime, feel free to reply directly to this email if you have any additional notes to add.
    </p>
  `;

  const footerContent = `
    <p style="margin:0; font-size:13px; color:#64748b;">Best regards,<br/>G-One Media Team</p>
  `;

  return buildEmailLayout({ title, headerSubtitle, contentHtml, footerContent });
};

export const getClientDiscoveryEmailTemplate = ({ name, service, budget, details }) => {
  const title = `Discovery Call Request Received — G-One Media`;
  const headerSubtitle = `✦ Discovery Call Confirmation`;
  
  const contentHtml = `
    <h2 style="margin:0 0 20px; font-size:20px; color:#0f172a;">Hi ${name},</h2>
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6; margin-bottom:20px;">
      Thank you for booking a discovery call request with G-One Media! We have received your booking details and will reach out shortly to confirm a slot.
    </p>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #f1f5f9; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
      <tr>
        <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Service Focus:</td>
        <td style="font-size:14px; font-weight:600; color:#06b6d4; padding-bottom:12px;">${service}</td>
      </tr>
      ${budget ? `
      <tr>
        <td width="150" style="font-size:14px; color:#64748b; padding-bottom:12px;">Budget Range:</td>
        <td style="font-size:14px; font-weight:600; color:#0f172a; padding-bottom:12px;">${budget}</td>
      </tr>
      ` : ''}
      ${details ? `
      <tr>
        <td width="150" style="font-size:14px; color:#64748b; vertical-align: top;">Project Goals:</td>
        <td style="font-size:14px; color:#334155; white-space:pre-wrap; line-height:1.5;">${details}</td>
      </tr>
      ` : ''}
    </table>
    
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6; margin-bottom:12px;">
      One of our founders will review your brand profile and send over a calendar invite link to finalize the call slot.
    </p>
    <p style="margin:0; font-size:15px; color:#334155; line-height:1.6;">
      We look forward to speaking with you!
    </p>
  `;

  const footerContent = `
    <p style="margin:0; font-size:13px; color:#64748b;">Best regards,<br/>G-One Media Team</p>
  `;

  return buildEmailLayout({ title, headerSubtitle, contentHtml, footerContent });
};


