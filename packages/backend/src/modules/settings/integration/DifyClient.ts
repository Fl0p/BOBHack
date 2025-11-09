import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { URL } from 'node:url';
import { DifyRequestError } from '../errors/SettingsError.js';
import { DifyInvocationResult, IDifyClient } from './IDifyClient.js';

export class DifyClient implements IDifyClient {
  constructor(private readonly defaultPayload: Record<string, unknown> = {}) {}

  async invoke(endpoint: string, apiKey: string): Promise<DifyInvocationResult> {
    const url = new URL(endpoint);
    const payload = JSON.stringify(this.defaultPayload);
    const requestFn = url.protocol === 'http:' ? httpRequest : httpsRequest;

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'http:' ? 80 : 443),
      path: `${url.pathname}${url.search}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    };

    return new Promise<DifyInvocationResult>((resolve, reject) => {
      const req = requestFn(options, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk));

        res.on('end', () => {
          const rawBody = Buffer.concat(chunks).toString('utf-8');
          let parsedBody: unknown = null;
          if (rawBody) {
            try {
              parsedBody = JSON.parse(rawBody);
            } catch {
              parsedBody = rawBody;
            }
          }

          const statusCode = res.statusCode ?? 500;
          const headers = Object.fromEntries(
            Object.entries(res.headers).map(([key, value]) => [
              key,
              Array.isArray(value) ? value.join(', ') : value,
            ])
          );

          if (statusCode >= 400) {
            reject(new DifyRequestError(statusCode, parsedBody));
            return;
          }

          resolve({
            statusCode,
            response: parsedBody,
            headers,
          });
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.write(payload);
      req.end();
    });
  }
}
