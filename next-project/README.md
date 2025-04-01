# Plataforma de Assinatura Digital de Documentos

## 📋 Sobre o Projeto
Este projeto é uma plataforma de assinatura digital de documentos desenvolvida como teste técnico para a Supersign. A aplicação permite que usuários façam upload de documentos PDF, visualizem e assinem digitalmente, com um sistema de autenticação seguro e uma interface moderna e responsiva.

## 🎯 Objetivo
O objetivo deste projeto é demonstrar habilidades em desenvolvimento frontend com Next.js, implementando funcionalidades essenciais de uma plataforma de assinatura digital, incluindo:
- Autenticação de usuários
- Upload e gerenciamento de documentos
- Visualização de PDFs
- Sistema de assinatura digital
- Interface responsiva e acessível

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação
- Login com e-mail/senha
- Autenticação via Google OAuth
- Proteção de rotas privadas
- Gerenciamento de sessão
- Logout

### 📄 Gerenciamento de Documentos
- Upload de documentos PDF (limitado a uma página)
- Listagem de documentos do usuário
- Visualização de documentos
- Exclusão de documentos
- Status de assinatura (Pendente/Assinado)
- Validação de tipo de arquivo e número de páginas

### ✍️ Assinatura Digital
- Interface intuitiva para assinatura
- Registro de assinatura com timestamp
- Visualização da assinatura no documento
- Posicionamento flexível da assinatura

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Formulários:** React Hook Form
- **Gerenciamento de Estado:** Zustand
- **Autenticação:** NextAuth.js v4
- **Manipulação de PDFs:** PDF-lib

### Backend
- **API Routes:** Next.js API Routes
- **ORM:** Prisma
- **Banco de Dados:** SQLite
- **Upload de Arquivos:** Sistema nativo do Next.js

## 🚀 Como Executar o Projeto

1. **Clone o repositório**
```bash
git clone [URL_DO_REPOSITÓRIO]
cd next-project
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```
Configure as seguintes variáveis no arquivo `.env`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"
```

4. **Execute as migrações do Prisma**
```bash
npx prisma migrate dev
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

## 🏗️ Arquitetura e Decisões Técnicas

### Estrutura do Projeto
```
src/
├── app/                    # Rotas e páginas (App Router)
│   ├── api/               # Rotas de API
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Área do usuário
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI reutilizáveis
│   └── header.tsx        # Componente de cabeçalho
├── lib/                   # Utilitários e configurações
│   ├── auth.ts           # Configuração do NextAuth
│   └── prisma.ts         # Cliente Prisma
└── types/                # Definições de tipos TypeScript
```

### Decisões Técnicas Principais

1. **App Router do Next.js**
   - Escolhido para melhor performance e SEO
   - Suporte nativo a Server Components
   - Melhor gerenciamento de rotas e layouts

2. **Prisma ORM**
   - Simplifica operações com banco de dados
   - Type safety com TypeScript
   - Migrations automáticas

3. **Zustand para Gerenciamento de Estado**
   - Leve e fácil de usar
   - Integração perfeita com React
   - Performance otimizada

4. **shadcn/ui + Tailwind CSS**
   - Componentes acessíveis e customizáveis
   - Design system consistente
   - Responsividade nativa

## 🎨 UI/UX

### Design System
- Cores consistentes e acessíveis
- Tipografia clara e legível
- Espaçamento e hierarquia visual bem definidos
- Feedback visual para ações do usuário

### Responsividade
- Layout adaptativo para diferentes dispositivos
- Componentes responsivos
- Experiência otimizada para mobile

### Acessibilidade
- Componentes ARIA-compliant
- Navegação por teclado
- Contraste adequado
- Mensagens de erro claras

## 🔒 Segurança

- Autenticação robusta com NextAuth.js
- Proteção de rotas privadas
- Validação de arquivos no upload
- Sanitização de inputs
- Armazenamento seguro de senhas

## 📈 Performance

- Otimização de imagens
- Lazy loading de componentes
- Cache de dados com Zustand
- Server Components para melhor performance

## 🧪 Testes

O projeto inclui:
- Validação de tipos com TypeScript
- Tratamento de erros robusto
- Validação de formulários
- Testes de integração com API

## 🚧 Desafios e Soluções

1. **Manipulação de PDFs**
   - Desafio: Implementar assinatura digital em PDFs
   - Solução: Utilização da biblioteca pdf-lib para manipulação segura de PDFs

2. **Upload de Arquivos**
   - Desafio: Gerenciar uploads de forma segura e eficiente
   - Solução: Implementação de validação de tipo e tamanho, com armazenamento local

3. **Estado Global**
   - Desafio: Gerenciar estado da aplicação de forma eficiente
   - Solução: Implementação do Zustand para gerenciamento de estado global

## 📝 Documentação

O código está documentado com:
- Comentários explicativos em partes complexas
- Tipos TypeScript bem definidos
- README detalhado
- Estrutura de arquivos organizada

## 🤝 Contribuição

Este é um projeto de teste técnico, mas sugestões e melhorias são bem-vindas!

## 📄 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido com ❤️ para a Supersign 