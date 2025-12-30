import 'dotenv/config';
import connectDB from './config/db.js';
import scrapeOldestArticles from './scraper/scrapeOldestArticles.js';
import app from './app.js';

await connectDB();
await scrapeOldestArticles();

app.listen(3000,()=>{
  console.log('Server running on port 3000');
});
