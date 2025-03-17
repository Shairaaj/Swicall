//backend/resend/resend_template.js
const welcomeEmailTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome Email</title>
  </head>
  <body style="font-family: sans-serif; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; margin: auto; padding: 20px;">
      <tr>
        <td style="text-align: center;">
          <img src="https://react-email-demo-gpxbuymeh-resend.vercel.app/static/koala-logo.png" alt="Logo" width="170" style="margin-bottom: 20px;" />
        </td>
      </tr>
      <tr>
        <td>
          <p style="font-size: 16px; line-height: 26px; margin: 16px 0;">Hi {name_user},</p>
          <p style="font-size: 16px; line-height: 26px; margin: 16px 0;">
            Welcome to Koala, the sales intelligence platform that helps you uncover qualified leads and close deals faster.
          </p>
          <p style="font-size: 16px; line-height: 26px; margin: 16px 0;">Best,<br />The Koala Team</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; line-height: 24px; color: #8898aa;">
            470 Noor Ave STE B #1148, South San Francisco, CA 94080
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

module.exports = { welcomeEmailTemplate };
