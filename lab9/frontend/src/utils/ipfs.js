const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

/**
 * Convert an IPFS URI to an HTTP gateway URL
 * @param {string} ipfsUri - e.g. "ipfs://QmHash/file.json"
 * @returns {string} HTTP gateway URL
 */
export function ipfsToHttp(ipfsUri) {
  if (!ipfsUri) return "";
  if (ipfsUri.startsWith("ipfs://")) {
    return ipfsUri.replace("ipfs://", IPFS_GATEWAY);
  }
  return ipfsUri;
}

/**
 * Fetch metadata JSON from IPFS
 * @param {string} ipfsUri
 * @returns {Promise<Object>}
 */
export async function fetchIPFSMetadata(ipfsUri) {
  const url = ipfsToHttp(ipfsUri);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch IPFS metadata: ${res.status}`);
  return res.json();
}
