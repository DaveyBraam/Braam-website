import test from 'node:test';
import assert from 'node:assert/strict';
import { connectionCues } from '../app/concept-product/cv-ketels/connection-cues.ts';

for (const [name, height, readingTop] of [['desktop',720,91],['mobile',844,391]]) {
  const at = scroll => connectionCues({ height, readingTop, radiatorTop: 1000-scroll, gasTop: 1600-scroll, gasBottom: 2050-scroll, nextTop: 2400-scroll });
  test(`${name}: connections first, radiator second, gas last, then no label`, () => {
    assert.deepEqual(at(0), {radiator:0,gas:0,exit:0});
    assert.equal(at(850).radiator,1);
    assert.equal(at(850).gas,0);
    assert.equal(at(1400).radiator,0);
    assert.equal(at(1400).gas,1);
    assert.equal(at(2100).gas,0);
    assert.ok(at(2100).exit>0);
  });
  test(`${name}: returning camera and gas label never overlap, forwards or backwards`, () => {
    const positions=Array.from({length:241},(_,i)=>i*10);
    const forward=positions.map(at);
    const backward=positions.toReversed().map(at).toReversed();
    assert.deepEqual(forward,backward);
    for (const cue of forward) {
      assert.equal(cue.radiator*cue.gas,0);
      assert.equal(cue.gas*cue.exit,0);
      for (const value of Object.values(cue)) assert.ok(value>=0&&value<=1);
    }
  });
}
