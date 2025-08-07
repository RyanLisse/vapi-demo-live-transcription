import { NextResponse } from 'next/server';

// This would use your PRIVATE VAPI key (never expose in client)
const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;

export async function GET() {
  try {
    if (!VAPI_PRIVATE_KEY) {
      return NextResponse.json({ error: 'VAPI private key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.vapi.ai/assistant', {
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`VAPI API error: ${response.status}`);
    }

    const assistants = await response.json();
    
    // Return only the data needed by the client
    const clientSafeAssistants = assistants.map((assistant: any) => ({
      id: assistant.id,
      name: assistant.name,
      llm: {
        provider: assistant.llm?.provider,
        model: assistant.llm?.model
      }
    }));

    return NextResponse.json(clientSafeAssistants);
  } catch (error) {
    console.error('Failed to fetch assistants:', error);
    return NextResponse.json({ error: 'Failed to fetch assistants' }, { status: 500 });
  }
}