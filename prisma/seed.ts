import "dotenv/config";

import { prisma } from "../src/lib/db";
import { slugify } from "../src/lib/slug";

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
};

type SeedArticle = {
  categorySlug: string;
  title: string;
  excerpt: string;
  content: string;
  level: "RECRUTA" | "VETERANO" | "COMANDANTE";
  gameVersion: string;
  publishedAt: string;
};

type SeedManual = {
  categorySlug: string;
  title: string;
  description: string;
  gameVersion: string;
  pdfUrl: string;
  coverUrl?: string;
};

const categories: SeedCategory[] = [
  {
    name: "Iniciantes & Infantaria",
    slug: "iniciantes-infantaria",
    description:
      "O básico para sobreviver ao primeiro spawn: rifleman, medicação, comunicação e movimentação.",
  },
  {
    name: "Liderança SL & CMD",
    slug: "lideranca-sl-cmd",
    description:
      "Como liderar um esquadra, montar spawns, coordenar com outros SLs e comandar o time.",
  },
  {
    name: "Logística & FOBs",
    slug: "logistica-fobs",
    description:
      "Rotas de suprimento, construção de FOBs/HABs, uso de veículos e helicópteros.",
  },
  {
    name: "Blindados & Veículos",
    slug: "blindados-veiculos",
    description:
      "Tripulação de blindados, ângulos, comunicação com a infantaria e sobrevivência.",
  },
  {
    name: "Morteiros & Artilharia",
    slug: "morteiros-artilharia",
    description:
      "Fogo indireto: cálculo de distância, correção de tiro e coordenação com observadores.",
  },
  {
    name: "Mapas & Callouts",
    slug: "mapas-callouts",
    description:
      "Callouts essenciais, leitura de mapa e rotas para os mapas mais jogados.",
  },
];

