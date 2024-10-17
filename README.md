![FlyByWire Simulations](https://raw.githubusercontent.com/flybywiresim/branding/refs/heads/master/tails-with-text/FBW-Color-Light.svg#gh-dark-mode-only)
![FlyByWire Simulations](https://raw.githubusercontent.com/flybywiresim/branding/refs/heads/master/tails-with-text/FBW-Color-Dark.svg#gh-light-mode-only)

# FlyByWire Simulations Aircraft Large Files

### Requirements

- git client
- NodeJS with pnpm

### Initial Setup

Clone the repository either individually or as a submodule of the aircraft repository. Then run `pnpm install`.

### Modifying a large file

Run `pnpm unchunk` to combine the files that are stored in chunks of maximum 100MiB.

To commit a change, simply create a commit. The pre-commit hook will automatically run `pnpm chunk` to split large files.
