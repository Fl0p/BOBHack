import { Router } from 'express';
import { SettingsController } from '../controllers/SettingsController.js';
import { DifyClient } from '../integration/DifyClient.js';
import { SettingsRepository } from '../repositories/SettingsRepository.js';
import { SettingsService } from '../services/SettingsService.js';

export const createSettingsRouter = (): Router => {
  const router = Router();
  const repository = new SettingsRepository();
  const difyClient = new DifyClient();
  const service = new SettingsService(repository, difyClient);
  const controller = new SettingsController(service);

  controller.registerRoutes(router);
  return router;
};
