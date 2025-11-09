export interface SettingProps {
  id: number;
  difyApiKey: string;
  difyApiUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Setting {
  private constructor(private readonly props: SettingProps) {}

  static fromPersistence(raw: SettingProps): Setting {
    return new Setting({
      ...raw,
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
    });
  }

  get id(): number {
    return this.props.id;
  }

  get difyApiKey(): string {
    return this.props.difyApiKey;
  }

  get difyApiUrl(): string {
    return this.props.difyApiUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  withUpdates(partial: Partial<Omit<SettingProps, 'id'>>): Setting {
    return new Setting({
      ...this.props,
      ...partial,
      updatedAt: partial.updatedAt ?? new Date(),
    });
  }
}
