# Pulse Analytics - Painel Interativo de Análise Multidimensional

Plataforma analítica corporativa e interativa desenvolvida com **React 19**, **TypeScript**, **Tailwind CSS** e **Vite**, projetada para exploração visual de dados sob múltiplas perspectivas (visão executiva, gráficos multivariados, tabela dinâmica pivot, análise territorial, correlações estatísticas e base transacional com paginação e CRUD local).

---

## 🚀 Funcionalidades Principais

- **Visão Geral Executiva**: KPIs com progresso em relação a metas, série temporal contínua com tooltips interativos e decomposição de categorias.
- **Explorador Multivariado (6 Tipos de Gráficos)**:
  - Barras comparativas com troca de dimensão (Categoria, Canal, Região).
  - Linha e área de tendência temporal (Receita vs Custos).
  - Donut com cálculo de proporção e market share interno.
  - Gráfico de dispersão e bolhas (Receita x Margem % x Volume).
  - Mapa de Calor (Heatmap Matriz de Intensidade).
  - Radar multidimensional (Spider Chart de 5 eixos operacionais).
- **Tabela Dinâmica (Pivot Table & Drill-down)**: Agrupamento em tempo real por Região, Categoria, Canal, Status ou Trimestre com linhas expansíveis.
- **Análise Territorial**: Diagnóstico e métricas por polo geográfico (Sudeste, Sul, Nordeste, Centro-Oeste, Norte e LATAM).
- **Correlações Estatísticas**: Cruzamento bivariado customizável com cálculo do Coeficiente de Correlação de Pearson ($r$).
- **Data Grid Transacional Completo**: Ordenação por qualquer coluna, paginação dinâmica, filtros, busca instantânea, criação/edição/exclusão de registros.
- **Exportação de Dados**: Download em `.csv` e `.json` ou cópia rápida para o clipboard.
- **Suporte Multimoeda**: Conversão instantânea entre **BRL (R$)**, **USD ($)** e **EUR (€)**.
- **Tema Claro e Escuro**: Alternância de contraste com persistência de preferências.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** (Ícones)
- **Framer Motion / Motion**

---

## 💻 Como Rodar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
   cd NOME_DO_REPOSITORIO
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em: `http://localhost:3000` (ou na porta indicada no terminal).

4. **Gerar build de produção:**
   ```bash
   npm run build
   ```

---

## 🌐 Publicação / Deploy Rápido

### Na Vercel (Recomendado):
1. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
2. Clique em **"Add New" > "Project"** e selecione este repositório.
3. Mantenha as configurações padrão (Framework Preset: **Vite**).
4. Clique em **Deploy**. Seu painel estará online com link HTTPS em menos de 1 minuto!

### No Netlify:
1. Acesse [netlify.com](https://netlify.com) e selecione **"Import from Git"**.
2. Configure o Build Command: `npm run build` e o Publish Directory: `dist`.
3. Clique em **Deploy Site**.

---

## 📄 Licença

Distribuído sob a licença Apache-2.0.
