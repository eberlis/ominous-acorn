# Personal Finance Management Application

A comprehensive web application designed to help users manage their personal finances effectively, including budgeting, savings tracking, tithing, investment recommendations, and spending analysis.

## 🎯 Project Overview

This application empowers users to take control of their financial health by providing:

- **Location-based budget recommendations** tailored to cost of living
- **Automatic tithing calculation** (10% allocation for charitable giving)
- **Savings and emergency fund tracking** with goal visualization
- **AI-powered spending reduction suggestions** based on spending patterns
- **Investment allocation and recommendations** based on risk profile and goals
- **Comprehensive financial dashboard** for complete financial overview
- **Expense tracking and categorization** with bank integration support

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/eberlis/ominous-acorn.git
cd ominous-acorn
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration settings.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run lint` - Run ESLint

## 🏗️ Tech Stack

- **Framework**: Next.js 14
- **Language**: JavaScript/React 18
- **Styling**: CSS Modules
- **State Management**: React Hooks + Context
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
ominous-acorn/
├── .github/
│   ├── instructions/          # AI coding guidelines
│   └── prompts/              # Prompt templates
├── components/               # Reusable React components
├── docs/                     # Project documentation
│   └── user-stories/        # User stories and requirements
├── pages/                    # Next.js pages and API routes
│   ├── _app.js              # App wrapper
│   └── index.js             # Home page
├── public/                   # Static assets
├── styles/                   # Global and module CSS
└── tests/                    # Test files
```

## 📖 Documentation

- **[User Stories](./docs/user-stories/)** - Detailed feature requirements and acceptance criteria
- **[User Story Generation Guide](./docs/user-stories/README.md)** - Guidelines for creating new user stories
- **[Coding Guidelines](./.github/instructions/general.instructions.md)** - Best practices and standards

## 🎨 Features Roadmap

### Release 1.0 (MVP) - In Development
- [x] Location-Based Budget Suggestions
- [x] Automatic Tithing Calculation
- [x] Savings and Emergency Fund Management
- [x] Dashboard Overview
- [x] Expense Tracking and Categorization

### Release 1.5 - Planned
- [ ] Monthly Spending Reduction Suggestions
- [ ] Investment Allocation and Recommendations
- [ ] Reports and Analytics

### Release 2.0 - Future
- [ ] Financial Goals and Milestones
- [ ] Alerts and Notifications
- [ ] Advanced AI-powered insights

## 🤝 Contributing

1. Create a feature branch from `main`
2. Follow the coding guidelines in `.github/instructions/`
3. Write tests for new features
4. Ensure all tests pass and linting is clean
5. Submit a pull request with a clear description

## 🔒 Security & Privacy

- All financial data is encrypted at rest and in transit
- Compliant with GDPR and CCPA regulations
- Two-factor authentication support
- Regular security audits
- Option for local data storage

## 📄 License

This project is private and proprietary.

## 👥 Team

Maintained by [@eberlis](https://github.com/eberlis)

## 📞 Support

For questions or issues, please open an issue in the GitHub repository.

---

*Last Updated: November 26, 2025*
