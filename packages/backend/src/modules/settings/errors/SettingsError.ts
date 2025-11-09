export class SettingsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class SettingNotFoundError extends SettingsError {
  constructor(id: number) {
    super(`Setting with id ${id} not found`);
  }
}

export class ValidationError extends SettingsError {
  constructor(message: string) {
    super(message);
  }
}

export class DifyRequestError extends SettingsError {
  constructor(
    public readonly statusCode: number,
    public readonly details: unknown
  ) {
    super(`Dify request failed with status ${statusCode}`);
  }
}
