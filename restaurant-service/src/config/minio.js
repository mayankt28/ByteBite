// import { Client } from 'minio';

// export const minioClient = new Client({
//   endPoint: process.env.MINIO_ENDPOINT,
//   port: process.env.MINIO_PORT,
//   useSSL: false,
//   accessKey: process.env.MINIO_ACCESS_KEY,     
//   secretKey: process.env.MINIO_SECRET_KEY,    
// });


import { S3Client } from '@aws-sdk/client-s3';

export const minioClient = new S3Client({
  endpoint: 'http://minio:9000', 
  region: 'us-east-1',          
  forcePathStyle: true,         
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
});

