import { spawnSync } from 'node:child_process';
import { createServer } from 'vite';
for(const script of ['scripts/assets.mjs','scripts/renderer.mjs']) {
  const result=spawnSync(process.execPath,[script],{stdio:'inherit'});
  if(result.status!==0) process.exit(result.status||1);
}
const server=await createServer({server:{host:'127.0.0.1'}});
await server.listen();server.printUrls();
