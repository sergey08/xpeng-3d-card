import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/xpeng-3d-card.js','utf8');
new vm.Script(source,{filename:'xpeng-3d-card.js'});
for(const fragment of ["vehicle_model:'g6_2025'","model_urls:{}","syncProcedural()","tickProcedural()","disconnectedCallback()","getConfigElement()"]) {
  assert.ok(source.includes(fragment),'Missing expected feature: '+fragment);
}
assert.ok(source.includes("g6_2024"),'Older model profile missing');
console.log('XPeng 3D Card: syntax and configuration smoke tests passed.');
