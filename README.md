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

## License

Original source code assets present in this repository are licensed under the GNU GPLv3.
Original 3D assets are licensed under CC BY-NC 4.0.

Microsoft Flight Simulator © Microsoft Corporation. The FlyByWire Simulations A32NX was created under Microsoft's "Game Content Usage Rules" using assets from Microsoft Flight Simulator, and it is not endorsed by or affiliated with Microsoft.

The contents of distribution packages built from the sources in this repository are therefore licensed as follows:

- in the case of original source code from FBW or compiled artifacts generated from it, under GPLv3.
- in the case of original 3D assets from FBW, under CC BY-NC 4.0.
- in the case of assets covered by the "Game Content Usage Rules", under the license granted by those rules.
