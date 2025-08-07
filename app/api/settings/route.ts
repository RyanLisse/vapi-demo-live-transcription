import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

interface SettingsData {
  publicKey: string;
  privateKey: string;
  assistantId: string;
}

// GET - Load current settings from environment
export async function GET() {
  try {
    const settings: SettingsData = {
      publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '',
      privateKey: process.env.VAPI_PRIVATE_KEY || '',
      assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '',
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to load settings:', error);
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}

// POST - Save settings to .env file
export async function POST(request: NextRequest) {
  try {
    const { publicKey, privateKey, assistantId }: SettingsData = await request.json();

    // Validate required fields
    if (!publicKey?.trim() || !privateKey?.trim() || !assistantId?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get the project root directory
    const projectRoot = process.cwd();
    const envPath = join(projectRoot, '.env');

    // Create the .env content
    const envContent = `# Add values from Vapi Dashboard
# Public key for client-side VAPI web SDK
NEXT_PUBLIC_VAPI_PUBLIC_KEY="${publicKey.trim()}"
NEXT_PUBLIC_VAPI_ASSISTANT_ID="${assistantId.trim()}"

# Private key for server-side API calls (keep secret!)
VAPI_PRIVATE_KEY="${privateKey.trim()}"
`;

    // Write to .env file
    await fs.writeFile(envPath, envContent, 'utf8');

    // Also update .env.example for reference (without actual values)
    const envExamplePath = join(projectRoot, '.env.example');
    const envExampleContent = `# Add values from Vapi Dashboard
# Public key for client-side VAPI web SDK
NEXT_PUBLIC_VAPI_PUBLIC_KEY="your_public_key_here"
NEXT_PUBLIC_VAPI_ASSISTANT_ID="your_assistant_id_here"

# Private key for server-side API calls (keep secret!)
VAPI_PRIVATE_KEY="your_private_key_here"
`;
    
    try {
      await fs.writeFile(envExamplePath, envExampleContent, 'utf8');
    } catch (exampleError) {
      console.warn('Could not update .env.example:', exampleError);
      // Don't fail the request if we can't update .env.example
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully. Please restart the development server to apply changes.' 
    });

  } catch (error) {
    console.error('Failed to save settings:', error);
    
    // Check if it's a permission error
    if (error instanceof Error && 'code' in error && error.code === 'EACCES') {
      return NextResponse.json(
        { error: 'Permission denied. Please check file permissions for the .env file.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save settings. Please try again.' },
      { status: 500 }
    );
  }
}