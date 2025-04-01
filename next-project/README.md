# SuperSign - Plataforma de Assinatura Digital

Este é um projeto de teste técnico para uma plataforma de assinatura digital de documentos, desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## 🚀 Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth.js v4
- Prisma ORM
- SQLite
- shadcn/ui
- Zustand (Gerenciamento de Estado)

## 📋 Funcionalidades

- Autenticação de usuários (Email/Senha e Google OAuth)
- Upload e gerenciamento de documentos PDF
- Visualização de documentos
- Simulação de assinatura digital
- Interface responsiva e acessível

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/supersign.git
cd supersign
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Rotas e páginas da aplicação
├── components/            # Componentes reutilizáveis
├── lib/                   # Utilitários e configurações
├── prisma/               # Schema e migrações do Prisma
├── store/                # Estado global com Zustand
└── types/                # Definições de tipos TypeScript
```

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"
```

## 🧪 Testes

Para executar os testes:

```bash
npm run test
```

## 📝 Licença

Este projeto está sob a licença MIT. 