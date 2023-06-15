export class MaxDistanceError extends Error {
  constructor() {
    super('Max distance reached.')
    this.name = 'MaxDistanceError'
  }
}