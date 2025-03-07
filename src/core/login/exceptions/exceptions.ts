export class AuthException extends Error {
  private _code: number | undefined;
  constructor(message: string | undefined | null) {
    super(message ?? 'An error occurred');
    this.name = 'AuthException';
  }

  public get code(): number | undefined {
    return this._code;
  }

  public set code(value: number | undefined) {
    this._code = value;
  }
}

export class UnconfirmedEmailException extends AuthException {
  constructor(message: string | undefined) {
    super(message);
    this.code = 1000;
    this.name = 'UnconfirmedEmailException';
  }
}

export class InvalidCredentialsException extends AuthException {
  constructor(message: string | undefined) {
    super(message);
    this.code = 1010;
    this.name = 'InvalidCredentialsException';
  }
}

export class UserNotFoundException extends AuthException {
  constructor(message: string | undefined) {
    super(message);
    this.code = 1020;
    this.name = 'UserNotFoundException';
  }
}

export class NobodyIsLoggedInException extends AuthException {
  constructor(message: string | undefined = 'Nobody is logged in') {
    super(message);
    this.code = 1030;
    this.name = 'NobodyIsLoggedInException';
  }
}
