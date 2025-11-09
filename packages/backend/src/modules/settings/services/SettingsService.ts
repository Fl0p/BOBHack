import { Setting } from '../domain/Setting.js';
import { CreateSettingDto } from '../dto/CreateSettingDto.js';
import { RunSettingResultDto } from '../dto/RunSettingResultDto.js';
import { UpdateSettingDto } from '../dto/UpdateSettingDto.js';
import { SettingNotFoundError, ValidationError } from '../errors/SettingsError.js';
import { IDifyClient } from '../integration/IDifyClient.js';
import { ISettingsRepository } from '../repositories/ISettingsRepository.js';
import { ISettingsService } from './ISettingsService.js';

export class SettingsService implements ISettingsService {
  constructor(
    private readonly repository: ISettingsRepository,
    private readonly difyClient: IDifyClient
  ) {}

  async getSettings(): Promise<Setting[]> {
    return this.repository.findAll();
  }

  async getSetting(id: number): Promise<Setting> {
    const setting = await this.repository.findById(id);
    if (!setting) {
      throw new SettingNotFoundError(id);
    }
    return setting;
  }

  async createSetting(payload: CreateSettingDto): Promise<Setting> {
    this.validateCreatePayload(payload);
    return this.repository.create({
      difyApiKey: payload.difyApiKey.trim(),
      difyApiUrl: payload.difyApiUrl.trim(),
    });
  }

  async updateSetting(id: number, payload: UpdateSettingDto): Promise<Setting> {
    this.validateUpdatePayload(payload);
    const updated = await this.repository.update(id, {
      difyApiKey: payload.difyApiKey?.trim(),
      difyApiUrl: payload.difyApiUrl?.trim(),
    });

    if (!updated) {
      throw new SettingNotFoundError(id);
    }

    return updated;
  }

  async deleteSetting(id: number): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new SettingNotFoundError(id);
    }
  }

  async runSetting(id: number): Promise<RunSettingResultDto> {
    const setting = await this.getSetting(id);
    const invocation = await this.difyClient.invoke(setting.difyApiUrl, setting.difyApiKey);

    return {
      settingId: setting.id,
      difyStatus: invocation.statusCode,
      executedAt: new Date().toISOString(),
      difyResponse: invocation.response,
    };
  }

  private validateCreatePayload(payload: CreateSettingDto): void {
    if (!payload.difyApiKey?.trim()) {
      throw new ValidationError('difyApiKey is required');
    }
    if (!payload.difyApiUrl?.trim()) {
      throw new ValidationError('difyApiUrl is required');
    }
    this.ensureValidUrl(payload.difyApiUrl);
  }

  private validateUpdatePayload(payload: UpdateSettingDto): void {
    if (!payload.difyApiKey && !payload.difyApiUrl) {
      throw new ValidationError('Provide at least one field to update');
    }

    if (payload.difyApiKey !== undefined && !payload.difyApiKey.trim()) {
      throw new ValidationError('difyApiKey cannot be empty');
    }

    if (payload.difyApiUrl !== undefined) {
      if (!payload.difyApiUrl.trim()) {
        throw new ValidationError('difyApiUrl cannot be empty');
      }
      this.ensureValidUrl(payload.difyApiUrl);
    }
  }

  private ensureValidUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new ValidationError('difyApiUrl must be a valid URL');
    }
  }
}
