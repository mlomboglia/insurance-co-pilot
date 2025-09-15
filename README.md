# Insurance Co-Pilot

An AI-powered roadside assistance claim system built with Next.js 15, featuring voice interaction and real-time claim processing.

## Features

- **Voice Interaction**: File claims using Web Speech API
- **AI Integration**: OpenAI-powered claim processing
- **Real-time Updates**: Live claim status tracking
- **Agent Dashboard**: Human oversight and claim management
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI API
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── customer/          # Customer voice interface
│   ├── agent/             # Agent dashboard
│   ├── status/            # Claim status tracking
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler

## Demo Features

### Customer Interface (`/customer`)
- Voice recording button for claim filing
- Alternative contact options
- Location sharing capabilities

### Agent Dashboard (`/agent`)
- Real-time claim monitoring
- Claim filtering and search
- Status management tools

### Claim Status (`/status`)
- Claim lookup by ID
- Progress tracking
- Estimated arrival times
- Update notifications

## Next Steps

To make this a production-ready application, consider implementing:

1. **Database Integration**: Add PostgreSQL or MongoDB for data persistence
2. **Authentication**: Implement user authentication and authorization
3. **Real-time Features**: Add WebSocket support for live updates
4. **Voice Processing**: Integrate Web Speech API and OpenAI Whisper
5. **Geolocation**: Add maps and GPS functionality
6. **Notifications**: Implement push notifications and SMS alerts
7. **Testing**: Add unit tests and integration tests
8. **Deployment**: Set up CI/CD pipeline and production hosting

## Environment Variables

Create a `.env.local` file with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SPEECH_API_ENABLED=true
```

## License

This project is for demonstration purposes.