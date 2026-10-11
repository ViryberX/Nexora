import { getSearchProvider } from './search.js';
import { getLLMProvider } from './llm.js';

export async function executeResearch(query: string, depth: 'fast' | 'deep') {
  const searchProvider = getSearchProvider();
  const llm = getLLMProvider();

  // 1. Fetch search results
  const searchResults = await searchProvider.search(query, depth);

  if (!searchResults || searchResults.length === 0) {
    throw new Error('No search results found. Please try a different query.');
  }

  // 2. Format context for LLM
  let contextText = '';
  searchResults.forEach((r, i) => {
    // Truncate individual source content if it's too long
    const content = r.content.length > 50000 ? r.content.substring(0, 50000) + '...' : r.content;
    contextText += `\n\n--- Source [${i + 1}] ---\nTitle: ${r.title}\nURL: ${r.url}\nContent:\n${content}`;
  });

  // Limit total context size to prevent exceeding LLM context limits (Gemini Flash can handle a lot, but for safety)
  if (contextText.length > 500000) {
    contextText = contextText.substring(0, 500000) + '\n\n[Context truncated]';
  }

  // 3. Synthesize answer with LLM
  const prompt = `
You are an expert research assistant. You are tasked with answering a user's query based strictly on the provided web search results.

User Query: "${query}"
Research Depth: ${depth.toUpperCase()}

Instructions:
- Write a comprehensive, objective answer.
- You must include inline citations pointing to the source number, like [1], [2], etc., immediately following the claim they support.
- If sources disagree or provide conflicting claims, point this out.
- Base your response ONLY on the provided sources. Do not invent facts or URLs.
- Format your response strictly as a JSON object (do not include markdown \`\`\`json wrappers, just the raw JSON text).

JSON Structure:
{
  "title": "A concise title for the research report",
  "summary": "An executive summary of the findings.",
  "sections": [
    {
      "heading": "Heading of the section",
      "content": "Paragraphs of content with citations like [1], [3]."
    }
  ],
  "sources": [
    {
      "id": 1, // Must match the source number in the provided context
      "title": "Title of the source",
      "url": "URL of the source",
      "domain": "Domain name of the source (e.g., example.com)"
    }
  ],
  "followUpQuestions": ["Question 1", "Question 2"]
}

Context Sources:
${contextText}
`;

  const response = await llm.generateCompletion(prompt);

  // Clean the response
  let cleaned = response.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
  if (cleaned.startsWith('```')) cleaned = cleaned.substring(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);

  try {
    const result = JSON.parse(cleaned.trim());
    
    // Validate and patch sources to ensure domains are correct
    if (result.sources && Array.isArray(result.sources)) {
      result.sources = result.sources.map((s: any) => {
        try {
          const urlObj = new URL(s.url);
          s.domain = urlObj.hostname.replace('www.', '');
        } catch {
          s.domain = 'unknown';
        }
        return s;
      });
    }

    // Add depth to result
    result.depth = depth;

    return result;
  } catch (err) {
    console.error('Failed to parse LLM JSON:', cleaned);
    throw new Error('AI failed to generate a correctly structured report.');
  }
}
