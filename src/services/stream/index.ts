import mongodb from 'mongodb'
import { ServerResponse } from 'http'

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

  // TODO: use interface for the response object
  // It's meant to be abstract from any implementation of server
  streamSong (trackID: mongodb.ObjectID, res: ServerResponse) {
    return res
  }
  uploadSong (trackName: string, res: ServerResponse) {
    return res
  }
}
