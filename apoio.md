# PAPAGAIADA
## Plataforma Premium de Cassino Online

**Especificação Técnica & Design**  
**Versão:** 2.0 Professional Edition  
**Data:** Setembro 2026


---

## 📋 VISÃO GERAL

**Papagaiada** é uma plataforma de cassino online premium que oferece entretenimento de classe mundial com interface moderna, autenticação segura e sistema de ranking competitivo em tempo real.

### Objetivo
Criar uma experiência de cassino profissional que transmita confiança, segurança e excelência através de design premium, funcionalidades robustas e interface intuitiva.

### Público-Alvo
- Usuários de 18+ anos (verificação obrigatória)
- Jogadores que buscam experiência premium de cassino
- Competidores interessados em ranking e leaderboards
- Audiência global (mobile e desktop)

---

## 🎨 IDENTIDADE VISUAL PREMIUM

### 1.1 Paleta de Cores

A identidade visual segue o padrão de cassinos premium globais (KTO, Ona, etc):

| Elemento | Cor HEX | RGB | Uso | Context |
|----------|---------|-----|-----|---------|
| **Fundo Primário** | #0F0F0F | 15,15,15 | Fundo geral, confiança | Dark luxury |
| **Fundo Secundário** | #1A1A1A | 26,26,26 | Cards, sections | Depth |
| **Accent Dourado** | #D4AF37 | 212,175,55 | CTAs, prêmios, destaque | Premium |
| **Accent Laranja** | #FF6B35 | 255,107,53 | Vitória, energia | Action |
| **Branco/Cinza Claro** | #FFFFFF / #E8E8E8 | 255,255,255 / 232,232,232 | Texto, contraste | Clarity |
| **Verde Sucesso** | #10B981 | 16,185,129 | Status positivo, profit | Trust |
| **Vermelho Alerta** | #EF4444 | 239,68,68 | Perdas, alertas | Attention |

### 1.2 Tipografia Premium

```css
Headings (H1-H4):
├── Fonte: 'Inter' ou 'Poppins' Bold
├── Tamanho: 32px, 28px, 24px, 20px
├── Espaçamento: -0.5px (letter-spacing)
├── Peso: 700-900
└── Cor: #FFFFFF (branco) ou #D4AF37 (dourado)

Body & Descrições:
├── Fonte: 'Inter' Regular
├── Tamanho: 14px, 16px
├── Line-height: 1.6
├── Peso: 400-500
└── Cor: #E8E8E8 (cinza claro)

CTAs & Buttons:
├── Fonte: 'Poppins' SemiBold
├── Tamanho: 16px
├── Peso: 600
├── Tracking: 0.5px
└── Transformação: uppercase
```

### 1.3 Ícones & Visuais

- **Ícones**: Stroke simples, 24px, cor dourada/branco
- **Avatares**: Gradientes premium (dourado → branco)
- **Badges**: Design minimalista com cores vibrantes
- **Illustrations**: Estilo moderno, elegante, premium

---

## 📐 LAYOUT & COMPONENTES

### 2.1 Header/Navbar

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [PAPAGAIADA LOGO]                    [Menu] [Saldo] [Perfil] │
│  
│  Fundo: #0F0F0F
│  Altura: 70px
│  Sticky: Sim
│  Shadow: Subtle gradient dourado inferior
│
└─────────────────────────────────────────────────────────────────┘
```

**Componentes:**
- Logo com papagaio animado (hover: glow dourado)
- Menu navegação (Home, Jogos, Ranking, Suporte, FAQ)
- Saldo em destaque (numeração com efeito de contagem)
- Avatar + Dropdown (Perfil, Configurações, Logout)

### 2.2 Sidebar Ranking

```
RANKING PAPAGAIADA
━━━━━━━━━━━━━━━━━━━━
Fundo: #1A1A1A
Largura: 280px (desktop), hidden (mobile)
Posição: Right side

┌─────────────────────┐
│ 🥇 João Silva       │
│    ████████░ 28%   │
│    5.800 moedas    │
├─────────────────────┤
│ 🥈 Maria Costa     │
│    ███████░░ 26%   │
│    4.200 moedas    │
├─────────────────────┤
│ 🥉 Pedro Santos    │
│    ██████░░░ 25%   │
│    2.100 moedas    │
├─────────────────────┤
│ 47. VOCÊ (você)    │
│    ██████░░░ 24%   │
│    890 moedas      │
└─────────────────────┘

