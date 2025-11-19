const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Boy Đồ Hiệu Shop" <your-email@gmail.com>',
      to,
      subject,
      text,
    });
    console.log('Email sent to:', to);
  } catch (err) {
    console.error('Email error:', err);
    throw new Error('Không thể gửi email');
  }
};

module.exports = { sendEmail };