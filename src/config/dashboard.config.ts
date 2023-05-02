import { registerAs } from '@nestjs/config';
import { DashboardConfig } from './config.type';

export default registerAs<DashboardConfig>('dashboard', () => ({
  username: process.env.DASHBOARD_USERNAME
    ? process.env.DASHBOARD_USERNAME
    : 'admin',
  password: process.env.DASHBOARD_PASSWORD
    ? process.env.DASHBOARD_PASSWORD
    : '1234',
}));
