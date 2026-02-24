# gitagent — Landing Page

The official landing page for [gitagent.sh](https://gitagent.sh), a framework-agnostic, git-native standard for defining AI agents.

Clone a repo, get an agent.

## About gitagent

gitagent lets you define AI agents as git repositories — with version control, branching, diffing, and collaboration built in. Export to any framework with adapters: Claude Code, OpenAI, Lyzr, CrewAI, OpenClaw, Nanobot, and more.

## Development

Requires Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
git clone https://github.com/open-gitagent/landing.git
cd landing
npm i
npm run dev
```

Runs on `http://localhost:8080`.

## Build

```sh
npm run build
npm run preview
```

## Tech Stack

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS
- Framer Motion

## Links

- **Website**: [gitagent.sh](https://gitagent.sh)
- **CLI**: [npm @open-gitagent/gitagent](https://www.npmjs.com/package/@open-gitagent/gitagent)
- **GitHub**: [open-gitagent/gitagent](https://github.com/open-gitagent/gitagent)
- **Spec**: [SPECIFICATION.md](https://github.com/open-gitagent/gitagent/blob/main/spec/SPECIFICATION.md)

## License

MIT
