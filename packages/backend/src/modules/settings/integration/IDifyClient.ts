export interface IDifyClient {
  invoke(endpoint: string, apiKey: string): Promise<DifyInvocationResult>;
}

export interface DifyInvocationResult {
  statusCode: number;
  response: unknown;
  headers: Record<string, string | undefined>;
}
