import { Request, Response, Router } from 'express';
import { Setting } from '../domain/Setting.js';
import { RunSettingResultDto } from '../dto/RunSettingResultDto.js';
import { SettingResponseDto } from '../dto/SettingResponseDto.js';
import { CreateSettingDto } from '../dto/CreateSettingDto.js';
import { UpdateSettingDto } from '../dto/UpdateSettingDto.js';
import {
  DifyRequestError,
  SettingNotFoundError,
  SettingsError,
  ValidationError,
} from '../errors/SettingsError.js';
import { ISettingsService } from '../services/ISettingsService.js';

type AsyncHandler = (req: Request, res: Response) => Promise<void>;

export class SettingsController {
  constructor(private readonly service: ISettingsService) {}

  registerRoutes(router: Router): void {
    router.get('/', this.safeHandler(this.getAll));
    router.get('/:id', this.safeHandler(this.getById));
    router.post('/', this.safeHandler(this.createSetting));
    router.put('/:id', this.safeHandler(this.updateSetting));
    router.delete('/:id', this.safeHandler(this.deleteSetting));
    router.post('/:id/run', this.safeHandler(this.runSetting));
  }

  private safeHandler(handler: AsyncHandler): AsyncHandler {
    return async (req, res) => {
      try {
        await handler.call(this, req, res);
      } catch (error) {
        this.handleError(res, error);
      }
    };
  }

  private async getAll(_req: Request, res: Response): Promise<void> {
    const settings = await this.service.getSettings();
    res.json(settings.map((setting) => this.toResponse(setting)));
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const id = this.extractId(req);
    const setting = await this.service.getSetting(id);
    res.json(this.toResponse(setting));
  }

  private async createSetting(req: Request, res: Response): Promise<void> {
    const payload: CreateSettingDto = req.body;
    const created = await this.service.createSetting(payload);
    res.status(201).json(this.toResponse(created));
  }

  private async updateSetting(req: Request, res: Response): Promise<void> {
    const id = this.extractId(req);
    const payload: UpdateSettingDto = req.body;
    const updated = await this.service.updateSetting(id, payload);
    res.json(this.toResponse(updated));
  }

  private async deleteSetting(req: Request, res: Response): Promise<void> {
    const id = this.extractId(req);
    await this.service.deleteSetting(id);
    res.status(204).send();
  }

  private async runSetting(req: Request, res: Response): Promise<void> {
    const id = this.extractId(req);
    const runResult: RunSettingResultDto = await this.service.runSetting(id);
    res.json(runResult);
  }

  private extractId(req: Request): number {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError('id must be a positive integer');
    }
    return id;
  }

  private toResponse(setting: Setting): SettingResponseDto {
    return {
      id: setting.id,
      difyApiKey: setting.difyApiKey,
      difyApiUrl: setting.difyApiUrl,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
    };
  }

  private handleError(res: Response, error: unknown): void {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error instanceof SettingNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }

    if (error instanceof DifyRequestError) {
      res
        .status(error.statusCode)
        .json({ error: error.message, details: error.details });
      return;
    }

    if (error instanceof SettingsError) {
      res.status(500).json({ error: error.message });
      return;
    }

    console.error('Unexpected settings error', error);
    res.status(500).json({ error: 'Unexpected error' });
  }
}
