import { Setting } from '../domain/Setting.js';
import { CreateSettingDto } from '../dto/CreateSettingDto.js';
import { UpdateSettingDto } from '../dto/UpdateSettingDto.js';

export interface ISettingsRepository {
  findAll(): Promise<Setting[]>;
  findById(id: number): Promise<Setting | null>;
  create(data: CreateSettingDto): Promise<Setting>;
  update(id: number, data: UpdateSettingDto): Promise<Setting | null>;
  delete(id: number): Promise<boolean>;
}
