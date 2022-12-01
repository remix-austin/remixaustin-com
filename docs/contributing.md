# Contributing to RemixAustin.com

Thank you for wanting to contribute! This site is in its infancy and we're not quite ready for contributions beyond our core team 😐

You can, however, [create an issue](https://github.com/remix-austin/remixaustin-com/issues) to alert of us about any bugs or desired features!

## Setup

Before you can contribute to the codebase, you will need to fork the repo.

1. Fork the repo (click the <kbd>Fork</kbd> button at the top right of [this page][this-page])

2. Clone your fork locally

   ```bash
   # in a terminal, cd to parent directory where you want your clone to be, then
   git clone https://github.com/<your_github_username>/remixaustin-com.git
   cd remixaustin-com
   ```

3. Install dependencies by running `npm i`.

4. Start the dev server with `npm run dev`

## Sign your commits

- [About commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
- [Signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)

**Tips:**

To configure your Git client to sign commits by default for a local repository, in Git versions 2.0.0 and above, run git config commit.gpgsign true. To sign all commits by default in any local repository on your computer, run git config --global commit.gpgsign true.

To store your GPG key passphrase so you don't have to enter it every time you sign a commit, we recommend using the following tools:

For Mac users, the GPG Suite allows you to store your GPG key passphrase in the Mac OS Keychain.
For Windows users, the Gpg4win integrates with other Windows tools.
You can also manually configure gpg-agent to save your GPG key passphrase, but this doesn't integrate with Mac OS Keychain like ssh-agent and requires more setup.

## Think You Found a Bug?

Please [create an issue](https://github.com/remix-austin/remixaustin-com/issues) in GitHub.

## Making a Pull Request?

Cool, thanks!

### Tests

All commits that fix bugs or add features need a test.

`<blink>`Do not merge code without tests!`</blink>`

```bash
npm run test
```
