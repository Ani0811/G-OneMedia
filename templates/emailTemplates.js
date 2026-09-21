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

export const getAdminPasswordResetEmailTemplate = ({
  email = '{{ .Email }}',
  confirmationUrl = '{{ .ConfirmationURL }}',
  expirationMinutes = 60
} = {}) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Reset Your Admin Password — G-One Media</title>
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <style>
    table, td, p, a, span { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    :root { color-scheme: dark; supported-color-schemes: dark; }
    body {
      margin: 0 !important;
      padding: 0 !important;
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
      background-color: #050608 !important;
    }
    table, td {
      border-collapse: collapse !important;
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }
    img {
      border: 0 !important;
      height: auto !important;
      line-height: 100% !important;
      outline: none !important;
      text-decoration: none !important;
    }
    a {
      color: #38bdf8;
      text-decoration: none;
    }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .content-padding { padding: 28px 20px !important; }
      .header-padding { padding: 28px 20px 20px !important; }
      .footer-padding { padding: 24px 20px !important; }
      .action-button { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .meta-label, .meta-value { display: block !important; width: 100% !important; text-align: left !important; }
      .meta-value { margin-top: 4px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050608; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <!-- HIDDEN PREHEADER TEXT -->
  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
    Reset your G-One Media administrator password. This secure link expires in ${expirationMinutes} minutes.
    &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050608; width: 100%; min-width: 100%; margin: 0; padding: 40px 12px 60px;">
    <tr>
      <td align="center" valign="top">

        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="580">
        <tr>
        <td align="center" valign="top" width="580">
        <![endif]-->
        <table class="email-container" width="580" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; width: 100%; background: #0b0f19; border-radius: 18px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          
          <!-- TOP RADIANT ACCENT GRADIENT -->
          <tr>
            <td style="height: 3px; background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 35%, #8b5cf6 70%, #d946ef 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- HEADER SECTION -->
          <tr>
            <td class="header-padding" style="padding: 36px 40px 24px; text-align: center; background: #070a13; border-bottom: 1px solid #131d31;">
              <!-- Brand Logo & Identity -->
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="padding-bottom: 14px;">
                    <a href="https://g-one-media.vercel.app" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img 
                        src="https://g-one-media.vercel.app/G-One.png" 
                        alt="G-One Media" 
                        width="170" 
                        height="48"
                        border="0" 
                        style="display: block; width: 170px; height: auto; max-height: 48px; object-fit: contain; outline: none; border: none; margin: 0 auto; text-decoration: none;"
                      />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <!-- Security Pill Badge -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.28); border-radius: 9999px; padding: 4px 14px;">
                          <span style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px;">
                            ✦ Admin Security Protocol
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN CONTENT BODY -->
          <tr>
            <td class="content-padding" style="padding: 36px 40px 32px;">
              <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 800; color: #f8fafc; letter-spacing: -0.4px; line-height: 1.3;">
                Reset Your Administrator Password
              </h1>
              <p style="margin: 0 0 24px; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                A password reset was requested for your administrator access on the <strong style="color: #f1f5f9;">G-One Media Admin Portal</strong>. If you made this request, please click the secure authorization button below to set a new password.
              </p>

              <!-- RECIPIENT & CONTEXT DETAILS CARD -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px; background: #070d19; border-radius: 12px; border: 1px solid #1e293b;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td class="meta-label" style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; padding-bottom: 8px;">
                          Account Email:
                        </td>
                        <td class="meta-value" align="right" style="font-size: 13px; font-weight: 700; color: #38bdf8; padding-bottom: 8px; font-family: monospace;">
                          ${email}
                        </td>
                      </tr>
                      <tr>
                        <td class="meta-label" style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; padding-bottom: 8px;">
                          Access Scope:
                        </td>
                        <td class="meta-value" align="right" style="font-size: 13px; font-weight: 600; color: #cbd5e1; padding-bottom: 8px;">
                          Administrative Portal
                        </td>
                      </tr>
                      <tr>
                        <td class="meta-label" style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;">
                          Link Validity:
                        </td>
                        <td class="meta-value" align="right" style="font-size: 13px; font-weight: 700; color: #34d399;">
                          ${expirationMinutes} Minutes (Single Use)
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- BULLETPROOF CALL TO ACTION BUTTON -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${confirmationUrl}" style="height:50px;v-text-anchor:middle;width:280px;" arcsize="18%" stroke="f" fillcolor="#06b6d4">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">
                        Reset Password &rarr;
                      </center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a class="action-button" href="${confirmationUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #2563eb 50%, #8b5cf6 100%); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 16px 38px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 24px -4px rgba(6, 182, 212, 0.4); text-align: center;">
                      Reset Admin Password &rarr;
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <!-- SECURITY WARNING CARD -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 26px; background: rgba(245, 158, 11, 0.04); border: 1px solid rgba(245, 158, 11, 0.22); border-radius: 12px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.8px;">
                      🔒 Security Advisory
                    </p>
                    <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #94a3b8; line-height: 1.55;">
                      <li style="margin-bottom: 4px;">This recovery link is valid for <strong style="color: #e2e8f0;">${expirationMinutes} minutes</strong> and can only be used once.</li>
                      <li style="margin-bottom: 4px;">If you didn't initiate this request, safely ignore this email—your account credentials remain unchanged.</li>
                      <li>Never share this URL with anyone. G-One Media staff will never request your reset link.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- DIRECT URL FALLBACK -->
              <p style="margin: 0 0 8px; font-size: 12px; color: #64748b; line-height: 1.5;">
                If the button above is not clickable, copy and paste this direct recovery link into your web browser:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #040711; border: 1px solid #1e293b; border-radius: 8px;">
                <tr>
                  <td style="padding: 12px 14px; word-break: break-all;">
                    <a href="${confirmationUrl}" target="_blank" style="font-size: 11px; color: #38bdf8; text-decoration: none; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1.4;">
                      ${confirmationUrl}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer-padding" style="background: #050813; border-top: 1px solid #131d31; padding: 28px 40px; text-align: center;">
              <!-- Mini Brand Logo in Footer -->
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 12px;">
                <tr>
                  <td align="center">
                    <a href="https://g-one-media.vercel.app" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img 
                        src="https://g-one-media.vercel.app/G-One.png" 
                        alt="G-One Media" 
                        width="110" 
                        height="32"
                        border="0" 
                        style="display: block; width: 110px; height: auto; opacity: 0.75; outline: none; border: none; margin: 0 auto; text-decoration: none;"
                      />
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #f8fafc; letter-spacing: 0.3px;">
                G-One Media Agency
              </p>
              <p style="margin: 0 0 10px; font-size: 12px; color: #64748b; line-height: 1.5;">
                High-Performance Digital Platforms &bull; Cinematic Visual Production
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.5;">
                &copy; 2026 G-One Media. All rights reserved. &bull; Automated Security Transmission
              </p>
            </td>
          </tr>

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->

      </td>
    </tr>
  </table>

</body>
</html>`;
};



