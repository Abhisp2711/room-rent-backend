import nodemailer from "nodemailer";

export const sendOTP = async (email, otp, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Abhishek Room Rent Management" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Verification - Abhishek Room Rent Management System",
    html: `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f9fc;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🏠 Abhishek Room Rent Management</h1>
                    <p style="margin: 5px 0 0 0; font-size: 16px;">Secure & Easy Rent Management</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px; color: #333;">
                    <h2 style="color: #333; margin-bottom: 20px;">Welcome to Abhishek Room Rent Management!</h2>
                    <p style="font-size: 16px; line-height: 1.5;">Dear <strong>${name}</strong>,</p>
                    
                    <p style="font-size: 16px; line-height: 1.5;">Thank you for choosing Abhishek Room Rent Management System. To 
                    complete your registration
                       and secure your account, please use the following One-Time Password (OTP):</p>
                    
                    <!-- OTP Display -->
                    <div style="background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Verification Code:</p>
                        <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 10px 0;">${otp}</div>
                        <p style="margin: 10px 0 0 0; color: #ff6b6b; font-size: 14px;">
                            ⏰ Valid for 10 minutes
                        </p>
                    </div>
                    
                    <!-- Security Info -->
                    <div style="background: #e7f3ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <strong style="color: #333;">🔒 Security Notice:</strong>
                        <ul style="margin: 10px 0; padding-left: 20px; color: #333;">
                            <li style="margin-bottom: 5px;">Never share this OTP with anyone</li>
                            <li style="margin-bottom: 5px;">Our team will never ask for your OTP</li>
                            <li>Delete this email after verification</li>
                        </ul>
                    </div>
                    
                    <!-- Features -->
                    <h3 style="color: #333; margin-bottom: 15px;">✨ What You Can Do:</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 25px 0;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 8px;">💰</div>
                            <div style="font-size: 14px; color: #333;">Easy Rent Payments</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
                            <div style="font-size: 14px; color: #333;">Payment History</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 8px;">🔔</div>
                            <div style="font-size: 14px; color: #333;">Rent Reminders</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 8px;">📱</div>
                            <div style="font-size: 14px; color: #333;">Mobile Friendly</div>
                        </div>
                    </div>
                    
                    <p style="font-size: 16px; line-height: 1.5;">If you didn't request this OTP, please ignore this email or contact our support team immediately.</p>
                    
                    <p style="font-size: 16px; line-height: 1.5;">
                        Best regards,<br>
                        <strong>Abhishek Room Rent Management Team</strong>
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p style="margin: 5px 0;">📍 Your Trusted Partner in Room Rent Management</p>
                    <p style="margin: 5px 0;">📞 Need help? Contact us: ${
                      process.env.SUPPORT_EMAIL || "support@abhishekrent.com"
                    }</p>
                    <p style="margin: 5px 0;">© ${new Date().getFullYear()} Abhishek Room Rent Management. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
  `,
  });

  return true;
};

// sendEmail function
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // 1. Create transporter using Gmail service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password if 2FA is enabled
      },
    });

    // 2. Send email
    const info = await transporter.sendMail({
      from: `"Room Rent System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html, // optional
    });

    console.log("Email sent: %s", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};
