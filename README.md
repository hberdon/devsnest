# devsnest

> Caja de herramientas para desarrolladores — 100% client-side, sin backend, sin telemetría.

## ¿Qué es?

Colección de 28 utilidades dev agrupadas en 6 categorías. Todo corre en el navegador: nada se envía a ningún servidor.

## Herramientas

| Categoría | Herramientas |
|-----------|-------------|
| **Conversores** | Base64, Hex/Binario, URL Encode, Color HEX↔RGB↔HSL, JWT Decode, Unix Timestamp |
| **Formateadores** | JSON, XML, YAML, JSON Schema, Markdown, JSON Pretty, XML Pretty, SQL, CSS/SCSS |
| **Generadores** | UUID/ULID, Hash MD5/SHA, Password, Lorem Ipsum, QR Code |
| **Utilidades** | Diff, Regex Tester, Case Converter, Contador |
| **Red** | IP Lookup, Headers HTTP, CIDR, DNS |
| **Cripto** | Bcrypt, AES-256, RSA Keys |

## Stack

- **React 19** + **TypeScript 5.8** (strict)
- **Vite 6** — bundler y dev server
- **React Router 7** — navegación client-side
- **Nunito** (UI) + **JetBrains Mono** (código)

## Comandos

```bash
npm install       # instalar dependencias
npm run dev       # dev server → http://localhost:5173
npm run build     # build de producción → dist/
npm run preview   # preview del build
npm run type-check # TypeScript sin emitir
```

## Temas

8 paletas de color × 2 modos (Light / Dark), seleccionables desde el panel lateral sin recargar la página. El tema se persiste en `localStorage`.

| Paleta | Acento |
|--------|--------|
| Vivid | `#5f36fe` |
| Sky & Slate | `#0ea5e9` |
| Royal & Gold | `#3730a3` |
| Cobalt & Lime | `#005bea` |
| Navy & Coral | `#1e3a8a` |
| Midnight & Cyan | `#0050d8` |
| Indigo & Coral | `#4361ee` |
| Teal & Amber | `#0fa3b1` |

## Estructura

```
src/
├── components/      # Sidebar, ToolLayout, SplitPane, CommandPalette
├── design-system/   # tokens.css (colores, tipografía, espaciado)
├── hooks/           # useLocalStorage, useDebounce
├── pages/           # Dashboard, ToolPage
├── router/          # React Router config
├── store/           # Contexts: theme, cmd-palette, devtools
└── tools/           # Una carpeta por herramienta + registry.ts + loader.ts
```

## Licencia

MIT
