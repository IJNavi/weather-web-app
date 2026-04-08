# Weather Web App

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
