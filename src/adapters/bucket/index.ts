import mongodb from 'mongodb'

export default class BucketRepository {
  bucket: mongodb.GridFSBucket
  constructor (db: mongodb.Db) {
    this.bucket = new mongodb.GridFSBucket(db, { bucketName: 'songs' })
  }
  getSongStream (trackID: mongodb.ObjectID): mongodb.GridFSBucketReadStream {
    return this.bucket.openDownloadStream(trackID)
  }
  writeSongStream (trackName: string): mongodb.GridFSBucketWriteStream {
    return this.bucket.openUploadStream(trackName)
  }
}
