import { readFileSync } from "fs";

function getKnownPeerAddresses() {
  const peerAddressesFile = readFileSync("./known-peers.json");
  const peerAddresses = JSON.parse(peerAddressesFile);
  return peerAddresses;
}

const _getKnownPeerAddresses = getKnownPeerAddresses;
export { _getKnownPeerAddresses as getKnownPeerAddresses };
