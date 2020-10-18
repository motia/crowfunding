// @ts-ignore
import * as IpfsHttpClient from "ipfs-http-client";

const ipfsConfig = {
  host: process.env.REACT_APP_IPFS_HOST || 'ipfs.infura.io',
  port: process.env.REACT_APP_IPFS_PORT || 5001,
  protocol: process.env.REACT_APP_IPFS_SCHEME || 'https'
};
const ipfs = IpfsHttpClient(ipfsConfig);
// @ts-ignore
window.ipfs = ipfs;

interface IpfsFile {
  path: string;
  cid: string;
  size: number;
}

export const uploadMdToIpfs = async (markdownSrc: string) => {
  return (await ipfs.add({content: markdownSrc})) as IpfsFile
}

export const readMdFromIpfs = async (cid: string) => {
  return await (ipfs.cat(cid));
}
