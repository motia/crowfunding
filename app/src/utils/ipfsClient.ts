// @ts-ignore
import * as IpfsHttpClient from "ipfs-http-client";

const ipfsConfig = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
  ? { host: 'localhost', port: 500 }
  : { host: 'ipfs.infura.io', port: 5001, protocol: 'https' };
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
