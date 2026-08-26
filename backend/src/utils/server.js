const app = require('../app');
const env = require('../config/env');

app.listen(env.PORT, () => {
  console.log(`Tech Archive server is listening on port ${env.PORT}`);
});
