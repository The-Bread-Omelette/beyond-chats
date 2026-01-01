import Groq from 'groq-sdk';
import config from '../config/services.js';
import logger from '../utils/logger.js';

const groq = new Groq({
  apiKey: config.groq.apiKey
});

export async function enhanceArticle(original, competingArticles) {
  try {
    // Only include up to two competing articles in the prompt and references
    const topTwo = (Array.isArray(competingArticles) ? competingArticles.slice(0, 2) : []).map(c => ({
      title: c.title,
      url: c.url,
      textContent: c.textContent || c.content || ''
    }));

    const references = topTwo.map((c, i) => `[${i + 1}] ${c.title} - ${c.url}`).join('\n');

    const prompt = buildEnhancementPrompt(original, topTwo, references);

    logger.info(`Enhancing article with Groq: ${original.title}`);

    const completion = await groq.chat.completions.create({
      model: config.groq.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert content strategist specializing in SEO-optimized article rewriting. You analyze top-ranking articles and enhance content to match their quality and style.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: config.groq.maxTokens,
      temperature: config.groq.temperature
    });

    const enhancedContent = completion.choices[0].message.content;

    logger.info(`Successfully enhanced article: ${original.title}`);

    return {
      content: enhancedContent,
      references: topTwo.map(c => ({ title: c.title, url: c.url }))
    };

  } catch (error) {
    logger.error('Groq enhancement failed', { 
      article: original.title, 
      error: error.message 
    });
    throw new Error(`Enhancement failed: ${error.message}`);
  }
}

function buildEnhancementPrompt(original, competing, references) {
  return `You are rewriting an article to match the quality and style of top-ranking Google search results.

ORIGINAL ARTICLE:
Title: ${original.title}
Content: ${original.content}

TOP-RANKING COMPETING ARTICLES:
${competing.map((c, i) => `
Article ${i + 1}:
Title: ${c.title}
URL: ${c.url}
Content Preview: ${c.textContent.substring(0, 2000)}
`).join('\n---\n')}

YOUR TASK:
Rewrite the original article by:
1. Matching the formatting style, tone, and structure of the competing articles
2. Improving content depth, clarity, and engagement
3. Using proper markdown formatting (# headers, **bold**, *italic*, lists)
4. Maintaining factual accuracy from the original content
5. Incorporating SEO best practices observed in competitors
6. Making it comprehensive yet easy to scan

OUTPUT REQUIREMENTS:
- Return ONLY the rewritten article (no preamble like "Here's the rewritten article...")
- Use clean markdown syntax
- End with a "## References" section containing:
${references}
- Target length: 800-1500 words
- Professional, natural tone (not robotic or overly formal)

Begin the rewritten article now:`;
}