import multer from 'multer';
import multerS3 from 'multer-s3';
import { minioClient } from '../config/minio.js';
import { v4 as uuidv4 } from 'uuid';
import { HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3';

// Bucket Name (make sure bucket exists already)
export const bucketName = 'restaurant-images';

// Multer storage using MiniO
export const upload = multer({
  storage: multerS3({
    s3: minioClient,
    bucket: bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const filename = `${uuidv4()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
});

export const ensureBucketExists = async () => {
  try {
    await minioClient.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket '${bucketName}' already exists`);
  } catch (err) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      await minioClient.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`Bucket '${bucketName}' created`);
    } else {
      console.error('Error checking bucket:', err);
    }
  }
};


// Create the bucket if it doesn't exist
// export const ensureBucketExists = async () => {
//   const exists = await minioClient.bucketExists(bucketName);
//   if (!exists) {
//     await minioClient.makeBucket(bucketName);
//     console.log(`Bucket '${bucketName}' created`);
//   }
// };
