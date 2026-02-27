import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://r2-d2s-mac-mini.tailc24cdb.ts.net/usmp-api/ask';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 65000);

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim() }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Our product advisor is temporarily unavailable. Please try again shortly.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.reply });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'The request timed out. Please try a shorter or simpler question.' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
