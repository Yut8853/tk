#!/usr/bin/env python3
"""Check local media references, gallery indices, and duplicate import records."""
import json
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.nodes = []
        self.data_blocks = {}
        self.block = None
        self.stack = []
        self.void = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.nodes.append((tag, attrs))
        if tag not in self.void:
            self.stack.append(tag)
        if tag == 'script' and attrs.get('type') == 'application/json':
            self.block = attrs['id']
            self.data_blocks[self.block] = ''
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.void:
            self.handle_endtag(tag)
    def handle_endtag(self, tag):
        assert self.stack and self.stack[-1] == tag, ('Unbalanced HTML', tag, self.stack[-5:])
        self.stack.pop()
        if tag == 'script':
            self.block = None
    def handle_data(self, value):
        if self.block:
            self.data_blocks[self.block] += value

page = Page()
page.feed((ROOT / 'index.html').read_text())
assert not page.stack, page.stack
works = json.loads(page.data_blocks['kz-works-data'])
videos = json.loads(page.data_blocks['kz-video-data'])
checked = set()

def check_path(value):
    if value.startswith('assets/'):
        path = ROOT / value.split("?", 1)[0]
        assert path.is_file() and path.stat().st_size > 0, value
        checked.add(value)

def walk(value):
    if isinstance(value, dict):
        for v in value.values(): walk(v)
    elif isinstance(value, list):
        for v in value: walk(v)
    elif isinstance(value, str): check_path(value)

walk(works)
walk(videos)
ids = []
for tag, attrs in page.nodes:
    for key in ('src', 'href', 'poster', 'data-background'):
        if key in attrs: check_path(attrs[key])
    if 'id' in attrs: ids.append(attrs['id'])
    if 'data-work' in attrs:
        group = works[attrs['data-work']]['items']
        assert 0 <= int(attrs.get('data-index', 0)) < len(group)
    if 'data-video-group' in attrs:
        group = videos[attrs['data-video-group']]
        assert 0 <= int(attrs.get('data-index', 0)) < len(group)
assert len(ids) == len(set(ids)), 'Duplicate IDs'
for tag, attrs in page.nodes:
    href = attrs.get('href', '')
    if href.startswith('#') and len(href) > 1:
        assert href[1:] in ids, ('Missing anchor target', href)
assert not any(tag == 'video' for tag, _ in page.nodes), 'Video should load only in the popup'
assert not any('loader-wrap' in attrs.get('class', '').split() for _, attrs in page.nodes)
assert not any(attrs.get('src', '').endswith(('smoother-script.js', 'ScrollSmoother.min.js', 'ScrollTrigger.min.js', 'gsap.min.js')) for _, attrs in page.nodes)

manifest = json.loads((ROOT / 'assets/data/banner-media.json').read_text())
assert len(manifest['items']) == 98
assert len(works['banners']['items']) == 74
assert len(videos['banners']) == 30
assert len({v['src'] for v in videos['banners']}) == 30
assert len({v['parts'][0]['src'] for v in works['banners']['items']}) == 74
for item in manifest['items']:
    if 'duplicate' in item:
        assert item['hash'] == manifest['items'][item['duplicate']]['hash']
    else:
        check_path(item['src'])
        if 'poster' in item: check_path(item['poster'])
        if 'thumb' in item: check_path(item['thumb'])
print(f'PASS: HTML structure, unique IDs, {len(checked)} local media/assets, gallery indices, 74 banners, 30 videos, 2 duplicate images.')
