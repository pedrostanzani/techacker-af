# Detector de Phishing

Avaliação final de Tecnologias Hacker (opção 3). Um detector de phishing avançado que utiliza múltiplas técnicas de análise para identificar sites potencialmente maliciosos.

## Características

- **Aplicação web com interface oderna**: Design limpo e intuitivo com feedback visual claro
- **Análise de phishing**: Combina várias técnicas de detecção para uma análise abrangente
- **Detecção por IA**: Utiliza modelo BERT para análise de phishing
- **Verificações em Tempo Real**: Análise instantânea de URLs suspeitas
- **Histórico de Análises**: Mantém registro das análises realizadas
- **Exportação de Dados**: Permite exportar resultados em CSV

### Técnicas de Detecção

1. **Verificação em Bancos de Dados públicos**
   - PhishTank
   - OpenPhish

2. **Análise de Domínio**
   - Substituição numérica
   - Subdomínios excessivos
   - Caracteres especiais
   - DNS dinâmico
   - Idade do domínio
   - Similaridade com marcas conhecidas

3. **Análise Técnica**
   - Redirecionamentos suspeitos
   - Certificados SSL/TLS
   - Formulários HTML suspeitos

4. **Análise por IA**
   - Modelo BERT para detecção de phishing
   - Score de risco baseado em IA

## Tecnologias Utilizadas

### Backend
- FastAPI
- Python
- Transformers (BERT)
- BeautifulSoup4
- WHOIS
- Cryptography

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Lucide Icons

## Execução com Docker

Atenção: espere o backend instalar o modelo de machine learning (Hugging Face) para poder executar a aplicação.

1. Clone o repositório
```bash
git clone https://github.com/pedrostanzani/techacker-af
cd techacker-af
```

2. Execute com docker compose
```bash
docker compose up
```

## Instalação

Caso prefira, você também pode executar o projeto manualmente.

### Pré-requisitos
- Python 3.13+
- Node.js 22+
- npm

### Backend

1. Clone o repositório
```bash
git clone https://github.com/pedrostanzani/techacker-af
cd techacker-af
```

2. Instale as dependências Python
```bash
cd backend
pip install -r requirements.txt
```

3. Inicie o servidor
```bash
uvicorn main:app --reload
```

### Frontend

1. Instale as dependências
```bash
cd frontend
npm install --legacy-peer-deps
```

2. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 📝 Uso

1. Acesse a interface web em `http://localhost:3000`
2. Insira a URL que deseja analisar
3. Aguarde a análise completa
4. Visualize o relatório detalhado com os resultados

## 🔍 Como Funciona

O detector realiza uma análise em múltiplas camadas:

1. **Verificação Inicial**
   - Consulta bancos de dados de phishing
   - Análise básica do domínio

2. **Análise Técnica**
   - Verificação de certificados SSL
   - Análise de redirecionamentos
   - Verificação de formulários suspeitos

3. **Análise por IA**
   - Processamento da URL pelo modelo BERT
   - Geração de score de risco

4. **Resultado Final**
   - Combinação de todos os fatores
   - Classificação final (Seguro/Suspeito)
