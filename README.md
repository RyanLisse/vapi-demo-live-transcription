# 🎙️ VAPI Demo with Live Transcription

A modern Next.js application demonstrating real-time voice AI integration with **VAPI** (Voice AI Platform). Features beautiful live transcription, dynamic assistant selection, and responsive UI components.

![VAPI Demo](https://img.shields.io/badge/VAPI-Voice%20AI-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## ✨ Features

- **🎯 Dynamic Assistant Selection** - Choose from multiple AI assistants with different models
- **📝 Live Transcription** - Beautiful real-time conversation display with VAPIBlocks design
- **🎤 Voice Controls** - Simple start/stop call buttons with status indicators  
- **🔄 Real-time Updates** - Dynamic assistant loading from VAPI API
- **🎨 Modern UI** - Responsive design with Tailwind CSS and shadcn/ui components
- **⚡ Fast Performance** - Built with Bun and optimized for speed

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript  
- **Styling**: Tailwind CSS + shadcn/ui
- **Voice AI**: VAPI Web SDK
- **Package Manager**: Bun
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

**Install Bun** (if not already installed):
```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"

# Or using npm
npm install -g bun

# Verify installation
bun --version
```

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hgg-vapi-demo
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your VAPI credentials:
   ```bash
   # Public key for client-side VAPI web SDK  
   NEXT_PUBLIC_VAPI_PUBLIC_KEY="your-public-key-here"
   NEXT_PUBLIC_VAPI_ASSISTANT_ID="your-default-assistant-id"
   
   # Private key for server-side API calls (keep secret!)
   VAPI_PRIVATE_KEY="your-private-key-here"
   ```

4. **Run the development server**
   ```bash
   bun run make
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Getting VAPI Credentials

1. **Sign up** at [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. **Create an Assistant** or use existing ones
3. **Get your API Keys**:
   - **Public Key**: Safe for client-side use (starts with your org ID)
   - **Private Key**: For server-side API calls (keep secret!)
4. **Copy Assistant IDs** from your dashboard

## 🎮 Usage

1. **Select an Assistant** - Choose from the dropdown (dynamically loaded from your VAPI account)
2. **Grant Microphone Permission** - Required for voice calls
3. **Start Conversation** - Click the green "Start Call" button
4. **View Live Transcription** - See real-time conversation in the beautiful interface
5. **End Call** - Click the red "End Call" button

## 📁 Project Structure

```
├── app/
│   ├── api/assistants/route.ts    # Backend API for fetching assistants
│   ├── page.tsx                   # Main demo page with call controls
│   └── globals.css                # Global styles
├── components/
│   ├── transcriber.tsx            # VAPIBlocks-inspired transcription UI
│   └── ui/                        # shadcn/ui components
├── hooks/
│   └── use-vapi.ts               # VAPI integration hook
└── lib/
    └── utils.ts                  # Utility functions
```

## 🚀 Available Scripts

```bash
# Start development server (kills existing processes)
bun run make

# Standard Next.js commands with Bun
bun run dev     # Development server
bun run build   # Production build  
bun run start   # Production server
bun run lint    # ESLint check
```

## 🔒 Security Notes

- **Environment Variables**: All sensitive keys in `.env` (gitignored)
- **Public vs Private**: Proper separation of client/server credentials
- **API Routes**: Server-side assistant fetching for security
- **No Secrets in Client**: Private keys never exposed to browser

## 🎨 Design Philosophy

- **Clean & Modern**: Minimal interface focused on conversation
- **VAPIBlocks Inspired**: Following established design patterns
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper ARIA labels and keyboard navigation

---

Built with ❤️ using VAPI, Next.js, and modern web technologies.