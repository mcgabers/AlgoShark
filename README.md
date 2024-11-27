# AlgoShark - AI-Native Business Funding Platform

AlgoShark is a decentralized platform built on the Algorand blockchain that streamlines the crowdfunding, ownership, and management of AI-generated software businesses. The platform facilitates fractional ownership and automates key processes like dividend distribution and governance.

## Features

- Three-column layout with icon-based navigation
- Project submission and discovery
- Portfolio management
- Algorand blockchain integration
- Modern UI with Tailwind CSS and Shadcn components

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Blockchain**: Algorand SDK
- **State Management**: React Context API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/algoshark.git
   cd algoshark
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   └── ui/          # Reusable UI components
├── lib/             # Utility functions
├── services/        # External service integrations
│   └── blockchain/  # Algorand integration
├── styles/          # Global styles
├── hooks/           # Custom React hooks
└── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 