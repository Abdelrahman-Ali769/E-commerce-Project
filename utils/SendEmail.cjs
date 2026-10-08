const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // 1) Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2) Define email options
    const mailOptions = {
        from: `E-shop App <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.message,
    };

    // 3) Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;