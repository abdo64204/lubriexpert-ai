/**
 * KnowledgeBaseService — Phase 1 placeholder for future RAG integration.
 *
 * ─────────────────────────────────────────────────────────────────────
 * CURRENT STATE (Phase 1):
 *   Returns empty results. The AI relies solely on its training data
 *   and the system prompt.
 *
 * FUTURE ROADMAP:
 *   Phase 2  → Connect vector database (Pinecone / Weaviate / pgvector)
 *   Phase 3  → Ingest official Mobil / ExxonMobil product data sheets
 *   Phase 4  → Add product catalog database
 *   Phase 5  → Add vehicle compatibility database (OEM specs)
 *   Phase 6  → Add industrial equipment database
 *   Phase 9  → PDF / data sheet upload and processing
 * ─────────────────────────────────────────────────────────────────────
 *
 * When connecting a real knowledge base:
 *   1. Implement the searchKnowledgeBase() method below
 *   2. Inject retrieved documents into the AI request context
 *   3. Update AIService.generateResponse() to include KB results
 */

export interface KnowledgeDocument {
  id: string;
  source: string;       // e.g., "Mobil 1 ESP 5W-30 Product Data Sheet"
  content: string;      // extracted relevant text
  relevanceScore: number;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeSearchResult {
  documents: KnowledgeDocument[];
  query: string;
}

class KnowledgeBaseService {
  /**
   * Search the knowledge base for documents relevant to the query.
   *
   * @param query   The user's question or relevant search terms
   * @returns       Matching documents sorted by relevance
   */
  async searchKnowledgeBase(query: string): Promise<KnowledgeSearchResult> {
    // Phase 1: stub — no documents available yet
    void query; // prevent unused variable warning
    return {
      documents: [],
      query,
    };
  }

  /** Returns true when the knowledge base is connected and ready */
  isAvailable(): boolean {
    return false; // Phase 1: not yet connected
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
