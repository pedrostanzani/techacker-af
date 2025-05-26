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
  exportToCSV: () => void
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
      exportToCSV: () => {
        const queries = get().queries
        const headers = [
          'ID',
          'URL',
          'Data',
          'Suspicious',
          'Domain',
          'PhishTank',
          'OpenPhish',
          'Numeric Substitution',
          'Excessive Subdomains',
          'Special Chars',
          'Dynamic DNS',
          'Domain Age',
          'Young Domain',
          'Brand Similarity',
          'Suspicious Redirects',
          'Suspicious SSL',
          'Suspicious Forms',
          'BERT Score'
        ].join(',')

        const rows = queries.map(query => [
          query.id,
          query.url,
          query.createdAt,
          query.result.suspicious,
          query.result.domain,
          query.result.in_phishtank,
          query.result.in_openphish,
          query.result.numeric_substitution,
          query.result.excessive_subdomains,
          query.result.special_chars_in_url,
          query.result.dynamic_dns,
          query.result.domain_age_days,
          query.result.young_domain,
          query.result.brand_similarity,
          query.result.suspicious_redirects,
          query.result.suspicious_ssl,
          query.result.suspicious_html_forms,
          query.result.bert_phishing_score
        ].map(value => `"${value}"`).join(','))

        const csvContent = [headers, ...rows].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `phishing-reports-${new Date().toISOString()}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }),
    {
      name: "phishing-detector-queries",
    },
  ),
)
