import { random as _random } from 'lodash'

class ObjectID {
  _id: number

  constructor(id: number | undefined = undefined) {
    this._id = id ?? _random(1000)
  }

  toString(): string {
    return this._id.toString()
  }
}

export function getObjectID(id: number | undefined = undefined): ObjectID {
  return new ObjectID(id)
}
