# Kelly Cristina Advocacia - Website Institucional

## 1. Visao Geral
Este repositorio contem o website institucional de uma advocacia com foco em Direito Previdenciario.  
O projeto combina front-end estatico com uma API serverless para buscar e exibir avaliacoes (reviews) do Google Places.

Objetivos principais:
- apresentar os servicos juridicos com clareza e autoridade;
- facilitar contato via WhatsApp com rastreamento de conversao;
- manter experiencia responsiva, acessivel e de alta legibilidade;
- suportar deploy simples em ambiente serverless.

## 2. Stack Tecnologica
- HTML5 semantico
- CSS3 modular (estilo principal + responsivo)
- JavaScript vanilla no cliente
- Swiper.js para carousel de depoimentos
- AOS para animacoes de entrada
- Bootstrap Icons
- Node.js (Vercel Functions)
- Axios para consumo da Google Places API
- Vercel para hospedagem de assets estaticos e API

## 3. Arquitetura
O projeto segue arquitetura hibrida:
- camada estatica: paginas, estilos, scripts e assets;
- camada dinamica: endpoint serverless para reviews.

Fluxo de reviews:
1. o front-end chama `POST /api/reviews`;
2. a funcao serverless consulta Google Places Details API;
3. os reviews retornam em JSON;
4. o front renderiza os cards no Swiper.

Fluxo de conversao:
1. botoes de contato disparam `gtag_report_conversion(url)`;
2. evento de conversao e enviado ao Google Ads;
3. usuario e redirecionado para WhatsApp.

## 4. Estrutura de Diretorios
```text
.
|-- index.html
|-- css/
|   |-- styles.css
|   `-- responsivo/
|       `-- index.css
|-- js/
|   `-- scripts.js
|-- assets/
|   `-- (imagens, logo, favicon)
|-- backend/
|   `-- api/
|       `-- reviews.js
|-- vercel.json
`-- package.json
```

## 5. Funcionalidades Implementadas
- navbar fixa com comportamento responsivo e menu mobile;
- hero section com chamadas de acao (CTAs) para contato;
- secoes institucionais (atuacao, diferenciais, FAQ, sobre, CTA final);
- cards de servicos com links de contato;
- depoimentos dinamicos via API;
- acordeao de FAQ em JavaScript;
- botao flutuante de WhatsApp;
- atualizacao automatica do ano no rodape.

## 6. Integracao de Reviews
Arquivo: `backend/api/reviews.js`

Comportamento:
- aceita apenas metodo `POST`;
- consulta endpoint Google Places Details API;
- extrai lista de reviews;
- embaralha e limita o retorno aos 5 reviews exibidos.

Resposta esperada:
- `200`: array de reviews;
- `405`: metodo nao permitido;
- `500`: erro interno ao buscar avaliacoes.

## 7. Rastreio de Conversao
Arquivo: `js/scripts.js`

Pontos principais:
- funcao `gtag_report_conversion(url)` encapsula disparo de evento de conversao;
- fallback para redirecionamento mesmo em caso de erro no `gtag`;
- botoes de contato no HTML usam `onclick="return gtag_report_conversion(...)"`.

## 8. Requisitos
- Node.js 18+ (recomendado)
- npm 9+ (ou equivalente)
- conta Google Cloud com Places API habilitada
- projeto Vercel (para deploy serverless)

## 9. Configuracao de Ambiente
Crie variaveis de ambiente para execucao local e producao:

```env
GOOGLE_API_KEY=seu_token_google_places
PLACE_ID=seu_place_id
```

Observacao:
- as variaveis devem ser configuradas no ambiente da Vercel para deploy.

## 10. Execucao Local
Instalacao:
```bash
npm install
```

Desenvolvimento local (Vercel):
```bash
npm run dev
```

O comando acima sobe:
- assets estaticos do projeto;
- rotas `/api/*` apontando para `backend/api/*.js`.

## 11. Deploy
Arquivo de configuracao: `vercel.json`

Mapeamentos:
- build de `backend/api/**/*.js` com `@vercel/node`;
- build de arquivos estaticos (`html`, `css`, `js`, `assets`);
- roteamento de `/api/(.*)` para `backend/api/$1.js`.

## 12. Padroes de Qualidade
- HTML semantico com foco em SEO tecnico;
- responsividade para desktop, tablet e mobile;
- foco em contraste e legibilidade para publico amplo;
- fallback defensivo para funcionalidades externas (reviews e analytics).

## 13. Manutencao
Recomendacoes de manutencao:
1. manter dependencias atualizadas e revisar `package-lock.json`;
2. validar periodicamente `PLACE_ID` e `GOOGLE_API_KEY`;
3. monitorar erros de API e latencia de carregamento dos reviews;
4. revisar eventos de conversao apos qualquer alteracao em CTAs;
5. testar navegacao mobile apos alteracoes de layout.

## 14. Licenciamento e Uso
Este projeto foi desenvolvido para uso institucional da marca Kelly Cristina Advocacia.  
A reutilizacao total ou parcial deve respeitar os direitos da proprietaria do conteudo e da identidade visual.
