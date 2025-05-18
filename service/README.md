# Hono Starter Kit

A modern, type-safe API starter template built with Hono — a modern framework built on Web Standards. Featuring OpenAPI documentation with Scalar, TypeScript, and robust development tooling.

## 🚀 Features

- **TypeScript** - Full TypeScript support for type-safe development
- **Hono** - Fast, lightweight web framework built on Web Standards
- **OpenAPI Integration** - API documentation and validation using:
  - `@hono/zod-openapi` for Zod schema validation
  - `@scalar/hono-api-reference` for beautiful API documentation
- **Development Tools**:
  - `typescript-eslint` for TypeScript linting
  - `husky` for Git hooks
  - `commitlint` for conventional commit messages
  - `lint-staged` for pre-commit linting
- **Build & Development**:
  - `tsup` for fast TypeScript bundling with ESM and CommonJS support
  - `tsx` for TypeScript execution and watch mode
  - `dotenv` for environment variable management
  - `prettier` for code formatting
- **Node.js Integration**:
  - `@hono/node-server` for running Hono on Node.js

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/pedrostanzani/hono-starter
cd hono-starter

# Install dependencies
npm install
```

## 🏗️ Project Structure

```
.
├── src/
│   ├── app.ts           # Application setup
│   ├── index.ts         # Entry point
│   ├── router.ts        # Route definitions
│   ├── errors/          # Error handling
│   ├── lib/             # Shared utilities
│   └── modules/         # Feature modules
├── .husky/              # Git hooks
├── eslint.config.mjs    # ESLint configuration
├── commitlint.config.js # Commit message linting
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## 🚀 Getting Started

1. Start the development server:

```bash
npm run dev
```

2. Access the API documentation at `http://localhost:3000/`

## 🔧 Development Tools

### TypeScript & ESLint

The project uses TypeScript with strict type checking and ESLint for code quality:

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

### Build

The project uses `tsup` for building:

```bash
# Build the project
npm run build

# Start the production server
npm start
```

### Git Hooks

The project uses Husky to enforce code quality through Git hooks:

- `pre-commit`: Runs lint-staged which executes:
  - `prettier --write src` for code formatting
  - `eslint src --fix` for code linting
- `commit-msg`: Runs `commitlint` to validate commit messages against conventional commit format
- `pre-push`: Runs `npm run build` to ensure the project builds successfully before pushing

### Commit Messages

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Commit messages should follow this format:

```
type(scope): description
```

## 📚 API Documentation

The API documentation is automatically generated using Scalar and is available at `http://localhost:3000/`. The documentation is generated from your Zod schemas and OpenAPI specifications.

## 📝 License

MIT
