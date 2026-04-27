# IPFS Secure Storage App

This app demonstrates **Client-Side Encryption** before uploading files to IPFS.

## Setup
1. Ensure IPFS daemon is running (`ipfs daemon`)
2. Install dependencies: `npm install`
3. Start Backend: `node main.js` (Port 3001)
4. Start Frontend: `npx serve .`

## How it Works
- **Encryption**: Happens in the browser using the Web Crypto API before the file is sent to the server.
- **Backend**: Only stores and retrieves the encrypted bytes. It never sees the plain text.
- **Decryption**: Happens in the browser after fetching the encrypted bytes from IPFS.

## Verification
To prove the file is encrypted on IPFS, run:
`ipfs cat <cid>`
You should see binary/gibberish data, not the original content.