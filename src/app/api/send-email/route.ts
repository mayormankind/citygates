// // app/api/send-email/route.ts
// import { NextResponse } from 'next/server';
// import { Resend } from 'resend';

// export async function POST(request: Request) {
//   const { email, subject, text } = await request.json();
//   const resend = new Resend(process.env.RESEND_TOKEN);
//   try {
//     const response = await resend.emails.send({
//       from: process.env.EMAIL_USER as string,
//       to: email,
//       subject,
//       html: `<p>${text}</p>`,
//     });
//     return NextResponse.json(response);
//   } catch (error: any) {
//     console.error('Error sending email:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { email, subject, text } = await request.json();

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email configuration missing:', {
      emailUser: !!process.env.EMAIL_USER,
      emailPass: !!process.env.EMAIL_PASS,
    });
    return NextResponse.json({ error: 'Server configuration error: Missing EMAIL_USER or EMAIL_PASS' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Mock response for local testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`Mock email sent to ${email}: Subject: ${subject}, Text: ${text}`);
      return NextResponse.json({ id: 'mock-email-id', success: true });
    }

    const info = await transporter.sendMail({
      from: `"Citygates Food Bank" <${process.env.EMAIL_USER}>`, // e.g., "Citygates Food Bank" <mayowamakinde23@gmail.com>
      to: email,
      subject,
      html: `<p>${text}</p>`,
    });

    if (!info.messageId) {
      console.error('Nodemailer response missing messageId:', info);
      throw new Error('Email sending failed: No message ID');
    }

    console.log('Email sent successfully:', { messageId: info.messageId, to: email, from: process.env.EMAIL_USER });
    return NextResponse.json({ id: info.messageId, success: true });
  } catch (error: any) {
    console.error('Error sending email:', {
      message: error.message,
      code: error.code,
      response: error.response,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: error.responseCode || 500 }
    );
  }
}