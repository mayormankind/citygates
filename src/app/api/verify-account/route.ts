// app/api/verify-account/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountNumber = searchParams.get('account_number');
  const bankName = searchParams.get('bank_name');

  if (!accountNumber || !bankName) {
    return NextResponse.json({ error: 'Missing account number or bank name' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://nubapi.com/api/verify?account_number=${accountNumber}`, {
      headers: {
        Authorization: `Bearer ${process.env.NUBAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Nubapi error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to verify account' },
      { status: error.response?.status || 500 }
    );
  }
}