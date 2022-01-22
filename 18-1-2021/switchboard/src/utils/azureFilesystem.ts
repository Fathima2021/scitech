import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

const account = 'litdev01stor';
const accountKey = 'aeK38soZmcLSDTZPc3zMD03Dc2jvntWld7hKPFhU+w2SliXwK384/H23mDQpqWwhlsFHOOYxhT1sOf4BIiJ76w==';
const defaultAzureCredential = new StorageSharedKeyCredential(account, accountKey);

const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, defaultAzureCredential);

const containerName = 'hello';
const containerClient = blobServiceClient.getContainerClient(containerName);

const uploadFile = async (filePath: string, fileName: string) => {
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  return uploadBlobResponse.requestId;
};

const deleteFile = async (fileName: string) => {
  const data = await containerClient.getBlockBlobClient(fileName).deleteIfExists();
  return data.requestId;
};

const checkIfFileExist = async (fileName: string) => {
  return containerClient.getBlockBlobClient(fileName).exists();
};

export { uploadFile, deleteFile, checkIfFileExist };
