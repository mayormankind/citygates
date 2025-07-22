// lib/sendmail.ts
export const sendEmail = async (email: string, detail: { subject: string; text: string }) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject: detail.subject, text: detail.text }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Send email API error:', { status: response.status, data });
      throw new Error(data.error || `Failed to send email (status: ${response.status})`);
    }

    if (!data.id || !data.success) {
      console.error('Invalid send email response:', data);
      throw new Error('Email sending failed: Invalid response');
    }

    console.log('Email request successful:', data);
    return data;
  } catch (error: any) {
    console.error('Error in sendEmail:', {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};