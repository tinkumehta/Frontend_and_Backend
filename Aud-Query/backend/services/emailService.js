// backend/services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class EmailService {
  static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  });

  static async sendAutoResponse(query, agent = null) {
    try {
      const mailOptions = {
        from: `"Query Management System" <${process.env.EMAIL_USER}>`,
        to: query.customerEmail,
        subject: `Re: ${query.subject || 'Your Query'}`,
        html: this.generateResponseTemplate(query, agent),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Auto-response sent to ${query.customerEmail}`);
    } catch (error) {
      console.error('❌ Email sending failed:', error);
    }
  }

  static generateResponseTemplate(query, agent) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; text-align: center;">
          <h1 style="margin: 0;">Query Received</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <p>Dear <strong>${query.customerName}</strong>,</p>
          <p>Thank you for contacting us. We've received your query and our team is already working on it.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
            <h3 style="margin-top: 0;">Query Details:</h3>
            <p><strong>Reference ID:</strong> ${query._id}</p>
            <p><strong>Category:</strong> ${query.category}</p>
            <p><strong>Priority:</strong> <span style="color: ${
              query.priority === 'urgent' ? '#e74c3c' : 
              query.priority === 'high' ? '#e67e22' : '#27ae60'
            }">${query.priority}</span></p>
            ${agent ? `<p><strong>Assigned To:</strong> ${agent.name}</p>` : ''}
          </div>

          <p>We aim to respond within:
            <strong>${
              query.priority === 'urgent' ? '30 minutes' :
              query.priority === 'high' ? '2 hours' :
              query.priority === 'medium' ? '4 hours' : '8 hours'
            }</strong>
          </p>

          <p>You can track your query status anytime through our customer portal.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">
              Best regards,<br>
              <strong>Customer Support Team</strong><br>
              Query Management System
            </p>
          </div>
        </div>
      </div>
    `;
  }

  static async sendResolutionEmail(query, agent) {
    const mailOptions = {
      from: `"Query Management System" <${process.env.EMAIL_USER}>`,
      to: query.customerEmail,
      subject: `Resolved: ${query.subject || 'Your Query'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; color: white; text-align: center;">
            <h1 style="margin: 0;">Query Resolved</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <p>Dear <strong>${query.customerName}</strong>,</p>
            <p>We're pleased to inform you that your query has been resolved!</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #27ae60; margin: 20px 0;">
              <p><strong>Resolved by:</strong> ${agent.name}</p>
              <p><strong>Resolution Time:</strong> ${this.calculateResolutionTime(query)}</p>
            </div>

            <p>If you have any further questions, please don't hesitate to contact us.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:support@company.com" style="background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  static calculateResolutionTime(query) {
    const created = new Date(query.createdAt);
    const resolved = new Date(query.updatedAt);
    const diffMs = resolved - created;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} minutes`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours`;
    return `${Math.floor(diffMins / 1440)} days`;
  }
}