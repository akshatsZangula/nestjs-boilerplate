export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
};

export type AuthConfig = {
  secret?: string;
  expires?: string;
};

export type DatabaseConfig = {
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  maxConnections: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
};

export type SwaggerConfig = {
  enabled?: boolean;
  route?: string;
  username?: string;
  password?: string;
  port?: number;
};

export type FileConfig = {
  driver: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
  awsDefaultS3Url?: string;
  awsS3Region?: string;
  maxFileSize: number;
};

export type MailConfig = {
  port: number;
  host?: string;
  user?: string;
  password?: string;
  defaultEmail?: string;
  defaultName?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
};

export type RateLimiterConfig = {
  ttl: number;
  requests: number;
};

export type DashboardConfig = {
  username: string;
  password: string;
};

export type WorkerConfig = {
  host: string;
  port: number;
};

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  file: FileConfig;
  mail: MailConfig;
  swagger: SwaggerConfig;
  ratelimiter: RateLimiterConfig;
  dashboard: DashboardConfig;
  worker: WorkerConfig;
};
