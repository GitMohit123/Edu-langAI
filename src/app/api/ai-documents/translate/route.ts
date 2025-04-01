import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, target_language } = await request.json();
    if (!text || !target_language) {
      return NextResponse.json({ error: 'Text and target_language are required' }, { status: 400 });
    }

    // Call your Lambda function API for translation
    const response = await fetch(process.env.TRANSLATE_LAMBDA_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        target_language,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to translate text');
    }

    const data = await response.json();
    return NextResponse.json({ translated_text: data.translated_text });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
