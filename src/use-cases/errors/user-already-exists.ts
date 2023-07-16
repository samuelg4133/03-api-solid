export class UserAlreadyExistsError extends Error {
  public constructor() {
    super('E-mail already exists')
  }
}
