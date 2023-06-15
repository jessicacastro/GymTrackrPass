export class MaxTimeLimitToCheckInError extends Error {
  constructor() {
    super('The check-in must be validated within 20 minutes after its creation.')
    this.name = 'MaxTimeLimitToCheckInError'
  }
}