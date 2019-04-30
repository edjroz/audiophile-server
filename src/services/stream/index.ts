import mongodb from 'mongodb'
import { ReadStream } from 'fs'

interface IBucketRepository {
  getSongStream (trackID: mongodb.ObjectID): mongodb.GridFSBucketReadStream
  writeSongStream (trackName: string): mongodb.GridFSBucketWriteStream
}

export default class StreamService {
// TODO: inject using typedi
  private bucket: IBucketRepository
  constructor (repository: IBucketRepository) {
    this.bucket = repository
  }

  streamSong (trackID: mongodb.ObjectID, res: ReadStream) {}
  uploadSong (trackName: string, res: ReadStream) {}
}
