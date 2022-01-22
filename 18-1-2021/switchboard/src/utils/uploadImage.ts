import { BlobServiceClient, BlockBlobTier, StorageSharedKeyCredential } from '@azure/storage-blob';
import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { v4 } from 'uuid';
import config from 'config';

const account:string = config.get('storage_account');
const accountKey:string = config.get('storage_account_key');
const defaultAzureCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, defaultAzureCredential);

// const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
// const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

const getContainerForBlobStorage = async () => {
  const containerId = process.env.container_name || '';

  const containerClient = blobServiceClient.getContainerClient(containerId);
  const res = await containerClient.createIfNotExists();

  return containerClient;
};

export const uploadImage = async (element: any) => {
  const containerClient = await getContainerForBlobStorage();

  const blobName = v4() + '' + (element?.name ?? ' ').trim();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const uploadBlobResponse = await blockBlobClient.uploadFile(element.path, {
    metadata: { type: element.type, name: element.name },
    onProgress: (progress) => {
      console.log('progress', progress);
    }
  });
  await blockBlobClient.setMetadata({ type: element.type, name: element.name });
  // await blockBlobClient.setImmutabilityPolicy({ policyMode: 'Locked' });
  // await blockBlobClient.setAccessTier(BlockBlobTier.Hot);

  return blockBlobClient.url;
};

async function blobToString(blob: File) {
  return new Promise((resolve, reject) => {});
}

async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const chunks = [] as any[];
    readableStream.on('data', (data) => {
      chunks.push(data);
    });
    readableStream.on('end', () => {
      resolve(chunks);
    });
    readableStream.on('error', reject);
  });
}

async function streamToString(readableStream: NodeJS.ReadableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [] as string[];
    readableStream.on('data', (data) => {
      chunks.push(data.toString());
    });
    readableStream.on('end', () => {
      resolve(chunks.join(''));
    });
    readableStream.on('error', reject);
  });
}
