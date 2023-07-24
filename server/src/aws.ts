import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import dotenv from 'dotenv';
import fs from 'fs'

dotenv.load();

AWS.config.update({
  accessKeyId: process.env.AWS_keyid,
  secretAccessKey: process.env.AWS_secretkey,
  region: process.env.AWS_region,
});
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const Bucket = process.env.EXPENSE_BUCKET;

// return type of object with uploadUrl as string

export const getSignedUrl = async (filename: string):
  Promise<{ uploadURL: string, key: string }> => {
  // exports.getSignedUrl = async(filename): ({ uploadUrl: string, key: string }) => {
  // Get signed URL from S3
  const key = filename + (Math.random() * 10000000);
  const s3Params = {
    Bucket,
    Key: key,
    ContentType: 'image/jpeg',
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
  console.log(s3Params, { uploadURL }); // check

  return ({ uploadURL, key });
};

export const addPhoto = (name): Promise<PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>> => {
  const params = {
    Bucket: process.env.EXPENSE_BUCKET,
    Key: name,
    Body: fs.readFileSync(`./receipts/${name}.png`),
    ContentType: 'image/png',
  };

  return s3.putObject(params).promise();
};

export const receipt = async (key) => {
  const params = {
    Bucket,
    Key: key,
  };

  return s3.getObject(params).promise();
};
