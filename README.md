# 🚀 PR Dev Tool

An AI-powered pull request review tool that helps developers get intelligent code reviews using OpenAI's GPT models. The tool integrates with GitHub to fetch your open pull requests and provides detailed, actionable feedback on code quality, potential bugs, and best practices.

## ✨ Features

- 🔐 **GitHub OAuth Integration** - Secure authentication with GitHub
- 📋 **Pull Request Management** - View and manage your open pull requests  
- 🤖 **AI-Powered Reviews** - Get intelligent code reviews using GPT-4/GPT-3.5
- 💾 **Review History** - Save and access past code reviews
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 📄 **Export Options** - Download reviews as Markdown or copy to clipboard
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with GitHub OAuth
- **Database**: Supabase
- **AI**: OpenAI API (GPT-4/GPT-3.5-turbo)
- **Markdown Rendering**: react-markdown

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.