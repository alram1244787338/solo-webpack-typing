import { run } from './runner.mjs';

run().catch((err) => {
  console.error('Runner error:', err);
  process.exit(2);
});
