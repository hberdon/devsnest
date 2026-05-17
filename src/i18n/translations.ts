export type Lang = 'es' | 'en'

export interface Translations {
  // Shell / Sidebar
  home: string
  pinned: string
  alsoInSidebar: string
  categories: string
  collapseAll: string
  expandAll: string
  collapse: string
  expand: string
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
  // CommandPalette
  cmdPaletteLabel: string
  cmdPlaceholder: string
  cmdNoResults: string
  cmdBestMatch: string
  cmdOthers: string
  cmdNavigate: string
  cmdOpen: string
  cmdClose: string
  // ShortcutsModal
  shortcutsTitle: string
  shortcutsCloseHint: string
  shortcutOpenPalette: string
  shortcutShowShortcuts: string
  shortcutCloseOverlay: string
  shortcutNavigate: string
  shortcutOpenTool: string
}

export const translations: Record<Lang, Translations> = {
  es: {
    home:                 'Inicio',
    pinned:               'Anclados',
    alsoInSidebar:        '· también en la barra lateral',
    categories:           'Categorías',
    collapseAll:          'Colapsar todo',
    expandAll:            'Expandir todo',
    collapse:             'Colapsar',
    expand:               'Expandir',
    heroTitle:            'Hola, dev 👋',
    heroSub:              '28 herramientas · sin cuenta · todo se procesa en tu navegador',
    searchPlaceholder:    'convertir base64, formatear json, generar uuid…',
    searchHint:           'Ctrl+F para buscar',
    noResults:            'Sin resultados para',
    history:              'Historial',
    historyLastN:         '· últimos',
    clearHistory:         'Limpiar historial',
    noHistory:            'Sin actividad reciente — usa una herramienta y aparecerá aquí.',
    openTool:             'Abrir',
    copyResult:           'Copiar resultado',
    pin:                  'Anclar',
    unpin:                'Quitar de anclados',
    removeTool:           'Eliminar',
    searchTool:           'Buscar',
    toolNotFound:         'Herramienta no encontrada',
    splitV:               'Vertical (lado a lado)',
    splitH:               'Horizontal (apilado)',
    moreOptions:          'Más opciones',
    cmdPaletteLabel:      'Buscar herramienta',
    cmdPlaceholder:       'Buscar herramienta…',
    cmdNoResults:         'Sin resultados para',
    cmdBestMatch:         'Mejor coincidencia',
    cmdOthers:            'Otros',
    cmdNavigate:          'navegar',
    cmdOpen:              'abrir',
    cmdClose:             'cerrar',
    shortcutsTitle:       'Atajos de teclado',
    shortcutsCloseHint:   'Pulsa',
    shortcutOpenPalette:  'Abrir paleta de búsqueda',
    shortcutShowShortcuts:'Mostrar atajos de teclado',
    shortcutCloseOverlay: 'Cerrar overlay / paleta',
    shortcutNavigate:     'Navegar resultados (paleta)',
    shortcutOpenTool:     'Abrir herramienta (paleta)',
  },
  en: {
    home:                 'Home',
    pinned:               'Pinned',
    alsoInSidebar:        '· also in sidebar',
    categories:           'Categories',
    collapseAll:          'Collapse all',
    expandAll:            'Expand all',
    collapse:             'Collapse',
    expand:               'Expand',
    heroTitle:            'Hello, dev 👋',
    heroSub:              '28 tools · no account · everything runs in your browser',
    searchPlaceholder:    'convert base64, format json, generate uuid…',
    searchHint:           'Ctrl+F to search',
    noResults:            'No results for',
    history:              'History',
    historyLastN:         '· last',
    clearHistory:         'Clear history',
    noHistory:            'No recent activity — use a tool and it will appear here.',
    openTool:             'Open',
    copyResult:           'Copy result',
    pin:                  'Pin',
    unpin:                'Unpin',
    removeTool:           'Remove',
    searchTool:           'Search',
    toolNotFound:         'Tool not found',
    splitV:               'Vertical (side by side)',
    splitH:               'Horizontal (stacked)',
    moreOptions:          'More options',
    cmdPaletteLabel:      'Search tool',
    cmdPlaceholder:       'Search tool…',
    cmdNoResults:         'No results for',
    cmdBestMatch:         'Best match',
    cmdOthers:            'Others',
    cmdNavigate:          'navigate',
    cmdOpen:              'open',
    cmdClose:             'close',
    shortcutsTitle:       'Keyboard shortcuts',
    shortcutsCloseHint:   'Press',
    shortcutOpenPalette:  'Open search palette',
    shortcutShowShortcuts:'Show keyboard shortcuts',
    shortcutCloseOverlay: 'Close overlay / palette',
    shortcutNavigate:     'Navigate results (palette)',
    shortcutOpenTool:     'Open tool (palette)',
  },
}
