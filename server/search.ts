export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface SearchProvider {
  search(query: string, depth: 'fast' | 'deep'): Promise<SearchResult[]>;
}

export class TavilySearchProvider implements SearchProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Tavily API key is required");
    }
    this.apiKey = apiKey;
  }

  async search(query: string, depth: 'fast' | 'deep'): Promise<SearchResult[]> {
    const isDeep = depth === 'deep';
    const body = {
      api_key: this.apiKey,
      query,
      search_depth: isDeep ? "advanced" : "basic",
      include_answer: false,
      include_raw_content: isDeep, // Deep mode returns raw HTML text
      max_results: isDeep ? 8 : 5
    };

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Tavily search failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    return data.results.map((r: any) => ({
      title: r.title,
      url: r.url,
      content: r.raw_content || r.content,
      score: r.score
    }));
  }
}

export function getSearchProvider(): SearchProvider {
  const providerType = process.env.SEARCH_PROVIDER || 'tavily';
  
  if (providerType === 'tavily') {
    return new TavilySearchProvider(process.env.TAVILY_API_KEY || '');
  }
  
  throw new Error(`Unsupported search provider: ${providerType}`);
}
