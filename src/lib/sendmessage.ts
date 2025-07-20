interface SendMessageResponse {
  code: string;
  message_id: string;
  message: string;
  balance: number;
  user: string;
}

export async function sendMessage(
  to: string,
  message: string,
  from: string = "talert"
): Promise<SendMessageResponse> {
  if (!process.env.TERMII_BASE_URL || !process.env.TERMII_API_KEY) {
    throw new Error(
      "Missing Termii API configuration. Check environment variables."
    );
  }

  const response = await fetch(process.env.TERMII_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: to,
      from: from,
      sms: message,
      type: "plain",
      api_key: process.env.TERMII_API_KEY,
      channel: "generic",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send message");
  }

  return response.json() as Promise<SendMessageResponse>;
}
