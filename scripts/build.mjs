import { spawnSync } from 'node:child_process';
for(const script of ['scripts/assets.mjs','scripts/renderer.mjs','node_modules/typescript/bin/tsc','node_modules/vite/bin/vite.js']) {
  const result=spawnSync(process.execPath,[script,...(script.includes('vite')?['build']:[])],{stdio:'inherit'});
  if(result.status!==0) process.exit(result.status||1);
}
