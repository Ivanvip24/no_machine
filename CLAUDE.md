# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**No_Machine** is a boundary-setting web application that helps users decline events and reject messages with confidence. The app generates three different boundary-setting responses (soft, clear, firm) along with AI-generated visual mood lighteners to ease difficult conversations.

### Key Features
- AI-powered boundary response generation using Claude Opus 4.1
- Three-tiered response system: 🟢 Soft → 🟡 Clear → 🔴 Wall
- Visual mood lighteners using FAL.ai FLUX image generation
- User authentication and response history
- Psychology-based explanations for each boundary approach

## Technology Stack

### Frontend & Framework
- **Next.js 14+** with App Router and TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React** with modern hooks and patterns

### Authentication & Database
- **Supabase** with @supabase/ssr for authentication and database
- **Row Level Security (RLS)** policies for data protection
- **PostgreSQL** for user data and generation history

### AI Integration
- **Anthropic Claude Opus 4.1** (`claude-opus-4-1-20250805`) for boundary coaching
- **FAL.ai FLUX** models for image generation
- Custom "Boundary Coach AI" prompt for consistent persona
- Direct API integration (MCP-ready architecture)

### Deployment
- **Vercel** compatible with proper environment configuration
- **Environment variables** for all API keys and configuration

## Project Structure

```
no-machine/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/generate/       # Main generation API endpoint
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main app interface
│   │   ├── history/           # User generation history
│   │   ├── page.tsx           # Landing page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   ├── generation/        # Boundary generation UI
│   │   └── layout/            # Layout components
│   ├── lib/                   # Core utilities and clients
│   │   ├── supabase/          # Database client and middleware
│   │   ├── anthropic/         # Claude API client and prompts
│   │   ├── fal/               # FAL.ai image generation
│   │   └── utils.ts           # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Supabase auth middleware
├── .env.example              # Environment variables template
└── CLAUDE.md                 # This documentation file
```

## Development Commands

### Setup and Installation
```bash
npm install                    # Install dependencies
npm run dev                   # Start development server
npm run build                 # Build for production
npm run start                 # Start production server
```

### Database Setup
```bash
# Run the SQL schema in your Supabase project
psql -f src/lib/supabase/schema.sql
```

## Environment Configuration

Required environment variables (see `.env.example`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=       # Service role key (server-side)

# AI APIs
ANTHROPIC_API_KEY=               # Claude Opus 4.1 API key
FAL_API_KEY=                     # FAL.ai image generation key

# Application
NEXT_PUBLIC_APP_URL=             # App URL (for callbacks)
```

## Core Architecture

### Boundary Coach AI Prompt
The heart of the application is the "Boundary Coach AI" persona defined in `src/lib/anthropic/client.ts`. This prompt:
- Creates a consistent, empathetic coaching voice
- Generates structured markdown responses
- Provides psychology-backed explanations
- Includes visual mood lightener prompts

### Generation Flow
1. User submits boundary situation via form
2. API processes request through Claude Opus 4.1 with Boundary Coach prompt
3. Response is parsed into structured boundary options
4. FAL.ai generates images for visual mood lighteners
5. Complete response is saved to user's history
6. UI displays all options with copy-to-clipboard functionality

### Authentication Flow
- Supabase Auth with email/password signup
- Server-side session management with @supabase/ssr
- Protected routes via middleware
- Row Level Security for data access

## Database Schema

### Key Tables
- `generations`: Stores user boundary responses with JSONB structure
- Built-in `auth.users`: Managed by Supabase Auth

### Security
- All tables use Row Level Security (RLS)
- Users can only access their own data
- Server-side API key management

## Key Implementation Details

### Parsing Claude Responses
The API parses structured markdown responses from Claude into typed objects:
- Extracts Quick Take validation and insights
- Parses three boundary options with scripts and explanations
- Extracts image prompts for mood lighteners

### Image Generation
FAL.ai integration generates three mood lightener images:
- Uses FLUX dev model for quality and speed
- Processes prompts from Claude's suggestions
- Handles errors gracefully with fallback messaging

### UI/UX Patterns
- Color-coded boundary levels (🟢🟡🔴)
- Copy-to-clipboard for all user-facing text
- Loading states and error handling throughout
- Responsive design for mobile and desktop

## Troubleshooting

### Common Issues
- **Build failures**: Check environment variables are set
- **Auth issues**: Verify Supabase configuration and middleware
- **API errors**: Check Claude and FAL.ai API key validity
- **Image generation**: FAL.ai requires proper error handling for rate limits

### Development Tips
- Use the example scenarios for testing boundary generation
- Test authentication flow with temp email services
- Monitor API usage and costs during development
- Check browser console for client-side errors

## Future Enhancements

### Ready for Implementation
- Email integration for sending boundary responses
- Calendar integration for blocking declined events
- Usage analytics and success tracking
- Template management for common scenarios
- Social sharing features

### MCP Integration Ready
The codebase is architected to easily integrate with Model Context Protocol (MCP) for enhanced AI orchestration when needed.