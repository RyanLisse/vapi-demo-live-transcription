# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 application demonstrating VAPI (Voice AI) integration with 3D visualization and dynamic UI components. The app features:

- Interactive 3D orb that morphs based on voice input volume using Three.js
- Real-time voice conversation with AI assistant
- Dynamic Island-style UI component for call status
- Tailwind CSS with shadcn/ui components

## Environment Setup

**CRITICAL**: Before running the app, configure the `.env` file with VAPI credentials:
- `NEXT_PUBLIC_VAPI_PUBLIC_KEY`: Your VAPI public key from the dashboard
- `NEXT_PUBLIC_VAPI_ASSISTANT_ID`: Your VAPI assistant ID from the dashboard

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
next build

# Start production server
npm start

# Run linter
npm run lint
```

## Core Architecture

### VAPI Integration (`hooks/use-vapi.ts`)
- Manages VAPI WebSocket connection and state
- Handles call lifecycle (start/stop/mute)
- Processes real-time transcripts and volume levels
- Manages conversation history with partial/final transcript handling
- Includes URL navigation function calls from AI assistant

### 3D Visualization (`components/orb.tsx`)
- Three.js-based morphing icosahedron
- Responds to volume levels during active VAPI sessions
- Uses simplex noise for organic morphing effects
- Resets to original shape when call ends
- Renders to `#out` DOM element

### Dynamic Island UI (`app/page.tsx`)
- Custom implementation mimicking iOS Dynamic Island
- Shows different states: idle, starting, listening, conversation
- Automatically resizes based on call activity
- Displays recent assistant messages during active calls

## Key Dependencies

- `@vapi-ai/web`: Core VAPI integration library
- `three`: 3D graphics rendering
- `simplex-noise`: Procedural noise for orb morphing
- `framer-motion`: Animation library
- `@radix-ui/react-slot`: Base component primitives
- `tailwindcss-animate`: CSS animations

## File Structure Notes

- `hooks/use-vapi.ts`: Core VAPI logic - DO NOT modify without understanding WebSocket lifecycle
- `components/orb.tsx`: Three.js visualization - geometry modifications affect performance
- `components/ui/`: shadcn/ui components with custom dynamic island implementation
- Environment variables are loaded via Next.js `process.env.NEXT_PUBLIC_*` pattern

## Testing and Deployment

The app requires microphone permissions to function properly. Test in a secure context (HTTPS or localhost) to avoid browser permission issues.

## Common Patterns

- All VAPI state management flows through the `use-vapi` hook
- Three.js cleanup is handled in component unmount to prevent memory leaks
- Volume-based UI updates use effect dependencies to ensure proper re-rendering
- Conversation state includes both partial and final transcripts for real-time UX