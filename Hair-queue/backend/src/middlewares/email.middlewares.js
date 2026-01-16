import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendOtpEmail = async (to, otp) => {
  try {
     const { data, error } = await resend.emails.send({
    from: 'Resend <onboarding@resend.dev>',
    to: 'timmusk92@gmail.com',  // ONLY THIS EMAIL WILL WORK
    subject: 'Verify your email - HairQueue',
    html: `<h1>Your OTP: ${otp}</h1>`
  });

      if (error) {
        return console.error({error});
      } else {
        console.log(data);
        
      }

  } catch (error) {
    console.log("Sending Otp email failed", error);
    
  }
}