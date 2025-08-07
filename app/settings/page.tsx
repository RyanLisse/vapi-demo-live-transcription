"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Save, TestTube, Shield, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsData {
  publicKey: string;
  privateKey: string;
  assistantId: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsData>({
    publicKey: "",
    privateKey: "",
    assistantId: ""
  });
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Load current settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          console.warn('Could not load current settings');
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleInputChange = (field: keyof SettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setMessage(null); // Clear any existing messages when user types
    setConnectionStatus('idle');
  };

  const validateSettings = (): boolean => {
    if (!settings.publicKey.trim()) {
      setMessage({ type: 'error', text: 'VAPI Public Key is required' });
      return false;
    }
    if (!settings.privateKey.trim()) {
      setMessage({ type: 'error', text: 'VAPI Private Key is required' });
      return false;
    }
    if (!settings.assistantId.trim()) {
      setMessage({ type: 'error', text: 'Default Assistant ID is required' });
      return false;
    }

    // Basic format validation
    if (settings.publicKey.length < 10) {
      setMessage({ type: 'error', text: 'Public key appears to be too short' });
      return false;
    }
    if (settings.privateKey.length < 10) {
      setMessage({ type: 'error', text: 'Private key appears to be too short' });
      return false;
    }
    if (settings.assistantId.length < 10) {
      setMessage({ type: 'error', text: 'Assistant ID appears to be too short' });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateSettings()) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Settings saved successfully! Please restart the development server to apply changes.' 
        });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!validateSettings()) return;

    setTestingConnection(true);
    setConnectionStatus('testing');
    setMessage(null);

    try {
      const response = await fetch('/api/settings/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setConnectionStatus('success');
        setMessage({ 
          type: 'success', 
          text: `Connection successful! Found ${result.assistantCount || 0} assistants in your account.` 
        });
      } else {
        setConnectionStatus('error');
        setMessage({ 
          type: 'error', 
          text: result.error || 'Connection test failed' 
        });
      }
    } catch (error) {
      console.error('Test connection error:', error);
      setConnectionStatus('error');
      setMessage({ type: 'error', text: 'Connection test failed. Please check your credentials.' });
    } finally {
      setTestingConnection(false);
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <TestTube className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <TestTube className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Demo</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              VAPI Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Configure your VAPI credentials and preferences
            </p>
          </div>
        </div>

        {/* Security Warning */}
        <Alert variant="warning" className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            Your private key will be stored in your .env file. Never commit this file to version control 
            or share it publicly. Keep your VAPI credentials secure.
          </AlertDescription>
        </Alert>

        {/* Settings Form */}
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Enter your VAPI credentials from your dashboard. You can find these in your VAPI account settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Public Key */}
            <div className="space-y-2">
              <Label htmlFor="publicKey">VAPI Public Key</Label>
              <Input
                id="publicKey"
                type="text"
                placeholder="Your VAPI public key (used for client-side SDK)"
                value={settings.publicKey}
                onChange={(e) => handleInputChange('publicKey', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This key is safe to expose in client-side code and is used for the web SDK.
              </p>
            </div>

            {/* Private Key */}
            <div className="space-y-2">
              <Label htmlFor="privateKey">VAPI Private Key</Label>
              <div className="relative">
                <Input
                  id="privateKey"
                  type={showPrivateKey ? "text" : "password"}
                  placeholder="Your VAPI private key (used for server-side API calls)"
                  value={settings.privateKey}
                  onChange={(e) => handleInputChange('privateKey', e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                >
                  {showPrivateKey ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This key must be kept secret and is used for server-side API operations.
              </p>
            </div>

            {/* Assistant ID */}
            <div className="space-y-2">
              <Label htmlFor="assistantId">Default Assistant ID</Label>
              <Input
                id="assistantId"
                type="text"
                placeholder="Your default VAPI assistant ID"
                value={settings.assistantId}
                onChange={(e) => handleInputChange('assistantId', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The ID of the assistant that will be used by default for voice calls.
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <Alert variant={message.type === 'success' ? 'success' : message.type === 'warning' ? 'warning' : 'destructive'}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={testingConnection || loading}
                className="flex items-center space-x-2"
              >
                {getConnectionIcon()}
                <span>
                  {testingConnection ? 'Testing...' : 'Test Connection'}
                </span>
              </Button>

              <Button
                onClick={handleSave}
                disabled={loading || testingConnection}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Settings'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">How to get your VAPI credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>Go to your <a href="https://dashboard.vapi.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">VAPI Dashboard</a></li>
              <li>Navigate to the &ldquo;API Keys&rdquo; section</li>
              <li>Copy your Public Key (for client-side use)</li>
              <li>Copy your Private Key (for server-side use)</li>
              <li>Go to &ldquo;Assistants&rdquo; and copy the ID of your desired assistant</li>
              <li>Paste the values into the form above and save</li>
              <li>Restart your development server to apply the changes</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}