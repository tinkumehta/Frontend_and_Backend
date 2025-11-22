// services/emailService.js
import nodemailer from 'nodemailer';

export class EmailService {
  static async sendAutoResponse(query, agent) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: query.customerEmail,
      subject: `Re: ${query.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h3>Dear ${query.customerName},</h3>
          <p>Thank you for contacting us. Your query has been received and assigned to ${agent.name}.</p>
          <p><strong>Query Reference:</strong> ${query._id}</p>
          <p><strong>Status:</strong> ${query.status}</p>
          <p>We'll get back to you within 24 hours.</p>
          <br>
          <p>Best regards,<br>Support Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}