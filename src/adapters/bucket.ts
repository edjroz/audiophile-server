import mongodb from 'mongodb'

export default (db: any) => {
  const bucket = new mongodb.GridFSBucket(db, { bucketName: 'songs' })
  return {
    getReadStream(trackID: mongodb.ObjectID) {
      return bucket.openDownloadStream(trackID)
    },
    async addSong(trackName: string) {
      return bucket.openUploadStream(trackName)
    },
  }
}
