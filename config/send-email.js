const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOtpEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Ashirwad Gems & Stones" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify Your Email - Ashirwad Rudraksh & Gems',
      html: `
      <div style="max-width:600px;margin:auto;font-family:Arial;border:1px solid #eee">
        
        <div style="background:rgb(252, 111, 0);color:#fff;padding:20px;text-align:center">
          <h1>Ashirwad Rudraksh & Gems</h1>
        </div>

        <div style="padding:20px">
          <h2>Hello 👋</h2>
          <p>Thank you for registering with <b>Ashirwad Rudraksh & Gems</b>.</p>

          <p>Please use the OTP below to verify your email address:</p>

          <div style="
            text-align:center;
            font-size:28px;
            letter-spacing:6px;
            font-weight:bold;
            margin:20px 0;
            color:#0d6efd;">
            ${otp}
          </div>

          <p>This OTP is valid for <b>10 minutes</b>.</p>

          <p>If you did not request this, please ignore this email.</p>

          <br />
          <p>Regards,<br/>
          <b>Ashirwad Gems & Stones Team</b></p>
        </div>

        <div style="background:#f5f5f5;padding:10px;text-align:center;font-size:12px;color:#666">
          © ${new Date().getFullYear()} Ashirwad Gems & Stones. All rights reserved.
        </div>

      </div>
      `
    });
  } catch (error) {
    console.error('Email Error:', error);
    throw new Error('Unable to send email');
  }
};
