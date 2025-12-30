import {describe,it,expect,beforeAll,afterAll} from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import {setupDB,teardownDB} from './setup.js';

beforeAll(async()=>{
  await setupDB();
});

afterAll(async()=>{
  await teardownDB();
});

describe('Articles API',()=>{
  it('GET /api/articles returns array',async()=>{
    const res=await request(app).get('/api/articles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
