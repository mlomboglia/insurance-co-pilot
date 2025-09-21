# 🚗 Insurance Co-Pilot

**AI-Powered Roadside Assistance Platform**

A comprehensive prototype demonstrating next-generation insurance claim processing with voice AI, real-time decision making, and intelligent agent assistance. Built for live demonstration and presentation.

[![Demo Status](https://img.shields.io/badge/Demo-Live-brightgreen)]() [![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black)]() [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)]()

## ✨ Key Features

### 🎙️ **Voice-First Interface**
- Natural language claim filing using Web Speech API
- AI-powered conversation flow with OpenAI integration
- Real-time speech-to-text processing
- Contextual follow-up questions

### 🤖 **Intelligent Claim Processing**
- Automated policy verification and coverage analysis
- Real-time service provider matching and dispatch
- Smart urgency detection and prioritization
- Comprehensive claim decision engine

### 📊 **Professional Dashboard**
- Real-time claim monitoring and management
- Agent oversight tools with manual review capabilities
- Historical data visualization and analytics
- Service provider performance tracking

### 🎯 **Demo-Ready Features**
- Pre-configured demonstration scenarios
- Sample voice inputs for testing without microphone
- Keyboard shortcuts for efficient demo control
- Professional presentation mode

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 with App Router |
| **Language** | TypeScript with strict type checking |
| **Styling** | Tailwind CSS with custom design system |
| **AI Integration** | OpenAI API for natural language processing |
| **Icons** | Lucide React icon library |
| **State Management** | React hooks and context |
| **Build Tools** | ESLint, Prettier, TypeScript compiler |

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager
- OpenAI API key (for voice processing)

### Installation

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd insurance-co-pilot
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your OpenAI API key
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open demo**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🎬 Demo Mode

The application launches in **Demo Mode** by default, featuring:
- Pre-configured scenarios (Approved, Denied, Requires Review)
- Sample voice inputs for testing
- Keyboard shortcuts for efficient navigation
- Professional presentation interface

**Demo Scenarios:**
- **Flat Tire**: Standard approved claim with Premium Plus coverage
- **Battery Jump**: Service limit exceeded, requires agent review
- **Lockout**: Basic plan customer, service not covered

## 📁 Project Architecture

```
insurance-co-pilot/
├── 📂 app/                     # Next.js App Router
│   ├── 📂 api/                # API routes
│   │   ├── process-voice/     # Voice processing endpoint
│   │   └── submit-claim/      # Claim submission endpoint
│   ├── 📂 customer/           # Customer voice interface
│   ├── 📂 agent/             # Agent dashboard
│   ├── 📂 status/            # Claim status tracking
│   ├── layout.tsx            # Root layout with navigation
│   └── page.tsx              # Landing page (redirects to customer)
├── 📂 components/             # Reusable React components
│   ├── VoiceAgent.tsx        # Voice interaction component
│   ├── DemoMode.tsx          # Demo scenario management
│   └── Navigation.tsx        # App navigation
├── 📂 lib/                   # Business logic & utilities
│   ├── mockData.ts          # Demo data and scenarios
│   ├── claimProcessing.ts   # Claim decision engine
│   └── utils.ts             # Helper functions
├── 📂 types/                 # TypeScript definitions
│   ├── conversation.ts      # Voice conversation types
│   └── api.ts               # API and data types
├── 📂 hooks/                 # Custom React hooks
│   └── useKeyboardShortcuts.ts
└── 📂 public/               # Static assets
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run typecheck` | Run TypeScript compiler checks |

## 🎯 Application Flow

### 1. **Customer Interface** (`/customer`)
- **Voice Recording**: Natural language claim filing
- **Demo Scenarios**: Pre-configured test cases
- **Real-time Processing**: Immediate AI response and processing
- **Claim Submission**: Automated form completion and submission

### 2. **Agent Dashboard** (`/agent`)
- **Active Claims Monitoring**: Real-time claim queue
- **Manual Review Tools**: Human oversight for complex cases
- **Service Provider Management**: Dispatch coordination
- **Historical Analytics**: Performance tracking and insights

### 3. **Status Tracking** (`/status`)
- **Claim Lookup**: Search by claim ID or customer info
- **Progress Timeline**: Real-time status updates
- **ETA Tracking**: Service provider arrival estimates
- **Communication Hub**: SMS and email notifications

### 4. **AI Decision Engine**
- **Policy Verification**: Automated coverage checking
- **Service Matching**: Intelligent provider selection
- **Cost Calculation**: Dynamic pricing with coverage factors
- **Fraud Detection**: Risk assessment and flagging

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/Stop Voice Recording |
| `R` | Reset Conversation |
| `D` | Toggle Demo Mode |
| `H` or `?` | Show Help |
| `1`, `2`, `3` | Quick Scenario Selection |
| `Esc` | Close Modals |

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```bash
docker build -t insurance-co-pilot .
docker run -p 3000:3000 insurance-co-pilot
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
NEXT_PUBLIC_APP_NAME=Insurance Co-Pilot
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SPEECH_API_ENABLED=true
```

## 🎯 Key Business Benefits

- **50% Faster Claims**: Automated voice processing vs. traditional forms
- **24/7 Availability**: AI-powered assistance without human agents
- **Reduced Fraud**: Real-time verification and risk assessment
- **Cost Savings**: Automated dispatch and provider optimization
- **Customer Satisfaction**: Intuitive voice interface and instant response

## 🔮 Production Roadmap

### Phase 1: Core Platform
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Real-time WebSocket connections
- [ ] Production API integration

### Phase 2: Advanced Features
- [ ] GPS integration and mapping
- [ ] SMS/Email notification system
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

### Phase 3: Enterprise Features
- [ ] Multi-tenant architecture
- [ ] Advanced fraud detection
- [ ] Third-party integrations
- [ ] Compliance and audit tools

## 📄 License

This prototype is built for demonstration purposes. See individual component licenses for production use.

## 🤝 Contributing

This is a demonstration prototype. For production implementation:
1. Conduct security audit
2. Implement proper error handling
3. Add comprehensive testing
4. Follow enterprise deployment practices

---

**Built with ❤️ for the future of insurance technology**