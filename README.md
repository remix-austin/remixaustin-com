# RemixAustin.com

[![🚀 Deploy](https://github.com/remix-austin/remixaustin-com/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/remix-austin/remixaustin-com/actions/workflows/deploy.yml)

<img src="public/img/remix-logo-rainbow.jpg" width="600" alt="Remix Austin logo" />

The public repository for the [RemixAustin.com](https://remixaustin.com) website.

_(Based on the [Remix Indie Stack](https://github.com/remix-run/indie-stack), but with all the default content & Prisma/SQLite stuff removed)._

## Want to contribute?

Well that might be slightly premature ... this site is in its infancy and we're not quite ready for contributions beyond our core team 😐 Check back soon for [how to contribute](docs/contributing.md)!

You can, however, [create an issue](https://github.com/remix-austin/remixaustin-com/issues) to alert of us about any bugs or desired features!

## The stack

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Styling with [Tailwind](https://tailwindcss.com/)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Development

- Use [nvm](https://github.com/nvm-sh/nvm) to use the minimum Node.js version _(`18.3.0`):_

  ```sh
  nvm use
  ```

- Install dependencies:

  ```sh
  npm i
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

  This starts your app in development mode, rebuilding assets on file changes.

## Testing

### Playwright

_(to-do)_

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

## Deployment

Check out our [deployment docs](docs/deploying.md).

## License

Remix Austin has adopted the [MIT license](https://github.com/remix-austin/remixaustin-com/blob/main/LICENSE.md) for the [remixaustin.com](https://remixaustin.com) website.
