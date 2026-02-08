const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendOrderConfirmationEmail = async (email, booking) => {
    const { _id, workspace, date, startTime, duration, totalPrice, transactionId } = booking;

    const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #4F46E5;
                color: #ffffff;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .content {
                padding: 30px;
                color: #333333;
            }
            .booking-details {
                background-color: #f9fafb;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e5e7eb;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .label {
                font-weight: 600;
                color: #6b7280;
                font-size: 14px;
                text-transform: uppercase;
            }
            .value {
                font-weight: 700;
                color: #111827;
            }
            .total-row {
                background-color: #ecfdf5;
                color: #065f46;
                padding: 15px;
                border-radius: 8px;
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                font-weight: 800;
                font-size: 18px;
            }
            .footer {
                background-color: #f3f4f6;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
            }
            .btn {
                display: inline-block;
                background-color: #4F46E5;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: bold;
                margin-top: 20px;
            }
        </style>
    </head>
    <body style="background-color: #f3f4f6; padding: 40px 0;">
        <div class="container">
            <div class="header">
                <h1>Booking Confirmed!</h1>
                <p style="margin-top: 5px; opacity: 0.9;">Get ready for productivity</p>
            </div>
            <div class="content">
                <p>Hi there,</p>
                <p>Thank you for choosing <strong>CoWorkSpace</strong>. Your booking has been successfully confirmed. Here are your details:</p>
                
                <div class="booking-details">
                    <div class="detail-row">
                        <span class="label">Booking ID</span>
                        <span class="value">#${_id.toString().substring(_id.toString().length - 6).toUpperCase()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Workspace</span>
                        <span class="value">${workspace.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Date</span>
                        <span class="value">${new Date(date).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Time</span>
                        <span class="value">${startTime} (${duration} hrs)</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Transaction ID</span>
                        <span class="value">${transactionId}</span>
                    </div>
                    
                    <div class="total-row">
                        <span>Paid Total</span>
                        <span>₹${totalPrice}</span>
                    </div>
                </div>

                <div style="text-align: center;">
                    <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
                        Please scan the QR code in your dashboard upon arrival.
                    </p>
                    <a href="http://localhost:3000/dashboard/user" class="btn">View My Dashboard</a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} CoWorkSpace Inc. All rights reserved.</p>
                <p>Questions? Contact support@coworkspace.com</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'CoWorkSpace Event'}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: `Booking Confirmed #${_id.toString().substring(_id.toString().length - 6).toUpperCase()} - CoWorkSpace`,
        html: emailTemplate
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

module.exports = { sendOrderConfirmationEmail };
