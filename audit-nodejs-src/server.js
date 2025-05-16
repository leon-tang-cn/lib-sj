const express = require('express');
const { initialTables } = require('./services/db');
const spyderPcajxx = require('./services/spyderPcajxx');
const commonRouter = require('./services/common');

(async () => {
  await initialTables();

  const app = express();

  const port = 3000;
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));
  app.use('/api', commonRouter);
  app.use('/api/spyderPcajxx', spyderPcajxx);

  app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
})();