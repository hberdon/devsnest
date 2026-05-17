export type Lang = 'es' | 'en'

export interface Translations {
  // Shell / Sidebar
  home: string
  pinned: string
  alsoInSidebar: string
  categories: string
  collapseAll: string
  expandAll: string
  // Dashboard hero
  heroTitle: string
  heroSub: string
  searchPlaceholder: string
  searchHint: string
  noResults: string
  // Dashboard sections
  history: string
  historyLastN: string
  clearHistory: string
  noHistory: string
  // Row actions
  openTool: string
  copyResult: string
  pin: string
  unpin: string
  removeTool: string
  // ToolLayout
  searchTool: string
  toolNotFound: string
  splitV: string
  splitH: string
  moreOptions: string
}

export const translations: Record<Lang, Translations> = {
  es: {
    home:             'Inicio',
    pinned:           'Anclados',
    alsoInSidebar:    '· también en la barra lateral',
    categories:       'Categorías',
    collapseAll:      'Colapsar todo',
    expandAll:        'Expandir todo',
    heroTitle:        'Hola, dev 👋',
    heroSub:          '28 herramientas · sin cuenta · todo se procesa en tu navegador',
    searchPlaceholder:'convertir base64, formatear json, generar uuid…',
    searchHint:       'Ctrl+F para buscar',
    noResults:        'Sin resultados para',
    history:          'Historial',
    historyLastN:     '· últimos',
    clearHistory:     'Limpiar historial',
    noHistory:        'Sin actividad reciente — usa una herramienta y aparecerá aquí.',
    openTool:         'Abrir',
    copyResult:       'Copiar resultado',
    pin:              'Anclar',
    unpin:            'Quitar de anclados',
    removeTool:       'Eliminar',
    searchTool:       'Buscar herramienta',
    toolNotFound:     'Herramienta no encontrada',
    splitV:           'Vertical (lado a lado)',
    splitH:           'Horizontal (apilado)',
    moreOptions:      'Más opciones',
  },
  en: {
    home:             'Home',
    pinned:           'Pinned',
    alsoInSidebar:    '· also in sidebar',
    categories:       'Categories',
    collapseAll:      'Collapse all',
    expandAll:        'Expand all',
    heroTitle:        'Hello, dev 👋',
    heroSub:          '28 tools · no account · everything runs in your browser',
    searchPlaceholder:'convert base64, format json, generate uuid…',
    searchHint:       'Ctrl+F to search',
    noResults:        'No results for',
    history:          'History',
    historyLastN:     '· last',
    clearHistory:     'Clear history',
    noHistory:        'No recent activity — use a tool and it will appear here.',
    openTool:         'Open',
    copyResult:       'Copy result',
    pin:              'Pin',
    unpin:            'Unpin',
    removeTool:       'Remove',
    searchTool:       'Search tool',
    toolNotFound:     'Tool not found',
    splitV:           'Vertical (side by side)',
    splitH:           'Horizontal (stacked)',
    moreOptions:      'More options',
  },
}
