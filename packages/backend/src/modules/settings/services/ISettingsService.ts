import { Setting } from '../domain/Setting.js';
import { CreateSettingDto } from '../dto/CreateSettingDto.js';
import { RunSettingResultDto } from '../dto/RunSettingResultDto.js';
import { UpdateSettingDto } from '../dto/UpdateSettingDto.js';

export interface ISettingsService {
  getSettings(): Promise<Setting[]>;
  getSetting(id: number): Promise<Setting>;
  createSetting(payload: CreateSettingDto): Promise<Setting>;
  updateSetting(id: number, payload: UpdateSettingDto): Promise<Setting>;
  deleteSetting(id: number): Promise<void>;
  runSetting(id: number): Promise<RunSettingResultDto>;
}
