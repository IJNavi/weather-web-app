# Weather Web App

> ⚠️ This is a personal project created for a Generation Brasil course. It is not intended for commercial use or production deployment.


![CI](https://github.com/IJNavi/weather-web-app/actions/workflows/ci.yml/badge.svg)

A simple weather application built with React, TypeScript, and Tailwind CSS.

[![React](https://img.shields.io/badge/react-18.3.1-blue?logo=react&logoColor=white)](https://react.dev) [![TypeScript](https://img.shields.io/badge/typescript-5.6.2-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![Tailwind CSS](https://img.shields.io/badge/tailwind_css-3.4.5-skyblue?logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![Vite](https://img.shields.io/badge/vite-5.4.1-yellow?logo=vite&logoColor=white)](https://vitejs.dev) [![Vitest](https://img.shields.io/badge/vitest-4.1.4-purple?logo=vitest&logoColor=white)](https://vitest.dev)

## Technologies and tools

- Frontend built with React, TypeScript, Tailwind CSS and Vite.
- Tests implemented with Vitest, React Testing Library, and happy-dom.
- Deployed using GitHub Actions with a Pages workflow.
- Open-Meteo API consumes geolocation and current weather data.

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
4. (Optional) Create a local environment file for configuration:
   ```bash
   touch .env.local
   ```

   Example values:
   ```env
   VITE_OPEN_METEO_GEOCODING_URL=https://geocoding-api.open-meteo.com/v1/search
   VITE_OPEN_METEO_WEATHER_URL=https://api.open-meteo.com/v1/forecast
   ```

   `.env.local` is ignored by Git and is the right place for machine-specific settings.

### Example search

- Enter a city name, such as `São Paulo`.
- Optionally add state and country for ambiguous locations, e.g. `SP`, `Brasil`.

> If you are using the service code directly, you can call:
> ```ts
> import { fetchWeatherByCity } from './src/services/openMeteo';
>
> const weather = await fetchWeatherByCity({
>   city: 'São Paulo',
>   state: 'SP',
>   country: 'Brasil'
> });
>
> console.log(weather.temperature, weather.description);
> ```

## Input validation and request control

- The app trims the city input and sends it to the geocoding API.
- It does not reject numbers or symbols outright, because some place names or geocoding queries may include non-letter characters.
- If the API cannot resolve the query, the app shows a friendly "Cidade não encontrada" message.
- The app disables the search button while a request is pending and blocks duplicate requests in quick succession.
- This helps avoid repeated API calls from accidental multiple clicks or fast retries.

## Search functionality

- The app allows searching by city name.
- For more precise searches, users can also provide the state and country.
- Search is automatically refined to avoid ambiguous results for cities with the same names.
- The service also normalizes accents and name variants, so entries like `Assunção`, `Asunción`, `Montevidéu`, and `Montevideo` are resolved consistently.
- Supports global searches in different countries, including Brazil, USA, and China.
- A new advanced tab allows managing up to 10 cities simultaneously, with batch search and city list controls.

## API usage and security measures

- The application uses the Open-Meteo API to fetch geocoding and current weather data.
- The client-side code prevents multiple simultaneous requests and throttles quick repeated searches.
- The service layer also recognizes API rate-limit responses (`429`) and exposes friendly error messages.
- These protections do not replace server-side rate limiting, but they reduce accidental or abusive traffic from the browser.

## License and intended use

- This project is a personal exercise built for a course by Generation Brasil.
- It is not intended for commercial use or production deployment.
- No monetization, billing, or commercial licensing is expected for this repository.
- The implementation is provided for learning and demonstration only.


## Visual overview

- The page features a dark, modern, and responsive layout.
- The form appears in an elegant card, with clear fields and a highlighted button.
- Weather results are displayed in a side panel, with visually appealing information cards.
- There are light animations and weather icons to make the experience more attractive.
- On mobile, the layout adapts to keep elements readable and with good hierarchy.

## Features

- Weather search by city using the Open-Meteo API
- Support for refined search with state and country
- Advanced tab for multi-city management and batch search
- Detail modal showing extended forecast for selected cities
- Responsive interface with Tailwind CSS
- Light animations and visual loading feedback
- TypeScript logic for typed data

## Project structure

- `src/components` - UI components
- `src/hooks` - weather search state hook
- `src/services` - Open-Meteo client
- `src/types` - TypeScript definitions
- `src/utils` - weather mapping and utilities
- `tests` - unit, integration, and service tests

## Tests

- Run unit and integration tests: `npm run test:run`
- Start the interactive test runner: `npm test`
- Run a specific integration file: `npx vitest run tests/integration/App.integration.test.tsx`
- Run the new advanced search unit tests: `npx vitest run tests/utils/advancedWeather.test.ts`
- Test files are located in `tests/`, including component, integration, and service coverage.
- Current coverage includes:
  - service API error handling
  - persistent browser cache validation for weather search results
  - integration flows for successful search and error display
  - advanced search utilities and interface behavior
  - component rendering and user interactions
- GitHub Actions is configured to run tests before each deploy.
---

## Author

- **Ivan Barbosa**
- [![LinkedIn](https://img.shields.io/badge/LinkedIn-Ivan%C3%BAlio-blue?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ivanj%C3%BAlio)
- [![GitHub](https://img.shields.io/badge/GitHub-IJNavi-black?logo=github&logoColor=white)](https://github.com/IJNavi)

##Co-Author

- [![Copilot](https://img.shields.io/badge/Copilot-GitHub%20Copilot-black?logo=github-copilot&logoColor=white)](https://github.com/features/copilot)

# Weather Web App (Portuguese)

> ⚠️ Este é um projeto pessoal criado para um curso da Generation Brasil. Não se destina a uso comercial nem a implantação em produção.

Aplicativo de clima simples usando React, TypeScript e Tailwind CSS.

[![React](https://img.shields.io/badge/react-18.3.1-blue?logo=react&logoColor=white)](https://react.dev) [![TypeScript](https://img.shields.io/badge/typescript-5.6.2-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![Tailwind CSS](https://img.shields.io/badge/tailwind_css-3.4.5-skyblue?logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![Vite](https://img.shields.io/badge/vite-5.4.1-yellow?logo=vite&logoColor=white)](https://vitejs.dev) [![Vitest](https://img.shields.io/badge/vitest-4.1.4-purple?logo=vitest&logoColor=white)](https://vitest.dev)

## Tecnologias e ferramentas

- Frontend construído com React, TypeScript, Tailwind CSS e Vite.
- Testes implementados com Vitest, React Testing Library e happy-dom.
- Deploy configurado com GitHub Actions e GitHub Pages.
- A API Open-Meteo fornece geolocalização e clima atual.

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
4. (Opcional) Crie um arquivo `.env.local` para configuração local:
   ```bash
   touch .env.local
   ```

   Exemplo de valores:
   ```env
   VITE_OPEN_METEO_GEOCODING_URL=https://geocoding-api.open-meteo.com/v1/search
   VITE_OPEN_METEO_WEATHER_URL=https://api.open-meteo.com/v1/forecast
   ```

   O arquivo `.env.local` é ignorado pelo Git e deve ser usado para configurações específicas da máquina.

## Funcionalidade de busca

- O app permite buscar pelo nome da cidade.
- Para buscas mais precisas, o usuário também pode informar o estado e o país.
- A busca é refinada automaticamente para evitar resultados ambíguos em cidades com nomes iguais.
- Suporta buscas globais em diferentes países, incluindo Brasil, EUA e China.
- A aba de verificação avançada permite pesquisar até 10 cidades, usar buscas múltiplas e acompanhar uma lista de resultados.

## Visão geral visual

- A página possui um layout escuro, moderno e responsivo.
- O formulário aparece em um card elegante, com campos claros e botão destacado.
- Os resultados do clima são exibidos em um painel ao lado, com cards de informação visualmente agradáveis.
- Há animações leves e ícones de clima para deixar a experiência mais atraente.
- No mobile, o layout se adapta para manter os elementos legíveis e com boa hierarquia.

## Recursos

- Busca de clima por cidade usando a API Open-Meteo
- Suporte a busca refinada com estado e país
- Aba avançada para gerenciamento de até 10 cidades simultâneas
- Previsão estendida para planejamento de viagens
- Interface responsiva com Tailwind CSS
- Animações leves e feedback visual de carregamento
- Lógica em TypeScript para dados tipados

## Estrutura

- `src/components` - componentes de interface
- `src/hooks` - hook de estado para busca de clima
- `src/services` - cliente para Open-Meteo
- `src/types` - definições TypeScript
- `src/utils` - mapeamento e utilitários de clima

## Testes

- Execute testes unitários e de integração com `npm run test:run`
- Inicie o runner interativo com `npm test`
- Os arquivos de teste estão em `tests/`, incluindo cobertura para componentes, integração e serviços
- A atual cobertura inclui tratamento de erros de serviço e fluxos de busca na interface

## Segurança e uso de API

- O aplicativo bloqueia buscas duplicadas enquanto uma requisição já está em andamento.
- Ele também evita envios muito rápidos em sequência para reduzir chamadas repetidas à API.
- A API Open-Meteo já responde a limites de taxa, mas o projeto adiciona proteção extra no cliente.
- O aplicativo armazena resultados de clima em cache persistente no navegador (`localStorage`) por até 1 hora.
- Entradas de clima com mais de 1 hora de idade são removidas automaticamente do cache.
- Essas medidas ajudam a evitar uso indevido acidental pela interface do usuário.

## Licenciamento e uso pretendido

- Este projeto é um exercício pessoal desenvolvido para um curso da Generation Brasil.
- Não se destina a uso comercial nem a implantação em produção.
- Não há expectativa de cobrança, monetização ou licença comercial para este repositório.
- A implementação é fornecida apenas para aprendizado e demonstração.

## Autor

- **Ivan Barbosa**
- [![LinkedIn](https://img.shields.io/badge/LinkedIn-Ivan%C3%BAlio-blue?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ivanj%C3%BAlio)
- [![GitHub](https://img.shields.io/badge/GitHub-IJNavi-black?logo=github&logoColor=white)](https://github.com/IJNavi)
- [![Copilot](https://img.shields.io/badge/Copilot-GitHub%20Copilot-black?logo=github-copilot&logoColor=white)](https://github.com/features/copilot)

##Co-Autor

- [![Copilot](https://img.shields.io/badge/Copilot-GitHub%20Copilot-black?logo=github-copilot&logoColor=white)](https://github.com/features/copilot)
