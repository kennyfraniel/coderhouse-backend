import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";


const sendEmail = asyncHandler (async (data, req, res ) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.hotmail.com",
        port: 465,
        secure: true,
        auth: {
          
          user: process.env.MAIL_ID,
          pass: process.env.MP,
        }
      });
      
      
      async function main() {
        
        const info = await transporter.sendMail({
          from: '"Fred Foo 👻" <abc@example.com>', 
          to: data.to,
          subject: data.subject, 
          text: data.text, 
          htm: data.html, 
        });
      
        console.log("Message sent: %s", info.messageId);
}});

export default sendEmail;