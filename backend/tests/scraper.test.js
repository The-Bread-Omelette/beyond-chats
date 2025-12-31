import {describe,it,expect,vi} from 'vitest';

vi.mock('axios', () => {
  const mockInterceptors = {
    request: {
      use: vi.fn(),
      eject: vi.fn(),
      clear: vi.fn()
    },
    response: {
      use: vi.fn(),
      eject: vi.fn(),
      clear: vi.fn()
    }
  };

  const mockInstance = {
    get: vi.fn().mockResolvedValue({
      data: '<article><p>Full content</p></article>'
    }),
    interceptors: mockInterceptors,
    defaults: {
      headers: {}
    }
  };

  return {
    default: {
      create: vi.fn(() => mockInstance)
    }
  };
});

vi.mock('../src/models/Article.js',()=>{
  return {
    default:{
      exists:vi.fn().mockResolvedValue(false),
      create:vi.fn().mockResolvedValue({})
    }
  };
});

import scrapeOldestArticles from '../src/scraper/scrapeOldestArticles.js';

const mockClient={
  get:async()=>( {
    data:`
      <article>
        <h2><a href="https://test.com/a">Test</a></h2>
        <p>Excerpt</p>
      </article>
    `
  })
};

describe('Scraper',()=>{
  it('runs without throwing',async()=>{
    await expect(
      scrapeOldestArticles(mockClient)
    ).resolves.not.toThrow();
  });
});
