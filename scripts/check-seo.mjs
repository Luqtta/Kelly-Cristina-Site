// Checagem de SEO tecnico. Roda com: npm run check:seo
//
// Script de uso LOCAL apenas — `scripts/` nao casa com nenhum padrao do array
// `builds` do vercel.json, entao este arquivo nao vai pro deploy (verificado
// com `vercel build`). E de proposito: nao ha por que publicar isto.
//
// ponytail: nao gera nada, so verifica. O site tem 1 pagina so, entao gerar
// sitemap por script seria mais codigo que o proprio sitemap. O que quebra de
// verdade aqui e o dominio ficar divergente entre os 4 arquivos, ou os arquivos
// novos nao entrarem no deploy da Vercel -- e disso que este script cuida.
// Se um dia surgirem paginas por servico, ai sim troque por um gerador.

import { readFileSync, existsSync, statSync } from "node:fs";

const erros = [];
const falhar = (m) => erros.push(m);
const ler = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

const html = ler("index.html");
const sitemap = ler("sitemap.xml");
const robots = ler("robots.txt");
const vercel = JSON.parse(ler("vercel.json"));

// 1. robots.txt e sitemap.xml precisam estar em `builds` do vercel.json.
// O formato legado com `builds` explicito e uma allowlist: o que nao casa com
// nenhum padrao simplesmente nao vai pro deploy e responde 404 em producao.
const srcs = vercel.builds.map((b) => b.src);
for (const f of ["robots.txt", "sitemap.xml"]) {
  if (!srcs.includes(f)) falhar(`${f} nao esta em vercel.json > builds — vai dar 404 em producao`);
}

// 2. canonical, og:url, <loc> do sitemap e a diretiva Sitemap: do robots.txt
// tem que apontar todos para o mesmo dominio absoluto.
const pegar = (re, txt, nome) => {
  const m = txt.match(re);
  if (!m) return falhar(`${nome} nao encontrado`), null;
  return m[1];
};
const canonical = pegar(/rel="canonical" href="([^"]+)"/, html, "link canonical");
const ogUrl = pegar(/property="og:url" content="([^"]+)"/, html, "og:url");
const loc = pegar(/<loc>([^<]+)<\/loc>/, sitemap, "<loc> do sitemap");
const diretiva = pegar(/^Sitemap:\s*(\S+)/m, robots, "diretiva Sitemap do robots.txt");

const urls = [canonical, ogUrl, loc].filter(Boolean);
if (new Set(urls).size > 1) falhar(`canonical, og:url e <loc> divergem: ${urls.join(" | ")}`);
if (loc && diretiva && diretiva !== `${loc.replace(/\/$/, "")}/sitemap.xml`) {
  falhar(`diretiva Sitemap (${diretiva}) nao bate com o dominio do sitemap (${loc})`);
}
for (const u of [...urls, diretiva].filter(Boolean)) {
  if (!u.startsWith("https://")) falhar(`URL nao absoluta em https: ${u}`);
}

// 3. <lastmod> nao pode ficar para tras do index.html. Este e o unico dado do
// sitemap que apodrece sozinho: edita-se a pagina e esquece-se da data.
const lastmod = pegar(/<lastmod>([^<]+)<\/lastmod>/, sitemap, "<lastmod> do sitemap");
const dataLocal = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const editadoEm = dataLocal(statSync(new URL("../index.html", import.meta.url)).mtime);
if (lastmod && lastmod < editadoEm) {
  falhar(`<lastmod> e ${lastmod} mas index.html foi alterado em ${editadoEm} — atualize para ${editadoEm}`);
}

// 4. og:image tem que ser absoluta E existir — relativa ou 404 = preview
// quebrada no WhatsApp, que e por onde esse link mais circula.
const ogImage = pegar(/property="og:image" content="([^"]+)"/, html, "og:image");
if (ogImage) {
  if (!ogImage.startsWith("https://")) falhar(`og:image precisa ser URL absoluta: ${ogImage}`);
  const caminho = ogImage.replace(/^https:\/\/[^/]+\//, "");
  if (!existsSync(new URL(`../${caminho}`, import.meta.url))) {
    falhar(`og:image aponta para ${caminho}, que nao existe no repositorio`);
  }
}

// 5. JSON-LD precisa ser JSON valido. Entidade HTML (&aacute;) aqui nao e
// decodificada pelo browser dentro de <script> — vira texto cru no dado.
const bloco = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!bloco) falhar("bloco JSON-LD nao encontrado no index.html");
else {
  try {
    const ld = JSON.parse(bloco[1]);
    if (ld["@type"] !== "LegalService") falhar(`JSON-LD @type deveria ser LegalService, veio ${ld["@type"]}`);
    if (!ld.address?.postalCode) falhar("JSON-LD sem postalCode");
    if (/&[a-z]+;/i.test(JSON.stringify(ld))) falhar("entidade HTML vazou para dentro do JSON-LD — use UTF-8 literal");
    // Endereco e telefone do JSON-LD tem que aparecer no conteudo visivel:
    // o Google desaconselha marcar dado que o usuario nao ve na pagina.
    const rua = ld.address?.streetAddress?.split(",")[0];
    if (rua && !html.includes(rua)) falhar(`"${rua}" esta no JSON-LD mas nao aparece no HTML visivel`);
  } catch (e) {
    falhar(`JSON-LD invalido: ${e.message}`);
  }
}

if (erros.length) {
  console.error(erros.map((e) => `  ✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`  ✓ SEO ok — dominio ${canonical}`);