Atualização: Real-time (Socket.io)
Animação: Slide suave quando posição muda
```

### 2.3 Main Content Area

```
Fundo: Gradiente sutil #0F0F0F → #1A1A1A
Padding: 40px
Border-radius: 12px
Cards de jogo: Fundo #1A1A1A com borda dourada fina (1px)
```

---

## 🎮 JOGOS PRINCIPAIS

### 3.1 Roleta Papagaiada Premium

#### Layout da Roleta

```
┌────────────────────────────────────────────┐
│                                            │
│  ROLETA PAPAGAIADA                        │
│  ─────────────────────                    │
│  Taxa de RTP: 96.5% | Limite: R$ 5-500   │
│                                            │
│         ┌──────────────┐                  │
│         │              │                  │
│         │  🎰 🎰 🎰  │                  │
│         │              │                  │
│         └──────────────┘                  │
│                                            │
│  Saldo: R$ 500.00                        │
│  [APOSTAR -25]  [GIRAR] [HISTÓRICO ▼]   │
│                                            │
│  ┌─ Últimas Rodadas ────────────────┐    │
│  │ ✓ Vitória +25 - 2 min            │    │
│  │ ✗ Derrota -25 - 5 min            │    │
│  │ ✓ Vitória +25 - 8 min            │    │
│  └──────────────────────────────────┘    │
│                                            │
└────────────────────────────────────────────┘
```

#### Símbolos da Roleta (Profissionais)

```
Símbolo 1: 🐦 Papagaio Tropical (foto premium)
Símbolo 2: 💰 Moeda de Ouro
Símbolo 3: 🏆 Troféu Premium
Símbolo 4: 💎 Diamante
Símbolo 5: ⚡ Raio/Energia
Símbolo 6: 🌟 Estrela

Total: 6 símbolos variados
Pool: 18 posições (3 repetições cada)
RTP: 96.5% (profissional)
```

#### Mecânica Premium

**Antes de Girar:**
- Modal de confirmação: "Apostar R$ 25?"
- Exibir RTP e limite
- Botão [CONFIRMAR] destacado em dourado

**Durante Giro:**
- Duração: 3.5 segundos
- Efeito: Spin rápido 360° com blur
- Glow: Borda dourada pulsante
- Som: Efeito profissional de cassino (opcional)
- Parada sequencial: Rolo 1 → 2 → 3 (suspense)

**Após Resultado:**
- **Vitória (3 iguais):**
  - 🎉 Confete dourado/branco cai
  - ✨ Explosão de luz (glow intenso)
  - 📊 Números saltam na tela: "+25 R$"
  - 🎵 Som de vitória
  - Moedas acumuladas atualizam com efeito
  - Streak counter incrementa
  - Mensagem: "PARABÉNS! Você ganhou R$ 25!"
  
- **Derrota (não iguais):**
  - ❌ Feedback visual suave
  - 📉 Saldo diminui com animação
  - Mensagem: "Tente novamente. Próxima rodada."

---

## 🏆 SISTEMA DE RANKING PREMIUM

### 4.1 Leaderboard Real-time

```
RANKING PAPAGAIADA
Atualizado há 30 segundos

┌─────┬──────────────────┬──────┬─────────┬────────────┐
│ Pos │ Jogador          │ Taxa │Vitórias │ Patrimônio │
├─────┼──────────────────┼──────┼─────────┼────────────┤
│ 🥇  │ João Silva       │ 28%  │ 1.240  │ 18.500 R$  │
│ 🥈  │ Maria Costa      │ 26%  │ 987    │ 14.200 R$  │
│ 🥉  │ Pedro Santos     │ 25%  │ 654    │ 12.100 R$  │
├─────┼──────────────────┼──────┼─────────┼────────────┤
│ 4   │ Ana Oliveira     │ 24%  │ 521    │ 9.800 R$   │
│ 5   │ Carlos Souza     │ 23%  │ 498    │ 8.900 R$   │
│ ... │ ...              │ ...  │ ...    │ ...        │
│ 47  │ 👤 VOCÊ (Arruda) │ 24%  │ 245    │ 4.890 R$   │
└─────┴──────────────────┴──────┴─────────┴────────────┘