const articles: SeedArticle[] = [
  {
    categorySlug: "iniciantes-infantaria",
    title: "Guia do Recruta: seus primeiros 30 minutos em Squad",
    excerpt:
      "Spawn seguro, escolha de kit, medicação e as três regras de comunicação que evitam 90% dos erros de iniciante.",
    level: "RECRUTA",
    gameVersion: "Update 8.2",
    publishedAt: "2026-11-12T14:00:00.000Z",
    content: `## Chegou agora? Comece por aqui

Squad não é um shooter de reflexo: é um jogo de **posicionamento e comunicação**. Seu primeiro objetivo não é matar, é não morrer em posição inútil.

### 1. Escolha o spawn com calma

Ao abrir o mapa de spawn, verifique:

- **HABs ativos**: prefira spawnar em HAB com cobertura, não em HAB cercado.
- **Distância do objetivo**: spawnar longe só faz sentido se houver veículo esperando.
- **Nível de ameaça**: um spawn cercado por blindado inimigo vira fila de morte.

### 2. Kit padrão do recruta

O **Rifleman** com escopo de 4x é o kit mais versátil para começar. Ele carrega munição para os colegas e não depende de especialização.

> Dica: peça o kit antes de sair do spawn. Trocar de kit no meio do campo normalmente custa uma vida.

### 3. Medicação tem prioridade

Se um colega cai ao seu lado, o correto é:

1. Confirmar que a área está segura.
2. Aplicar o **bandage** para parar o sangramento.
3. Só então usar o **medkit** para reanimar.

Reanimar alguém que estava sangrando sem parar o sangramento é uma das causas mais comuns de morte dupla.

### 4. Comunicação mínima

Use o rádio local com informação curta:

- "Inimigo, noroeste, 100 metros, atrás do muro."
- "Estou caindo, preciso de bandage."
- "Blindado entrando na vila pelo sul."

Sem direção e distância, o callout não ajuda ninguém.`,
  },
  {
    categorySlug: "iniciantes-infantaria",
    title: "Rifleman eficiente: cobertura, ângulo e disciplina de tiro",
    excerpt:
      "Como transformar o kit mais básico do jogo na função mais valiosa do esquadra: o cara que não morre e mantém o time vivo.",
    level: "RECRUTA",
    gameVersion: "Update 8.2",
    publishedAt: "2026-11-08T18:30:00.000Z",
    content: `## O rifleman não é figurante

Todo esquadra precisa de pelo menos um rifleman para reabastecer munição. Um bom rifleman vale mais que três especialistas mortos.

### Cobertura antes de tiro

A regra prática: **nunca atire de pé no aberto**. Antes de engajar:

- Procure cobertura baixa que permita atirar deitado.
- Evite janelas óbvias — você vira silhueta.
- Prefira ângulos de 45° em relação à direção esperada do inimigo.

### Disciplina de tiro

Disparar cedo entrega sua posição e atrai fogo de morteiro. Se o alvo está a mais de 150 metros e não ameaça o esquadra, **reporte e espere**.

### Munição é recurso de time

Carregue caixas e distribua antes do contato:

1. Reabasteça o médico e o anti-tanque primeiro.
2. Deixe uma caixa no HAB como reserva.
3. Nunca largue munição em campo aberto.

### Movimento em dupla

Alterne cobertura com um colega: um observa enquanto o outro avança. Isso reduz drasticamente a chance de ser flanqueado.`,
  },
  {
    categorySlug: "lideranca-sl-cmd",
    title: "Squad Leader 101: assumindo o comando sem perder o esquadra",
    excerpt:
      "Primeiros cinco minutos como SL: definir spawn, papel do esquadra, marcações no mapa e quando pedir apoio.",
    level: "VETERANO",
    gameVersion: "Update 8.2",
    publishedAt: "2026-11-15T11:00:00.000Z",
    content: `## O SL é o multiplicador do time

Um esquadra sem liderança vira um grupo de jogadores correndo para o mesmo lugar. Seu trabalho é dar **direção** e **spawn**.

### Primeiros cinco minutos

1. Anuncie o objetivo no rádio de comando: "Esquadra 3, atacando o ponto Charlie pelo leste."
2. Defina um rifleman para carregar munição e um médico.
3. Coloque o rally em local protegido e fora da linha de visão do inimigo.
4. Só então avance.

### O mapa de comando é sua ferramenta

Marque no mapa:

- Ícone de ataque no objetivo principal.
- Ícone de defesa no objetivo que o time está perdendo.
- Movimento de blindado aliado, se houver.

Marcações desatualizadas confundem mais do que ajudam. Limpe as antigas.

### Quando pedir apoio

Peça morteiro ou blindado quando:

- O inimigo está entrincheirado em prédio.
- O HAB inimigo está travando o avanço.
- Você tem observador com linha de visão e distância confirmada.

> Liderança é sobre consistência: um esquadra que spawna junto, se move junto e reporta junto vence esquadras melhores individualmente.`,
  },
  {
    categorySlug: "lideranca-sl-cmd",
    title: "Commander: UAV, assets e o custo de cada chamada",
    excerpt:
      "Quando usar UAV, apoio de artilharia e drone: prioridades de comando e os erros que desperdiçam assets do time.",
    level: "COMANDANTE",
    gameVersion: "Update 8.2",
    publishedAt: "2026-11-02T09:15:00.000Z",
    content: `## Comando é gestão de recursos

O commander não ganha o jogo atirando. Ele ganha o jogo **alocando assets** no lugar certo e no momento certo.

### UAV não é mapa de calor permanente

Use UAV quando:

- O time precisa decidir entre atacar e defender.
- Há suspeita de HAB inimigo em uma região específica.

Não use para "ver se tem alguém" em área já conhecida. O cooldown é longo e o time fica cego depois.

### Prioridade de assets

1. **Supplies** para FOBs em posição defensiva.
2. **Artilharia** em HAB/ponto confirmado por observador.
3. **Drone** para reconhecimento de blindados.
4. **Veículos** apenas quando há tripulação organizada.

### O erro clássico: asset sem observador

Chamar artilharia sem observador é queimar recurso. Confirme:

- Coordenada exata.
- Distância do alvo em relação às tropas aliadas.
- Janela de tempo antes de o inimigo se mover.

### Comunicação com os SLs

Antes de qualquer asset, avise no rádio de comando com **antecedência**. Um bombardeio sem aviso mata mais aliado do que inimigo.`,
  },
  {
    categorySlug: "logistica-fobs",
    title: "FOBs na prática: HAB, rádio e o erro clássico do spawn",
    excerpt:
      "Onde colocar o rádio, como proteger o HAB e por que FOB perto demais do objetivo costuma custar o esquadra inteiro.",
    level: "VETERANO",
    gameVersion: "Update 8.2",
    publishedAt: "2026-11-10T16:45:00.000Z",
    content: `## FOB é infraestrutura, não decoração

Uma FOB bem posicionada muda o ritmo da partida. Uma FOB mal posicionada entrega spawn para o inimigo.

### Escolha do rádio

- Coloque o rádio em **cobertura natural** (casa, árvore densa, elevação).
- Distância segura do objetivo: longe o suficiente para não ser cercado, perto o suficiente para chegar a pé em 1–2 minutos.
- Evite rádio visível de estrada principal.

### Construção do HAB

1. Confirme que a área está limpa.
2. Construa o HAB com **ao menos uma saída alternativa**.
3. Cerque com sacos de areia, mas deixe rota de fuga.
4. Não construa HAB colado em parede: o spawn fica travado.

### O erro clássico

Colocar HAB a 30 metros do objetivo atrai fogo de morteiro e granada. O time nasce, morre, e o spawn fica em cooldown.

> Regra prática: se o HAB está visível do objetivo, ele está perto demais.

### Manutenção

- Reabasteça com caixas regularmente.
- Destrua a FOB quando ela estiver comprometida e remonte em outro local.
- Avise no rádio quando a FOB cair.`,
  },
  {
    categorySlug: "logistica-fobs",
    title: "Rotas de suprimento: helicóptero, caminhão e timing",
    excerpt:
      "Como manter FOBs vivas com logística eficiente, evitando voos desnecessários e entregas em zona quente.",
    level: "VETERANO",
    gameVersion: "Update 8.1",
    publishedAt: "2026-10-28T13:20:00.000Z",
    content: `## Logística é ritmo

Quem controla suprimento controla a duração do combate. Um esquadra sem munição recua; um time sem FOB perde o ponto.

### Antes de decolar

- Verifique quais FOBs estão com estoque baixo no mapa.
- Combine ponto de pouso com o SL responsável.
- Leve **supplies** e **construção** na proporção que o time pediu.

### Entrega em zona quente

Se o objective está em combate:

1. Pouse a 300–500 metros atrás.
2. Descarte os suprimentos em cobertura.
3. Comunique a localização exata por rádio.

Não tente pousar no meio do objetivo: o helicóptero é o asset mais caro do time.

### Caminhão é subestimado

Para distâncias curtas, o caminhão entrega mais supplies por viagem, com risco menor de perda total. Use helicóptero quando precisar atravessar terreno aberto ou montanha.

### Timing

Reabasteça **antes** do ataque, não durante. Uma FOB com estoque cheio no início do push permite sustentar o combate por vários minutos.`,
  },
  {
    categorySlug: "blindados-veiculos",
    title: "Blindados: tripulação, ângulos e comunicação com a infantaria",
    excerpt:
      "Como evitar o blindado isolado: papéis de tripulação, uso de fumaça e o que a infantaria espera ouvir de você.",
    level: "VETERANO",
    gameVersion: "Update 8.2",
    publishedAt: "2026-11-05T20:00:00.000Z",
    content: `## Blindado sem infantaria é alvo

Um veículo sozinho dura até encontrar um AT. Um veículo com infantaria ao redor dura a partida inteira.

### Tripulação mínima

- **Motorista**: posicionamento e rota de fuga.
- **Atirador**: alvos e supressão.
- **Comandante** (quando possível): observação e rádio.

Sem comandante, o motorista acumula funções e perde consciência situacional.

### Ângulos

Ataque sempre com o **frontalf** voltado para a ameaça principal. Blindagem lateral e traseira são frágeis.

- Nunca pare em rua aberta.
- Prefira posição elevada com visão de longo alcance.
- Tenha rota de recuo definida antes de engajar.

### Fumaça salva vidas

Fumaça não é só para atacar: ela cobre a retirada de infantaria ferida e permite reposicionamento após contato com AT.

### O que a infantaria precisa ouvir

- "Blindado aliado entrando na vila pelo norte."
- "Preciso de infantaria ao redor, estou parado."
- "AT inimigo no prédio azul, suprimam."

Comunicação clara transforma o blindado em apoio real, não em alvo.`,
  },
  {
    categorySlug: "morteiros-artilharia",
    title: "Morteiro na prática: distância, correção e cadência",
    excerpt:
      "Do posicionamento do tubo ao ajuste do segundo disparo: como acertar o alvo sem gastar o estoque inteiro.",
    level: "VETERANO",
    gameVersion: "Update 8.2",
    publishedAt: "2026-10-30T10:40:00.000Z",
    content: `## Fogo indireto exige paciência

O morteiro é a arma mais eficiente contra posição entrincheirada — desde que o cálculo esteja certo.

### Antes do primeiro tiro

- Posicione o tubo em solo plano e com cobertura.
- Confirme a distância no mapa (não estime de cabeça).
- Combine com o observador quem ajusta o tiro.

### Primeiro disparo é referência

O primeiro tiro serve para **medir o erro**, não para matar. Peça ao observador:

- Direção do impacto em relação ao alvo (ex.: "50 metros ao norte").
- Se possível, referência visual ("atrás do muro", "na rua").

### Correção

Ajuste em passos pequenos:

1. Corrija direção primeiro.
2. Depois ajuste distância.
3. Só então aumente a cadência.

### Cadência e estoque

Dois tiros bem ajustados valem mais que dez aleatórios. Morteiro sem munição no meio do push deixa o esquadra sem apoio.

> Nunca dispare sem confirmar que tropas aliadas não estão na área de impacto.`,
  },
  {
    categorySlug: "mapas-callouts",
    title: "Callouts essenciais em Narva, Gorodok e Yehorivka",
    excerpt:
      "Referências rápidas de mapa para reportar inimigo em segundos: pontos cardeais, prédios-chave e distâncias.",
    level: "RECRUTA",
    gameVersion: "Update 8.2",
    publishedAt: "2026-11-18T17:10:00.000Z",
    content: `## Callout bom é curto e verificável

Um callout precisa responder três perguntas: **o quê**, **onde** e **a que distância**.

### Estrutura padrão

> "Infantaria, noroeste, 150 metros, prédio de dois andares."

Nessa ordem: alvo, direção, distância, referência.

### Narva

- **Igreja**: referência central da cidade.
- **Prefeitura**: prédio grande ao lado da praça.
- **Ponte norte / ponte sul**: define rota de blindados.

### Gorodok

- **Depósito**: galpão industrial a leste do ponto central.
- **Fazenda**: conjunto de casas ao sul.
- **Colina do rádio**: elevação com visão do objetivo.

### Yehorivka

- **Vila central**: casas agrupadas com ruas estreitas.
- **Campo de trigo**: área aberta, perigosa para infantaria.
- **Estação**: prédio longo próximo à linha férrea.

### Distâncias que importam

Use referências fixas:

- Dentro da vila: "mesma rua", "prédio vizinho".
- Fora da vila: **50 / 100 / 200 / 300 metros**.

Evite "lá", "aqui" e "perto". Callout vago custa tempo e vida.`,
  },
];

