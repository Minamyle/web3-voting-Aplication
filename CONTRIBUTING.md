# Contributing to Voting dApp

We welcome contributions! Please follow these guidelines:

## Development Setup

```bash
# Clone and setup
git clone <repo-url>
cd votingapp
npm install
cd frontend && npm install && cd ..
```

## Making Changes

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly: `npm test`
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/your-feature`
6. Create a Pull Request

## Code Standards

- Use clear variable names
- Add comments for complex logic
- Follow existing code style
- Test all changes

## Testing

All changes must include tests:

```bash
npm test
```

## Commit Messages

- Use descriptive commit messages
- Reference issues: "Fix #123"
- Keep commits atomic and focused

## Deployment

Only maintainers can deploy to testnet/mainnet.

Thank you for contributing! 🙏
