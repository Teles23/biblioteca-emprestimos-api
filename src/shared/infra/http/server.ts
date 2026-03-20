import { env } from '../../../config/env';

import { app } from './app';
import { startKeepAlive } from './keepAlive';

app.listen(env.port, () => {
  console.log(`🚀 Server started on port ${env.port}`);
  startKeepAlive();
});
