import { NextRequest, NextResponse } from 'next/server';

interface TestSettingsData {
  publicKey: string;
  privateKey: string;
  assistantId: string;
}

// POST - Test VAPI connection with provided credentials
export async function POST(request: NextRequest) {
  try {
    const { publicKey, privateKey, assistantId }: TestSettingsData = await request.json();

    // Validate required fields
    if (!publicKey?.trim() || !privateKey?.trim() || !assistantId?.trim()) {
      return NextResponse.json(
        { success: false, error: 'All fields are required for testing' },
        { status: 400 }
      );
    }

    // Test the VAPI connection by fetching assistants
    const vapiApiUrl = 'https://api.vapi.ai/assistant';
    
    try {
      const response = await fetch(vapiApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${privateKey.trim()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.json({
            success: false,
            error: 'Authentication failed. Please check your private key.'
          });
        } else if (response.status === 403) {
          return NextResponse.json({
            success: false,
            error: 'Access forbidden. Please verify your API key permissions.'
          });
        } else {
          return NextResponse.json({
            success: false,
            error: `API request failed with status ${response.status}`
          });
        }
      }

      const assistants = await response.json();
      
      // Check if the specified assistant ID exists
      const assistantExists = Array.isArray(assistants) && 
        assistants.some((assistant: any) => assistant.id === assistantId.trim());

      if (!assistantExists) {
        return NextResponse.json({
          success: false,
          error: `Assistant ID "${assistantId}" not found in your account. Please verify the ID is correct.`
        });
      }

      // Basic validation of public key format
      if (publicKey.trim().length < 10) {
        return NextResponse.json({
          success: false,
          error: 'Public key appears to be invalid (too short)'
        });
      }

      return NextResponse.json({
        success: true,
        assistantCount: Array.isArray(assistants) ? assistants.length : 0,
        message: 'Connection successful! All credentials are valid.'
      });

    } catch (fetchError) {
      console.error('VAPI API request failed:', fetchError);
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to VAPI API. Please check your internet connection and try again.'
      });
    }

  } catch (error) {
    console.error('Test connection error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while testing connection' },
      { status: 500 }
    );
  }
}