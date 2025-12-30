import * as cheerio from 'cheerio';

import client from '../utils/httpClient.js';
import Article from '../models/Article.js';

const BASE_URL='https://beyondchats.com/blogs/';

async function resolveLastPage(){
  const {data}=await client.get(BASE_URL);
  const $=cheerio.load(data);

  const pages=[BASE_URL];

  $('a.page-numbers').each((_,el)=>{
    const href=$(el).attr('href');
    if(href)pages.push(href);
  });

  return pages.at(-1);
}

async function scrapeArticleContent(url){
  const {data}=await client.get(url);
  const $=cheerio.load(data);

  const mainContent = $('.entry-content, .post-content, .article , .content, .article-content')
    .first()
    .clone();
  
  mainContent.find('script, style, nav, aside, .sidebar, .related-posts, .comments, .sharedaddy, .jp-relatedposts').remove();
  
  const content = mainContent.text().trim();
  
  return content || $('article').text().trim();
}

export default async function scrapeOldestArticles(){
  const lastPage=await resolveLastPage();
  const {data}=await client.get(lastPage);
  const $=cheerio.load(data);

  const nodes=$('article').toArray().slice(-5);

  for(const el of nodes){
    const title=$(el).find('h2 a').text().trim();
    const url=$(el).find('h2 a').attr('href');
    const excerpt=$(el).find('p').first().text().trim();

    if(await Article.exists({url}))continue;

    const content=await scrapeArticleContent(url);

    await Article.create({title,url,excerpt,content});
  }

  console.log('Pagination-safe scraping completed');
}
