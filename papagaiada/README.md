# 🦜 Papagaio Casino

Caça-níqueis e roleta europeia 100% fictícios. Jogável de qualquer dispositivo, sem cadastro, sem dinheiro real — só diversão com **penas** 🪶.

## Funcionalidades
- **Roleta Europeia** (0–36): apostas por número, cor, par/ímpar, baixo/alto e dúzias
- **Caça-Níqueis**: 3 rolos, 6 símbolos, jackpot de **250x**
- Silencioso progresso no próprio navegador (`localStorage`)
- Perfis com avatar, bônus diário, resgate quando zerar
- Ranking e estatísticas locais
- Efeitos sonoros via Web Audio API

## Rodar localmente

```bash
npm install
npm run dev
# abra http://localhost:3000
```

## Testes

```bash
npm run lint          # ESLint
npm run build         # build de produção + typecheck
npm run test:logic    # unidade (roleta, slots, RTP)
npm run test:e2e      # fluxo completo no navegador (precisa do servidor rodando)
npm run test:visual   # responsividade mobile + fontes
```

Para E2E/visual, primeiro suba o servidor em uma porta e aponte `APP_URL`:

```bash
npm run build && npm start -- -p 3100
$env:APP_URL="http://localhost:3100"; npm run test:e2e
```

## Deploy na Vercel

1. Suba o repositório para o GitHub
2. Vá para https://vercel.com/new e **Import** o repositório
3. Framework detectado: **Next.js** · sem precisar configurar nada
4. **Deploy** — pronto, a URL pública está no ar

> Sem backend, sem banco pago. Dados ficam no navegador de cada visitante.
> Quando quiser ranking/progresso compartilhado, basta plugar Supabase (Postgres grátis) na camada `lib/store.tsx`.