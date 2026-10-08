// Exercise the actual gallery handlers with a minimal DOM, without browser dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const galleries = [...html.matchAll(/<div class="kz-media-gallery"[\s\S]*?<div class="kz-gallery-more-wrap">[\s\S]*?<\/div>/g)].map(([markup]) => {
  let focused = null;
  const cards = [...markup.matchAll(/<article class="kz-media-card" data-brand="([^"]+)"/g)].map(([, brand]) => ({
    dataset: { brand }, hidden: false,
    querySelector() { return { focus() { focused = this; } }; }
  }));
  function control() { return { events: {}, addEventListener(type, fn) { this.events[type] = fn; } }; }
  const filter = { ...control(), value: 'all' };
  const more = { ...control(), hidden: true };
  const count = {};
  return { cards, filter, more, count, getFocused: () => focused,
    dataset: { pageSize: '12' },
    querySelectorAll() { return cards; },
    querySelector(selector) { return { '.kz-gallery-filter': filter, '.kz-gallery-more': more, '.kz-gallery-count': count }[selector]; }
  };
});
assert.deepEqual(galleries.map(g => g.cards.length), [74, 30]);
const noop = new Proxy({}, { get: () => () => noop });
const handlers = new Map();
let opened = null;
let closed = false;
const $ = arg => {
  if (typeof arg === 'function') return arg();
  if (arg && arg.dataset) return { data: key => arg.dataset[key] };
  return new Proxy({}, { get: (_, key) => {
    if (key === 'on') return (event, selector, fn) => {
      if (typeof selector === 'string' && fn) handlers.set(event + ':' + selector, fn);
      return noop;
    };
    return () => noop;
  }});
};
$.magnificPopup = { open: (options, index) => { opened = { options, index }; }, close: () => { closed = true; } };
const document = {
  getElementById(id) { return { textContent: html.match(new RegExp('id="' + id + '">([\\s\\S]*?)</script>'))[1] }; },
  querySelectorAll() { return galleries; }, querySelector() { return null; }, addEventListener() {}
};
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js/portfolio.js'), 'utf8'), {
  $, document, window: { matchMedia: () => ({ matches: true }), ScrollTrigger: { refresh() {} } }, Set
});
for (const g of galleries) {
  const visible = () => g.cards.filter(c => !c.hidden);
  assert.equal(visible().length, 12);
  assert.equal(g.more.hidden, false);
  g.more.events.click();
  assert.equal(visible().length, 24);
  assert.ok(g.getFocused(), 'Newly revealed card receives focus');
  for (const brand of new Set(g.cards.map(c => c.dataset.brand))) {
    g.filter.value = brand; g.filter.events.change();
    const expected = g.cards.filter(c => c.dataset.brand === brand);
    assert.equal(visible().length, Math.min(12, expected.length));
    assert.ok(visible().every(c => c.dataset.brand === brand));
    while (!g.more.hidden) g.more.events.click();
    assert.equal(visible().length, expected.length);
    assert.equal(g.count.textContent, `${expected.length} / ${expected.length}点`);
  }
  g.filter.value = 'all'; g.filter.events.change();
  assert.equal(visible().length, 12, 'Changing filters resets pagination');
  while (!g.more.hidden) g.more.events.click();
  assert.equal(visible().length, g.cards.length);
}
console.log('PASS: both galleries, all brands, pagination, counts, focus, reset, and final-page button state.');

function click(selector, dataset) {
  let prevented = false;
  handlers.get('click:' + selector).call({ dataset }, { preventDefault() { prevented = true; } });
  assert.ok(prevented, 'Media click must prevent navigating away from the page');
}
click('[data-work]', { work: 'banners', index: 73 });
assert.equal(opened.index, 73);
assert.equal(opened.options.items.length, 74);
assert.ok(opened.options.items[73].src.includes('banner-listerine.webp'));
click('[data-video-group]', { 'video-group': 'banners', index: 29 });
assert.equal(opened.index, 29);
assert.equal(opened.options.items.length, 30);
assert.ok(opened.options.items[29].src.includes('<video'));
const selected = JSON.parse(document.getElementById('kz-video-data').textContent).banners[29];
assert.ok(opened.options.items[29].src.includes(selected.src));
handlers.get('click:.kz-viewer .kz-close')();
assert.ok(closed);
console.log('PASS: banner/video clicks stay on the page, select the requested item, and close the viewer.');
