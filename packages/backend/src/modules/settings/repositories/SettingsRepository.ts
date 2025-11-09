import { QueryResult } from 'pg';
import { getPool } from '../../../db.js';
import { Setting } from '../domain/Setting.js';
import { CreateSettingDto } from '../dto/CreateSettingDto.js';
import { UpdateSettingDto } from '../dto/UpdateSettingDto.js';
import { ISettingsRepository } from './ISettingsRepository.js';

type SettingRow = {
  id: number;
  dify_api_key: string;
  dify_api_url: string;
  created_at: Date;
  updated_at: Date;
};

export class SettingsRepository implements ISettingsRepository {
  private mapRow(row: SettingRow): Setting {
    return Setting.fromPersistence({
      id: row.id,
      difyApiKey: row.dify_api_key,
      difyApiUrl: row.dify_api_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async findAll(): Promise<Setting[]> {
    const result: QueryResult<SettingRow> = await getPool().query(
      `SELECT id, dify_api_key, dify_api_url, created_at, updated_at
       FROM settings
       ORDER BY id ASC`
    );

    return result.rows.map((row) => this.mapRow(row));
  }

  async findById(id: number): Promise<Setting | null> {
    const result: QueryResult<SettingRow> = await getPool().query(
      `SELECT id, dify_api_key, dify_api_url, created_at, updated_at
       FROM settings
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRow(result.rows[0]);
  }

  async create(data: CreateSettingDto): Promise<Setting> {
    const result: QueryResult<SettingRow> = await getPool().query(
      `INSERT INTO settings (dify_api_key, dify_api_url)
       VALUES ($1, $2)
       RETURNING id, dify_api_key, dify_api_url, created_at, updated_at`,
      [data.difyApiKey, data.difyApiUrl]
    );

    return this.mapRow(result.rows[0]);
  }

  async update(id: number, data: UpdateSettingDto): Promise<Setting | null> {
    const result: QueryResult<SettingRow> = await getPool().query(
      `UPDATE settings
       SET dify_api_key = COALESCE($1, dify_api_key),
           dify_api_url = COALESCE($2, dify_api_url),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, dify_api_key, dify_api_url, created_at, updated_at`,
      [data.difyApiKey ?? null, data.difyApiUrl ?? null, id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRow(result.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const result = await getPool().query(
      `DELETE FROM settings
       WHERE id = $1`,
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }
}
