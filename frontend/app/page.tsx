"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ModernInput } from "@/components/ui/modern-input";
import { ModernButton } from "@/components/ui/modern-button";
import {
  ModernCard,
  ModernCardContent,
  ModernCardDescription,
  ModernCardHeader,
  ModernCardTitle,
} from "@/components/ui/modern-card";
import { ModernBadge } from "@/components/ui/modern-badge";
import {
  Search,
  AlertTriangle,
  Clock,
  ExternalLink,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { GitHub } from "@/components/icons/github";
import { ModernShieldIcon } from "@/components/icons/shield-icon";
import { useQueryStore } from "@/lib/store";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { queries, addQuery } = useQueryStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze URL");
      }

      const result = await response.json();
      const queryId = addQuery(url.trim(), result);
      router.push(`/report/${queryId}`);
    } catch (error) {
      console.error("Error analyzing URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryClick = (queryId: string) => {
    router.push(`/report/${queryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Hero Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,209,197,0.1),transparent_50%)] pointer-events-none" />

      <div className="pt-8 px-6">
        <div className="w-full mb-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <ModernShieldIcon className="h-12 w-12 mr-4" />
              </div>
              <div className="relative">
                <div className="absolute -top-1 -left-3 h-5 w-5 bg-teal-400 rounded-full flex items-center justify-center">
                  <Zap className="h-3 w-3 text-slate-900" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-50 to-slate-300 bg-clip-text text-transparent leading-[1.15]">
                  Detector de Phishing
                </h1>
              </div>
            </div>
            <Button
              asChild
              className="bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800/80"
              size="lg"
            >
              <a
                href="https://github.com/pedrostanzani/techacker-af"
                target="_blank"
              >
                <GitHub className="fill-white" />
                Ver no GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-6 pb-12">
        {/* Header - Full Width */}

        <div className="max-w-4xl mx-auto">
          {/* URL Analysis Form */}
          <ModernCard className="mb-6 overflow-hidden">
            <ModernCardHeader>
              <ModernCardTitle className="flex items-center text-2xl">
                <Search className="h-6 w-6 mr-3 text-teal-400" />
                Analizar URL
              </ModernCardTitle>
              <ModernCardDescription className="text-base">
                Insira um URL para realizar uma análise de segurança e detecção
                de ameaças.
              </ModernCardDescription>
            </ModernCardHeader>
            <ModernCardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <ModernInput
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 text-lg"
                    disabled={isLoading}
                  />
                  <ModernButton
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    loading={isLoading}
                    size="default"
                    className="min-w-[140px]"
                  >
                    {!isLoading && (
                      <>
                        Analizar
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </ModernButton>
                </div>
                <div className="text-sm text-slate-400 flex gap-2.5 items-center">
                  <div className="self-start">
                    <span className="inline-block w-2 h-2 bg-teal-400 rounded-full" />
                  </div>
                  <p>
                    As análises incluem verificações em bancos de dados de
                    ameaças, reputação de domínio, verificação SSL e detecção de
                    phishing com IA.
                  </p>
                </div>
              </form>
            </ModernCardContent>
          </ModernCard>

          {/* Recent Analyses */}
          {queries.length > 0 && (
            <ModernCard>
              <ModernCardHeader>
                <ModernCardTitle className="flex items-center text-xl">
                  <Clock className="h-5 w-5 mr-3 text-slate-400" />
                  Análises de segurança recentes
                </ModernCardTitle>
                <ModernCardDescription>
                  Clique em qualquer análise anterior para visualizar o
                  relatório
                </ModernCardDescription>
              </ModernCardHeader>
              <ModernCardContent>
                <div className="space-y-3">
                  {queries.slice(0, 10).map((query, index) => (
                    <div
                      key={query.id}
                      onClick={() => handleQueryClick(query.id)}
                      className="group relative flex items-center justify-between p-5 border border-slate-600/30 rounded-lg hover:border-slate-500/50 hover:bg-slate-800/30 cursor-pointer transition-all duration-150 hover:-translate-y-0.5"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationName: "fadeInUp",
                        animationDuration: "0.5s",
                        animationTimingFunction: "ease-out",
                        animationFillMode: "forwards",
                      }}
                    >
                      {/* Accent bar */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-all duration-150 ${
                          query.result.suspicious
                            ? "bg-gradient-to-b from-red-500 to-red-600"
                            : "bg-gradient-to-b from-emerald-500 to-emerald-600"
                        }`}
                      />

                      <div className="flex items-center space-x-4 flex-1 min-w-0 ml-4">
                        <div className="flex-shrink-0">
                          {query.result.suspicious ? (
                            <div className="relative">
                              <AlertTriangle className="h-6 w-6 text-red-400" />
                              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                            </div>
                          ) : (
                            <div className="relative">
                              <ModernShieldIcon className="h-6 w-6" />
                              <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-200 truncate group-hover:text-slate-50 transition-colors">
                            {query.url}
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            {format(
                              new Date(query.createdAt),
                              "d 'de' MMMM 'de' yyyy 'às' HH:mm",
                              { locale: ptBR }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ModernBadge
                          variant={
                            query.result.suspicious ? "destructive" : "success"
                          }
                          className="font-medium"
                        >
                          {query.result.suspicious ? "Suspeito" : "Seguro"}
                        </ModernBadge>
                        <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-teal-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </ModernCardContent>
            </ModernCard>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
