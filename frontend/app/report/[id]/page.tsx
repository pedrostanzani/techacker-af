"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Globe,
  Clock,
  RecycleIcon as Redirect,
  Lock,
  FileText,
  Brain,
} from "lucide-react";
import { useQueryStore } from "@/lib/store";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const { getQuery } = useQueryStore();

  const query = getQuery(params.id as string);

  if (!query) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Relatório Não Encontrado</CardTitle>
            <CardDescription>
              O relatório de análise solicitado não pôde ser encontrado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { result } = query;

  const SecurityCheck = ({
    title,
    status,
    details,
    icon: Icon,
  }: {
    title: string;
    status: boolean | null;
    details?: string | string[];
    icon: any;
  }) => (
    <div className="flex items-start space-x-3 p-4 border border-zinc-800 rounded-lg">
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{title}</h4>
          <Badge
            variant={
              status === true
                ? "destructive"
                : status === false
                ? "default"
                : "secondary"
            }
            className={
              status === false ? "bg-green-500 hover:bg-green-600" : ""
            }
          >
            {status === true
              ? "Detected"
              : status === false
              ? "Clear"
              : "Unknown"}
          </Badge>
        </div>
        {details && (
          <div className="mt-2 text-sm text-muted-foreground">
            {Array.isArray(details) ? (
              <ul className="list-disc list-inside space-y-1">
                {details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            ) : (
              <p>{details}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Início
            </Button>
            <div className="text-sm text-muted-foreground">
              Analisado em{" "}
              {format(
                new Date(query.createdAt),
                "d 'de' MMMM 'de' yyyy 'às' HH:mm",
                { locale: ptBR }
              )}
            </div>
          </div>

          {/* Overall Result */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {result.suspicious ? (
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  ) : (
                    <Shield className="h-8 w-8 text-green-500" />
                  )}
                  <div>
                    <CardTitle className="text-2xl">
                      {result.suspicious ? "Site Suspeito" : "Site Seguro"}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {query.url}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={result.suspicious ? "destructive" : "default"}
                  className={`text-lg px-4 py-2 ${
                    result.suspicious ? "" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {result.suspicious ? "SUSPEITO" : "SEGURO"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{result.domain}</p>
                  <p className="text-sm text-muted-foreground">Domínio</p>
                </div>
                {result.domain_age_days && (
                  <div>
                    <p className="text-2xl font-bold">
                      {result.domain_age_days}
                    </p>
                    <p className="text-sm text-muted-foreground">Dias de Existência</p>
                  </div>
                )}
                {result.bert_phishing_score && (
                  <div>
                    <p className="text-2xl font-bold">
                      {(result.bert_phishing_score * 100).toFixed(3)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      AI Risk Score
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Checks */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Análise de Segurança</CardTitle>
              <CardDescription>
                Detalhamento das verificações de segurança realizadas neste site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Threat Database Checks */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Verificações em Bancos de Dados de Ameaças
                </h3>
                <div className="space-y-3">
                  <SecurityCheck
                    title="Banco de Dados PhishTank"
                    status={result.in_phishtank}
                    details={
                      result.in_phishtank
                        ? "Esta URL está listada no banco de dados de phishing do PhishTank"
                        : "Não encontrada no banco de dados do PhishTank"
                    }
                    icon={Shield}
                  />
                  <SecurityCheck
                    title="Banco de Dados OpenPhish"
                    status={result.in_openphish}
                    details={
                      result.in_openphish
                        ? "Esta URL está listada no banco de dados de phishing do OpenPhish"
                        : "Não encontrada no banco de dados do OpenPhish"
                    }
                    icon={Shield}
                  />
                </div>
              </div>

              <Separator />

              {/* Domain Analysis */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Análise de Domínio
                </h3>
                <div className="space-y-3">
                  <SecurityCheck
                    title="Substituição Numérica"
                    status={result.numeric_substitution}
                    details={
                      result.substituted_chars?.length
                        ? `Caracteres numéricos encontrados: ${result.substituted_chars.join(
                            ", "
                          )}`
                        : "Nenhuma substituição numérica suspeita detectada"
                    }
                    icon={FileText}
                  />
                  <SecurityCheck
                    title="Subdomínios Excessivos"
                    status={result.excessive_subdomains}
                    details={
                      result.subdomain_count
                        ? `Encontrados ${result.subdomain_count} níveis de subdomínio`
                        : "Estrutura de subdomínio normal"
                    }
                    icon={Globe}
                  />
                  <SecurityCheck
                    title="Caracteres Especiais"
                    status={result.special_chars_in_url}
                    details={
                      result.special_chars?.length
                        ? `Caracteres especiais encontrados: ${result.special_chars.join(
                            ", "
                          )}`
                        : "Nenhum caractere especial suspeito"
                    }
                    icon={FileText}
                  />
                  <SecurityCheck
                    title="DNS Dinâmico"
                    status={result.dynamic_dns}
                    details={
                      result.dynamic_dns_provider
                        ? `Usa provedor de DNS dinâmico: ${result.dynamic_dns_provider}`
                        : "Não está usando DNS dinâmico"
                    }
                    icon={Globe}
                  />
                  {result.young_domain !== null && (
                    <SecurityCheck
                      title="Idade do Domínio"
                      status={result.young_domain}
                      details={
                        result.domain_age_days
                          ? `O domínio tem ${result.domain_age_days} dias`
                          : "Não foi possível determinar a idade do domínio"
                      }
                      icon={Clock}
                    />
                  )}
                  <SecurityCheck
                    title="Similaridade com Marca"
                    status={result.brand_similarity}
                    details={
                      result.similar_brand
                        ? `Similar a marca legítima: ${result.similar_brand}`
                        : "Nenhuma similaridade suspeita com marca detectada"
                    }
                    icon={Shield}
                  />
                </div>
              </div>

              <Separator />

              {/* Technical Analysis */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Análise Técnica
                </h3>
                <div className="space-y-3">
                  <SecurityCheck
                    title="Redirecionamentos Suspeitos"
                    status={result.suspicious_redirects}
                    details={
                      result.redirect_count
                        ? `${result.redirect_count} redirecionamentos detectados${
                            result.final_domain
                              ? `, domínio final: ${result.final_domain}`
                              : ""
                          }`
                        : "Nenhum redirecionamento suspeito detectado"
                    }
                    icon={Redirect}
                  />
                  <SecurityCheck
                    title="Certificado SSL/TLS"
                    status={result.suspicious_ssl}
                    details={
                      result.ssl_issues?.length
                        ? result.ssl_issues
                        : "Certificado SSL parece válido"
                    }
                    icon={Lock}
                  />
                  <SecurityCheck
                    title="Formulários HTML Suspeitos"
                    status={result.suspicious_html_forms}
                    details={
                      result.suspicious_html_forms
                        ? "Detectados formulários de login potencialmente maliciosos"
                        : "Nenhum formulário suspeito detectado"
                    }
                    icon={FileText}
                  />
                </div>
              </div>

              {/* AI Analysis */}
              {result.bert_phishing_score && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Análise de IA
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 border border-zinc-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">
                            Detecção de Phishing (BERT)
                          </h4>
                          <Badge
                            variant={
                              result.bert_phishing_score > 0.5
                                ? "destructive"
                                : "default"
                            }
                          >
                            {(result.bert_phishing_score * 100).toFixed(3)}% Risco
                          </Badge>
                        </div>
                        <Progress
                          value={result.bert_phishing_score * 100}
                          className="mb-2"
                        />
                        <p className="text-sm text-muted-foreground">
                          Confiança do modelo de IA de que esta URL é maliciosa
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>O que devo fazer?</CardTitle>
            </CardHeader>
            <CardContent>
              {result.suspicious ? (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-destructive/10 border border-zinc-800 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <h4 className="font-medium text-destructive">
                        ⚠️ Não visite este site
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Este site foi marcado como potencialmente malicioso.
                        Evite inserir qualquer informação pessoal.
                      </p>
                    </div>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>
                      • Não insira senhas, números de cartão de crédito ou informações pessoais
                    </li>
                    <li>• Feche o site imediatamente</li>
                    <li>
                      • Caso esteja em uma rede corporativa, reporte o site para a equipe de TI ou segurança
                    </li>
                    <li>• Considere executar uma verificação de segurança no seu dispositivo</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-green-50 border border-zinc-800 rounded-lg dark:bg-green-950">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-700 dark:text-green-400">
                        ✅ Site parece seguro
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Nenhum indicador suspeito foi detectado, mas sempre
                        mantenha-se cauteloso online.
                      </p>
                    </div>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Ainda assim, verifique se a URL corresponde ao site pretendido</li>
                    <li>• Procure por HTTPS e certificados SSL válidos</li>
                    <li>• Seja cauteloso ao inserir informações sensíveis</li>
                    <li>• Confie em seus instintos se algo parecer errado</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
