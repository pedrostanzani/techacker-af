import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface URLAnalysis {
  url: string
  domain: string
  in_phishtank: boolean
  in_openphish: boolean
  numeric_substitution: boolean
  substituted_chars: string[] | null
  excessive_subdomains: boolean
  subdomain_count: number | null
  special_chars_in_url: boolean
  special_chars: string[] | null
  dynamic_dns: boolean
  dynamic_dns_provider: string | null
  domain_age_days: number | null
  young_domain: boolean | null
  brand_similarity: boolean
  similar_brand: string | null
  suspicious_redirects: boolean
  redirect_count: number | null
  final_domain: string | null
  suspicious_ssl: boolean
  ssl_issues: string[] | null
  suspicious_html_forms: boolean
  bert_phishing_score: number | null
  suspicious: boolean
}

export interface Query {
  id: string
  url: string
  result: URLAnalysis
  createdAt: string
}

interface QueryStore {
  queries: Query[]
  addQuery: (url: string, result: URLAnalysis) => string
  getQuery: (id: string) => Query | undefined
  clearQueries: () => void
}

export const useQueryStore = create<QueryStore>()(
  persist(
    (set, get) => ({
      queries: [],
      addQuery: (url: string, result: URLAnalysis) => {
        const id = Math.random().toString(36).substr(2, 9)
        const query: Query = {
          id,
          url,
          result,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          queries: [query, ...state.queries],
        }))
        return id
      },
      getQuery: (id: string) => {
        return get().queries.find((query) => query.id === id)
      },
      clearQueries: () => set({ queries: [] }),
    }),
    {
      name: "phishing-detector-queries",
    },
  ),
)
