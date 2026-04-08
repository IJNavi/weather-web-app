# Weather Web App

A simple weather application built with React, TypeScript, and Tailwind CSS.

## How to use

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run in development mode:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:5173`

## Search functionality

- The app allows searching by city name.
- For more precise searches, users can also provide the state and country.
- Search is automatically refined to avoid ambiguous results for cities with the same names.
- Supports global searches in different countries, including Brazil, USA, and China.

## Visual overview

- The page features a dark, modern, and responsive layout.
- The form appears in an elegant card, with clear fields and a highlighted button.
- Weather results are displayed in a side panel, with visually appealing information cards.
- There are light animations and weather icons to make the experience more attractive.
- On mobile, the layout adapts to keep elements readable and with good hierarchy.

## Features

- Weather search by city using the Open-Meteo API
- Support for refined search with state and country
- Responsive interface with Tailwind CSS
- Light animations and visual loading feedback
- TypeScript logic for typed data

## Project structure

- `src/components` - UI components
- `src/hooks` - weather search state hook
- `src/services` - Open-Meteo client
- `src/types` - TypeScript definitions
- `src/utils` - weather mapping and utilities

---

# Weather Web App (Portuguese)

Aplicativo de clima simples usando React, TypeScript e Tailwind CSS.

## Como usar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Abra o navegador em `http://localhost:5173`

## Funcionalidade de busca

- O app permite buscar pelo nome da cidade.
- Para buscas mais precisas, o usuário também pode informar o estado e o país.
- A busca é refinada automaticamente para evitar resultados ambíguos em cidades com nomes iguais.
- Suporta buscas globais em diferentes países, incluindo Brasil, EUA e China.

## Visão geral visual

- A página possui um layout escuro, moderno e responsivo.
- O formulário aparece em um card elegante, com campos claros e botão destacado.
- Os resultados do clima são exibidos em um painel ao lado, com cards de informação visualmente agradáveis.
- Há animações leves e ícones de clima para deixar a experiência mais atraente.
- No mobile, o layout se adapta para manter os elementos legíveis e com boa hierarquia.

## Recursos

- Busca de clima por cidade usando a API Open-Meteo
- Suporte a busca refinada com estado e país
- Interface responsiva com Tailwind CSS
- Animações leves e feedback visual de carregamento
- Lógica em TypeScript para dados tipados

## Estrutura

- `src/components` - componentes de interface
- `src/hooks` - hook de estado para busca de clima
- `src/services` - cliente para Open-Meteo
- `src/types` - definições TypeScript
- `src/utils` - mapeamento e utilitários de clima

