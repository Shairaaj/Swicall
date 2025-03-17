const { resend } = require("./config");
const { welcomeEmailTemplate } = require("./resend_template");

const sendWelcomeEmail = async (email, name) => {
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to our company",
      html: welcomeEmailTemplate.replace("{name_user}", name),
    });
    return data;
  } catch (err) {
    console.error("Error sending welcome email:", err);
    throw err;
  }
};

module.exports = { sendWelcomeEmail };
