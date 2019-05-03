import mongodb, { ObjectID } from 'mongodb'

export default class BucketRepository {
  bucket: mongodb.GridFSBucket
  constructor (db: mongodb.Db) {
    this.bucket = new mongodb.GridFSBucket(db, { bucketName: 'songs' })
  }
  getDownloadStream (trackID: ObjectID): mongodb.GridFSBucketReadStream {
    return this.bucket.openDownloadStream(trackID)
  }
  getUploadStream (trackName: string): mongodb.GridFSBucketWriteStream {
    return this.bucket.openUploadStream(trackName)
  }
}
