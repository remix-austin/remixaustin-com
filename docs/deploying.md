# Deployment

Deploying to staging & production environments is automated via GitHub Actions.

## Deploying the website to staging

Some changes may require deploying to staging so they can be previewed before they go to prod. This won't be necessary for every PR, and it's easy to run up the hosting bill!

- When a PR is labeled with `staging`, it will create a staging environment & url, and keep it updated as you push new code
- The staging url will be posted as a comment to the PR _(it will look something like `https://remixaustin-com-pr-123.fly.dev/`)_

    <img width="500" alt="image" src="https://user-images.githubusercontent.com/707463/212535337-9d906636-cc9b-41b4-991c-63ca9688df52.png">

- When the PR is closed or merged to `main`, or if the `staging` label is removed, the GitHub environment & Fly.io deployment will be cleaned up automatically _(gotta save 💵!)_

- ⚠️ ... and speaking of 💵, **please don't leave staging PRs/deployments open forever, it could get expensive**. Consider not leaving it deployed to staging for more than a few days. And you can always un-label it to clean things up, and add the label again when you're ready to preview!

- A comment will be posted to the PR to notify the GitHub environment & Fly.io deployment was cleaned up.
  <img width="500" alt="image" src="https://user-images.githubusercontent.com/707463/212535476-3e50ad10-48e1-48b0-ab3d-408d914e592c.png">

### Under the hood

- The depoyment workflows use a new GitHub App developed specifically for this repo's CI/CD, and generates a fresh JWT on each workflow's run.
- Search engine robots are automatically disabled on PR deployments _(Example: https://remixaustin-com-pr-123.fly.dev/robots.txt)_

  ```
  User-agent: *
  Disallow: /
  ```

## Deploying the website to production

When a PR is merged into the `main` branch, the app will automatically be deployed to the production environment.