const manuals: SeedManual[] = [
  {
    categorySlug: "lideranca-sl-cmd",
    title: "Apostila do Squad Leader — Update 8.2",
    description:
      "Material completo de liderança: montagem de esquadra, spawns, rádio de comando e tomada de decisão sob pressão.",
    gameVersion: "Update 8.2",
    pdfUrl: "/uploads/pdfs/apostila-squad-leader.pdf",
  },
  {
    categorySlug: "logistica-fobs",
    title: "Manual de Logística: FOBs, HABs e suprimentos",
    description:
      "Guia ilustrado de construção de FOB, posicionamento de HAB, rotas de suprimento e uso de helicópteros.",
    gameVersion: "Update 8.2",
    pdfUrl: "/uploads/pdfs/manual-logistica-fobs.pdf",
  },
  {
    categorySlug: "blindados-veiculos",
    title: "Guia de Blindados: tripulação e comunicação",
    description:
      "Papéis de tripulação, ângulos de engajamento, uso de fumaça e integração com a infantaria.",
    gameVersion: "Update 8.1",
    pdfUrl: "/uploads/pdfs/guia-blindados.pdf",
  },
];

async function main() {
  const categoryIds = new Map<string, string>();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });

    categoryIds.set(record.slug, record.id);
  }

  for (const article of articles) {
    const categoryId = categoryIds.get(article.categorySlug);

    if (!categoryId) {
      throw new Error(`Categoria não encontrada: ${article.categorySlug}`);
    }

    const slug = slugify(article.title);

    const data = {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      level: article.level,
      gameVersion: article.gameVersion,
      status: "PUBLISHED" as const,
      categoryId,
      publishedAt: new Date(article.publishedAt),
    };

    await prisma.article.upsert({
      where: { slug },
      update: data,
      create: { ...data, slug },
    });
  }

  for (const manual of manuals) {
    const categoryId = categoryIds.get(manual.categorySlug);

    if (!categoryId) {
      throw new Error(`Categoria não encontrada: ${manual.categorySlug}`);
    }

    const slug = slugify(manual.title);

    const data = {
      title: manual.title,
      description: manual.description,
      gameVersion: manual.gameVersion,
      pdfUrl: manual.pdfUrl,
      coverUrl: manual.coverUrl ?? null,
      status: "PUBLISHED" as const,
      categoryId,
    };

    await prisma.manual.upsert({
      where: { slug },
      update: data,
      create: { ...data, slug },
    });
  }

  const [categoryCount, articleCount, manualCount] = await Promise.all([
    prisma.category.count(),
    prisma.article.count(),
    prisma.manual.count(),
  ]);

  console.log(
    `Seed concluído: ${categoryCount} categorias, ${articleCount} artigos, ${manualCount} manuais.`,
  );
}

main()
  .catch((error) => {
    console.error("Falha ao popular o banco:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
