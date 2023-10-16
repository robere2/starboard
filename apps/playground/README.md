# `playground`

This is a safe development environment to test your code in while developing. All files are git-ignored in this
directory, except `README.md` and `package.json`. You may create an entrypoint at `index.ts`, allowing you to
then use `turbo pg` to run your playground (Bun runtime, file watching enabled). The required `package.json` is
provided, but please do not commit changes to it if you install additional packages.


