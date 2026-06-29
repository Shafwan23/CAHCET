const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST.trim(),
  port: parseInt(process.env.SMTP_PORT.trim()),
  secure: process.env.SMTP_PORT.trim() === '465', 
  auth: {
    user: process.env.SMTP_USER.trim(),
    pass: process.env.SMTP_PASS.trim().replace(/\s+/g, ''),
  },
});

async function test() {
  try {
    console.log("Verifying connection...");
    await transporter.verify();
    console.log("Connection successful!");
    
    // We don't need to actually send an email to verify credentials are correct
    console.log("Credentials are valid.");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

test();
