import test from 'node:test';
import assert from 'node:assert/strict';
import { storyFrame, shots, cinematicCamera } from '../app/warmtepompen-test/story-timeline.ts';

test('hybrid to electric exchanges only the boiler and cylinder', () => {
  const start = storyFrame(2);
  for (const progress of [2, 2.1, 2.3, 2.5, 2.9, 3]) {
    const current = storyFrame(progress);
    for (const id of [0, 1, 4]) assert.deepEqual(current.models[id], start.models[id]);
    assert.equal(shots[current.index].angle, shots[2].angle);
  }
  assert.equal(storyFrame(2).models[2].opacity, 1);
  assert.equal(storyFrame(2).models[3].opacity, 0);
  assert.equal(storyFrame(3).models[2].opacity, 0);
  assert.equal(storyFrame(3).models[3].opacity, 1);
});
test('same scroll position produces same composition in either direction', () => {
  const points = [0, .2, .7, 1, 2.4, 3.2, 4, 5.5, 6];
  const forward = points.map(storyFrame);
  const backward = [...points].reverse().map(storyFrame).reverse();
  assert.deepEqual(forward, backward);
  for (let progress=0; progress<=6; progress+=.025) for (const model of storyFrame(progress).models) {
    assert.ok(Number.isFinite(model.x) && Number.isFinite(model.y));
    assert.ok(model.opacity >= 0 && model.opacity <= 1);
  }
});
test('buffer moves from system position into the close-up without disappearing', () => {
  const start = storyFrame(3).models[4], end = storyFrame(4).models[4];
  assert.notEqual(start.x, end.x);
  for (const progress of [3, 3.25, 3.5, 3.75, 4]) assert.equal(storyFrame(progress).models[4].opacity, 1);
});

test('boiler and cylinder crossfade without an opacity gap', () => {
  for (let p=2; p<=3; p+=.01) {
    const models=storyFrame(p).models;
    assert.ok(Math.abs(models[2].opacity+models[3].opacity-1)<1e-8);
    for(const id of [0,1,4]) assert.equal(models[id].visible,true);
  }
});

test('the working-principle chapter already contains the complete hybrid installation', () => {
  for (const id of [0,1,2,4]) {
    assert.equal(storyFrame(1).models[id].opacity,1);
    assert.equal(storyFrame(1).models[id].visible,true);
  }
  assert.equal(storyFrame(1).models[3].visible,false);
});

test('both vessels remain whole and visible from electric setup into comparison', () => {
  for (let p=3; p<=4; p+=.05) for (const id of [3,4]) assert.equal(storyFrame(p).models[id].opacity,1);
  const frame=storyFrame(4);
  assert.ok(frame.models[4].x < frame.models[3].x);
  assert.ok(Math.abs((frame.models[4].y-.939/2)-(frame.models[3].y-1.75/2))<.01);
  assert.equal(frame.labels,1);
});
test('cinematic camera holds comparison still and returns detail orbit to its endpoint', () => {
  for (const p of [1,2,2.5,3]) assert.deepEqual(cinematicCamera(p,0),cinematicCamera(p,.5));
  for (const p of [0,4,5]) {
    assert.deepEqual(cinematicCamera(p,0),cinematicCamera(p,1));
    assert.notEqual(cinematicCamera(p,0).angle,cinematicCamera(p,.5).angle);
  }
});
