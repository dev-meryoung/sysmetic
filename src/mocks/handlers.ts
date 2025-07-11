import { adminHandlers } from './handlers/admin';
import { authHandlers } from './handlers/auth';
import { commonHandlers } from './handlers/common';
import { followHandlers } from './handlers/follow';
import { strategyHandlers } from './handlers/strategy';
import { userHandlers } from './handlers/user';

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...strategyHandlers,
  ...adminHandlers,
  ...commonHandlers,
  ...followHandlers,
];