Filtros: [Todos] [Essa Semana] [Esse Mês] [Todos os Tempos]
Atualização: Real-time (Socket.io)
```

### 4.2 Badges & Conquistas

```
🌟 Bronze Badge (100 vitórias)
💎 Diamond Badge (Taxa >30%)
👑 VIP Badge (#1 do ranking)
🔥 Streak Badge (5+ vitórias seguidas)
🎯 Precisão Badge (Taxa >25% por 50 rodadas)
💰 Jackpot Badge (Vitória 4x maior que normal)
🏅 Lendário Badge (1.000 vitórias)
```

---

## 👤 PERFIL DO USUÁRIO PREMIUM

### 5.1 Dashboard de Perfil

```
┌──────────────────────────────────────────────────┐
│                  MEU PERFIL                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  [AVATAR]  JOÃO SILVA              ID: 47       │
│            Membro desde: 15 de Ago               │
│            Posição: #47 do Ranking               │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │ ESTATÍSTICAS PRINCIPAIS                  │   │
│  ├──────────────┬──────────────────────────┤   │
│  │ Total de Jogos │ 1.025                 │   │
│  │ Vitórias       │ 245                   │   │
│  │ Taxa Vitória   │ 24% (Acima média)    │   │
│  │ Moedas Totais  │ 4.890 R$             │   │
│  │ Maior Streak   │ 8 vitórias            │   │
│  │ Streak Atual   │ 2 vitórias            │   │
│  │ Lucro/Perda    │ -125 R$ (esperado)   │   │
│  └──────────────┴──────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │ BADGES DESBLOQUEADOS (4/8)              │   │
│  │ 🌟 💎 🔥 🎯                             │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  [EDITAR PERFIL] [HISTÓRICO] [CONFIGURAÇÕES]   │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 5.2 Histórico de Rodadas

```
Últimas 50 Rodadas (Filtráveis por data/resultado)

┌─────┬──────────────┬────────────┬──────────┬─────────┐
│ ID  │ Data/Hora    │ Resultado  │ Aposte   │ Ganho   │
├─────┼──────────────┼────────────┼──────────┼─────────┤
│ 45  │ Ago 15 20:30 │ ✓ 💎💎💎│ -25 R$  │ +25 R$ │
│ 44  │ Ago 15 20:28 │ ✗ 🌟💎⚡ │ -25 R$  │ 0 R$  │
│ 43  │ Ago 15 20:25 │ ✓ 🏆🏆🏆│ -25 R$  │ +25 R$ │
│ 42  │ Ago 15 20:23 │ ✗ 💰🌟⚡ │ -25 R$  │ 0 R$  │
│ ... │ ...          │ ...        │ ...      │ ...    │
└─────┴──────────────┴────────────┴──────────┴─────────┘
```

---

## 🎬 ANIMAÇÕES PREMIUM

### 6.1 Efeitos de Roleta

**Spin Animation:**
```css
Duração: 3.5s
Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)
Transformação: rotate(1440deg) + scale(1.05)
Glow: Borda dourada com pulse animation
Blur: Motion blur efeito
Rotação desigual: Cada rolo gira em velocidade diferente
```

**Parada Sequencial:**
```
Rolo 1: Para em 0.3s (rápido)
Rolo 2: Para em 1.5s (suspense)
Rolo 3: Para em 3.0s (clímax)
Bounce: Pequeno bounce ao parar (efeito físico)
```

### 6.2 Confete de Vitória

```
Partículas:
├── Quantidade: 60-80 confetes
├── Cores: Dourado (#D4AF37), Branco (#FFFFFF), Laranja (#FF6B35)
├── Tipo: Quadrados pequenos com rotação
├── Duração: 4 segundos
├── Trajetória: Queda aleatória com bounce
├── Opacidade: Fade out no final
└── Som: Efeito sonoro sincronizado

Início: A partir do topo da roleta
Distribuição: Spread ao longo da tela
```

### 6.3 Animações de Número (Prêmio)

```
Entrada:
├── Scale: 0 → 1.2 → 1.0
├── Duração: 600ms
├── Cor: #FF6B35 (laranja) → #D4AF37 (dourado)
├── Glow: Brilho intenso
└── Efeito: Pop/bounce

Contagem:
├── Números contam de 0 até o valor final
├── Duração: 1.5s
├── Easing: ease-out
└── Formato: Com separador de milhares (1.000)
```

### 6.4 Transições Gerais

```
Buttons:
├── Hover: scale(1.05) + glow dourado + shadow
├── Click: scale(0.95) (feedback)
├── Transition: 200ms ease-out
└── Active: Borda dourada destaque

Cards:
├── Entrada: Fade in + slide up
├── Saída: Fade out
├── Hover: Borda dourada glow sutil
├── Z-index: Elevação visual ao hover
```

### 6.5 Notificações

```
Vitória:
├── Cor: Verde (#10B981) ou Dourado (#D4AF37)
├── Ícone: ✓ com checkmark animation
├── Posição: Top-right
├── Entrada: Slide in from right (300ms)
├── Permanência: 4 segundos
└── Saída: Fade out (300ms)

Derrota:
├── Cor: Vermelho (#EF4444)
├── Ícone: ✗ com shake animation
├── Permanência: 3 segundos

Sistema:
├── Avisos: Amarelo (#FCD34D)
├── Erros: Vermelho (#EF4444)
├── Info: Azul (#3B82F6)
```

---

## 📱 RESPONSIVIDADE PROFISSIONAL

### 7.1 Breakpoints

```
Desktop Extra Large: > 1920px
├── Sidebar ranking: 320px
├── Main content: Full width
└── Resolução 4K: Suporte completo

Desktop Large: 1200px - 1920px
├── Layout padrão
├── Sidebar: 280px
└── Confortável em todos os tamanhos

Tablet: 768px - 1200px
├── Sidebar: Colapsável
├── Main content: Responsivo
├── Botões: 48px min (touch-friendly)

Mobile: < 768px
├── Roleta: Fullscreen portrait
├── Sidebar: Bottom drawer/hidden
├── Botões: 56px min (thumb-friendly)
├── Font: Aumentada para legibilidade
├── Espaçamento: Aumentado

Mobile Small: < 480px
├── Roleta: Otimizada
├── Texto: Comprimido inteligentemente
├── Stack: Totalmente vertical
```

### 7.2 Adaptações por Device

**Desktop:**
```
Layout: Header (sticky) + Sidebar + Main + Ranking
Roleta: Tamanho normal (400x300px)
Sidebar ranking: Sempre visível
Menu: Horizontal completo
```

**Tablet:**
```
Layout: Header (sticky) + Main (full width)
Ranking: Toggle button (drawer inferior)
Roleta: 90% screen width
Menu: Hamburger compacto
Font: +2px para leitura confortável
```

**Mobile:**
```
Layout: Header (sticky) + Main full width
Ranking: Accessible via tab navigation
Roleta: 100% width com padding
Menu: Hamburger side drawer
Botões: Stack vertical, 100% width
Font: Aumentada, line-height aumentado
```

---

## 🔐 SEGURANÇA & CONFORMIDADE

### 8.1 Autenticação Premium

```
Cadastro:
├── Email: Validação dupla (formato + verificação)
├── Senha: Min 12 chars, uppercase + lowercase + number + symbol
├── 2FA: Opcional (TOTP/SMS)
├── Verificação idade: 18+ obrigatório
└── Termos: Aceitar obrigatoriamente

Login:
├── Email + Senha
├── Rate limiting: Max 5 tentativas/10 min
├── Sessão: 24 horas (refresh token: 7 dias)
├── Logout automático: Inatividade 30 min
└── Histórico de login: Registrado

Recuperação de Senha:
├── Link por email (expira em 1 hora)
├── Reset requer senha antiga
├── 2FA re-habilitado se ativado
└── Notificação de segurança enviada
```

### 8.2 Proteções

```
Hash de Senhas: bcryptjs (salt: 12 rounds)
Comunicação: HTTPS 1.3 TLS 1.3
CORS: Restritivo (apenas domínio)
CSRF: Tokens CSRF em tudo
XSS: Sanitização de input completa
SQL Injection: Prepared statements (Prisma)
Rate Limiting: 100 req/min por IP
Logs: Todas operações auditadas

Dados Sensíveis:
├── Criptografia: AES-256 em repouso
├── Backup: Diário + geo-redundante
└── GDPR: Direito ao esquecimento implementado
```

---

## 🎨 DESIGN PREMIUM - REFERÊNCIAS

### 9.1 Inspiração Visual

Seguir padrão dos cassinos premium:

**KTO Bet:**
- Fundo preto/escuro
- Acentos em dourado/laranja
- Cards com borda fina
- Tipografia limpa e profissional
- Muita margem/espaço em branco

**Ona Bet:**
- Layout moderno e clean
- Sidebar ranking sempre visível
- Animações suaves
- Botões destacados em laranja/vermelho
- Header sticky com logo

**Elementos Aplicar:**
- Fundo dark (#0F0F0F, #1A1A1A)
- Acentos premium (dourado #D4AF37, laranja #FF6B35)
- Cards com borda sutil (1px #D4AF37)
- Sem elementos "coloridos demais"
- Muito espaço em branco/dark space
- Tipografia premium (Inter, Poppins)

---

## 📊 METRICAS & ANALYTICS

### 10.1 KPIs Premium

```
Retenção:
├── D1 (24 horas): Alvo 60%+
├── D7 (7 dias): Alvo 35%+
└── D30 (30 dias): Alvo 15%+

Engajamento:
├── Tempo médio: 20-30 min/sessão
├── Rodadas/usuário: 50-100/dia
├── Taxa retorno: 40%+ (daily active)

Financeiro (futuro):
├── Lucro por usuário: Positivo
├── Churn rate: <5% mensal
├── LTV:CAC ratio: >3:1
```

### 10.2 Tracking

```
Google Analytics 4:
├── Eventos: Cadastro, Login, Giro, Vitória
├── Funnels: Onboarding → Primeiro jogo
└── Segmentação: Device, Geografia, Behav

Sentry:
├── Error tracking
├── Performance monitoring
└── Session replay (opcional)

Custom Dashboards:
├── Real-time: Usuários ativos
├── Ranking: Top performers
└── Tendências: Gráficos de vitória
```

---

## 🚀 TECH STACK FINAL

| Layer | Tecnologia | Motivo |
|-------|-----------|---------|
| **Frontend** | Next.js 14 + React 18 | SSR + Performance + Vercel deploy |
| **Linguagem** | TypeScript | Type-safe, menos bugs, profissional |
| **Estilos** | Tailwind CSS 3 | Responsive, utility-first, dark mode |
| **Animações** | Framer Motion | Profissional, performático |
| **UI Components** | Radix UI + Shadcn | Acessibilidade + customização |
| **Backend** | Node.js + Fastify | Rápido, real-time pronto |
| **Banco** | PostgreSQL + Prisma | Relações, queries complexas, type-safe |
| **Auth** | NextAuth.js + JWT | Seguro, integrado com Next.js |
| **Real-time** | Socket.io + Redis | Ranking live, escalável |
| **Deploy** | Vercel + Railway | Automático, confiável, profissional |
| **Monitoring** | Sentry + GA4 | Erro tracking + analytics |

---

## 📋 CHECKLIST IMPLEMENTAÇÃO

### MVP (Semanas 1-6)

**Semana 1: Setup & Auth**
- [ ] Projeto Next.js + Tailwind
- [ ] Autenticação (cadastro/login)
- [ ] Verificação idade
- [ ] JWT + refresh tokens

**Semana 2: Jogo Roleta**
- [ ] Lógica de roleta (25% vitória)
- [ ] Animações (spin, confete)
- [ ] Som cassino
- [ ] Histórico rodadas

**Semana 3: Ranking & Real-time**
- [ ] Socket.io setup
- [ ] Leaderboard live
- [ ] Badges/conquistas
- [ ] Perfil usuario

**Semana 4: Design Premium**
- [ ] Cores profissionais (#0F0F0F, #D4AF37)
- [ ] Tipografia premium
- [ ] Cards elegantes
- [ ] Glow/efeitos

**Semana 5: Responsividade**
- [ ] Mobile otimizado
- [ ] Tablet layout
- [ ] Touch interactions
- [ ] Performance

**Semana 6: Deploy & QA**
- [ ] Testes finais
- [ ] Deploy Vercel + Railway
- [ ] Analytics setup
- [ ] Monitoramento

---

## 🎯 CONCLUSÃO

**Papagaiada** é posicionado como cassino **premium profissional**, transmitindo confiança através de:

✅ Design dark + dourado (padrão cassinos globais)  
✅ Tipografia premium e limpa  
✅ Animações profissionais (não pueris)  
✅ UX intuitivo e responsivo  
✅ Segurança em primeiro lugar  
✅ Ranking competitivo real-time  
✅ Tecnologia de classe mundial  

**Resultado:** Uma plataforma que compete em qualidade com KTO, Ona e grandes cassinos online.

---

**PAPAGAIADA: JOGUE PREMIUM. GANHE GRANDE.** 🎰✨