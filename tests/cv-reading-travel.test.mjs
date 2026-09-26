import test from 'node:test';
import assert from 'node:assert/strict';
import { readingTravel } from '../app/concept-product/cv-ketels/reading-travel.ts';

for (const [name, stickyTop, readingLine] of [['desktop',120,91],['mobile short text',456,455],['mobile long text',180,455]]) {
  const holdEnd = stickyTop + 300;
  const nextTop = readingLine + 900;
  const at = scroll => readingTravel({holdEnd:holdEnd-scroll,stickyTop,nextTop:nextTop-scroll,readingLine});
  test(`${name}: camera holds throughout reading and reaches the next chapter without a jump`, () => {
    for (let scroll=0;scroll<=300;scroll+=10) assert.equal(at(scroll),0);
    assert.ok(at(301)<.000001);
    assert.equal(at(600),.5);
    assert.ok(at(899)>.999999);
    assert.equal(at(900),1);
    assert.equal(at(1000),1);
  });
  test(`${name}: travel is monotonic and reverses exactly`, () => {
    const positions=Array.from({length:101},(_,i)=>i*10);
    const forward=positions.map(at);
    assert.deepEqual(forward,positions.toReversed().map(at).toReversed());
    for(let i=1;i<forward.length;i++) assert.ok(forward[i]>=forward[i-1]);
  });
}
