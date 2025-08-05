# 🚀 Formulário Multi-Step 

Este projeto é um formulário **multi-etapas** desenvolvido em **React + Vite + TypeScript** utilizando **React Hook Form**, **Zod** para validação, e **ShadCN/UI** para componentes.

## 📋 Funcionalidades

O formulário contém:

-   **Passo 1**: Informações pessoais (Telefone/CPF/CNPJ com máscaras, integração com ReceitaWS para CNPJ)
-   **Passo 2**: Endereço (CEP com máscara, integração com ViaCEP)
-   Validações dinâmicas (CPF/CNPJ obrigatórios conforme tipo de pessoa)
-   Feedback com **toasts** em sucesso e erro
-   Campos auto-preenchidos bloqueados para edição quando retornam de APIs externas

## 🛠 Tecnologias Utilizadas

-   Vite
-   React
-   TypeScript
-   ShadCN/UI
-   React Hook Form
-   Zod
-   Sonner para notificações
-   Integração com **ReceitaWS** e **ViaCEP** (via proxy configurado no Vite)

## 📦 Como Rodar o Projeto Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

```

### 2. Instale as dependências

```bash
npm install

```

ou

```bash
yarn install

```

### 3. Configure o proxy no `vite.config.ts`

O projeto já está configurado para usar as APIs externas (ReceitaWS e ViaCEP) através de proxy, evitando problemas de **CORS**:

```ts
server: {
  proxy: {
    "/api/cnpj": {
      target: "https://www.receitaws.com.br/v1/cnpj",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/cnpj/, ""),
    },
    "/api/cep": {
      target: "https://viacep.com.br/ws",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/cep/, ""),
    },
  },
},

```

### 4. Rode o servidor de desenvolvimento

```bash
npm run dev

```

O projeto ficará disponível em: 👉 **http://localhost:5173**

## ✅ Funcionalidades Implementadas

-   ✨ **Máscaras dinâmicas**: Telefone, CPF, CNPJ e CEP
-   🔍 **Validação de CPF e CNPJ** com algoritmo oficial
-   🏢 **Autopreenchimento** de Razão Social e Nome Fantasia via ReceitaWS
-   📍 **Autopreenchimento** de Endereço, Bairro, Cidade e Estado via ViaCEP
-   🔒 **Campos bloqueados** automaticamente após preenchimento por API
-   📝 **Multi-step form** com validação em cada etapa
-   🎯 **Feedback visual** de sucesso/erro com toasts
