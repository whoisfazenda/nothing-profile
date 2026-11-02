import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
await build({entryPoints:['tests/render.test.ts'],outfile:'.test-output/render-check.mjs',platform:'node',format:'esm',bundle:true,plugins:[{name:'raw-files',setup(b){b.onResolve({filter:/\?raw$/},a=>({path:resolve(a.resolveDir,a.path.replace(/\?raw$/,'')),namespace:'raw'}));b.onLoad({filter:/.*/,namespace:'raw'},a=>({contents:readFileSync(a.path,'utf8'),loader:'text'}))}}]});
const result=spawnSync(process.execPath,['.test-output/render-check.mjs'],{stdio:'inherit'});
process.exitCode=result.status??1;
