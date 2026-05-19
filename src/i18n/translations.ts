export type Lang = 'es' | 'en'

export interface Translations {
  // ── Shell / Sidebar ───────────────────────────────────────────────────────
  home: string
  pinned: string
  alsoInSidebar: string
  categories: string
  collapseAll: string
  expandAll: string
  collapse: string
  expand: string
  // ── Dashboard hero ────────────────────────────────────────────────────────
  heroTitle: string
  heroSub: string
  searchPlaceholder: string
  searchHint: string
  noResults: string
  // ── Dashboard sections ────────────────────────────────────────────────────
  history: string
  historyLastN: string
  clearHistory: string
  noHistory: string
  // ── Row actions ───────────────────────────────────────────────────────────
  openTool: string
  copyResult: string
  pin: string
  unpin: string
  removeTool: string
  // ── ToolLayout ────────────────────────────────────────────────────────────
  searchTool: string
  toolNotFound: string
  splitV: string
  splitH: string
  moreOptions: string
  // ── CommandPalette ────────────────────────────────────────────────────────
  cmdPaletteLabel: string
  cmdPlaceholder: string
  cmdNoResults: string
  cmdBestMatch: string
  cmdOthers: string
  cmdNavigate: string
  cmdOpen: string
  cmdClose: string
  // ── ShortcutsModal ────────────────────────────────────────────────────────
  shortcutsTitle: string
  shortcutsCloseHint: string
  shortcutOpenPalette: string
  shortcutShowShortcuts: string
  shortcutCloseOverlay: string
  shortcutNavigate: string
  shortcutOpenTool: string
  // ── Registry — category names ─────────────────────────────────────────────
  catConv: string
  catFmt: string
  catGen: string
  catUtils: string
  catNet: string
  catCrypt: string
  // ── Common tool UI ────────────────────────────────────────────────────────
  tcActions: string
  tcFormat: string
  tcMinify: string
  tcCopy: string
  tcCopied: string
  tcCopiedKey: string
  tcClearEditor: string
  tcPaste: string
  tcExport: string
  tcLoadFile: string
  tcRegenerate: string
  tcAutoUpdates: string
  tcAutoFormats: string
  tcLines: string
  tcBytes: string
  tcDepth: string
  tcInput: string
  tcOutput: string
  tcTree: string
  tcNavigable: string
  tcExpandAll: string
  tcResult: string
  tcOr: string
  tcEmptyTreeFix: string
  tcEmptyTreeHere: string
  // ── Base64 ───────────────────────────────────────────────────────────────
  b64Invalid: string
  b64UrlSafe: string
  b64NoPadding: string
  b64InputText: string
  b64InputB64: string
  b64OutputB64: string
  b64OutputText: string
  b64PlaceholderText: string
  b64PlaceholderB64: string
  // ── Hex / Binary ─────────────────────────────────────────────────────────
  hexInvalid: string
  binInvalid: string
  hexTextToHex: string
  hexTextToBin: string
  hexHexToText: string
  hexBinToText: string
  // ── URL Encode ────────────────────────────────────────────────────────────
  urlInvalid: string
  urlInputText: string
  urlInputEncoded: string
  urlOutputEncoded: string
  urlOutputDecoded: string
  // ── Color ─────────────────────────────────────────────────────────────────
  colorPicker: string
  colorInvalid: string
  colorEmpty: string
  // ── JWT Decode ────────────────────────────────────────────────────────────
  jwtExpiresIn: string
  jwtExpiredAgo: string
  jwtInvalid: string
  jwtEmpty: string
  jwt3Parts: string
  // ── Unix Timestamp ────────────────────────────────────────────────────────
  tsNow: string
  tsNowBtn: string
  tsEpochToDate: string
  tsDateToEpoch: string
  tsInvalidEpoch: string
  tsInvalidDate: string
  tsRelative: string
  // ── JSON ──────────────────────────────────────────────────────────────────
  jsonCopyJson: string
  jsonExportJson: string
  jsonValidateSchema: string
  jsonErrorLine: string
  jsonReadyToValidate: string
  jsonPasteLeft: string
  jsonValid: string
  jsonNoErrors: string
  jsonSyntaxOk: string
  jsonInvalid: string
  jsonOneError: string
  jsonCopyPath: string
  jsonKeys: string
  // ── XML ───────────────────────────────────────────────────────────────────
  xmlInvalid: string
  xmlEmpty: string
  xmlCopyXml: string
  xmlExportXml: string
  xmlValid: string
  xmlPasteLeft: string
  xmlFixForTree: string
  xmlTreeHere: string
  xmlElements: string
  xmlAttributes: string
  xmlValidated: string
  // ── YAML ─────────────────────────────────────────────────────────────────
  yamlInvalid: string
  // ── JSON Schema ───────────────────────────────────────────────────────────
  schemaValidationOk: string
  schemaValidationFailed: string
  schemaEmpty: string
  schemaValid: string
  schemaErrors: string
  schemaError: string
  // ── Markdown ─────────────────────────────────────────────────────────────
  mdPreviewLive: string
  mdPreviewLabel: string
  mdEmpty: string
  // ── JSON Pretty ──────────────────────────────────────────────────────────
  jpMinifiedLabel: string
  jpPrettyLabel: string
  // ── XML Pretty ───────────────────────────────────────────────────────────
  xpPretty: string
  xpIndent: string
  xpTab: string
  xpSpaces: string
  // ── SQL ───────────────────────────────────────────────────────────────────
  sqlInvalid: string
  sqlFormatted: string
  // ── CSS / SCSS ────────────────────────────────────────────────────────────
  cssFormatted: string
  // ── UUID / ULID ───────────────────────────────────────────────────────────
  uuidCopyAll: string
  uuidGeneratedSuffix: string
  // ── Hash ─────────────────────────────────────────────────────────────────
  hashInputLabel: string
  hashInputPlaceholder: string
  // ── Password ─────────────────────────────────────────────────────────────
  pwNoOptions: string
  pwLength: string
  pwChars: string
  pwUppercase: string
  pwLowercase: string
  pwNumbers: string
  pwSymbols: string
  // ── Lorem Ipsum ───────────────────────────────────────────────────────────
  loremGeneratedSuffix: string
  loremWords: string
  loremSentences: string
  loremParagraphs: string
  loremConfig: string
  loremHelp: string
  loremWordsSuffix: string
  // ── QR Code ───────────────────────────────────────────────────────────────
  qrTextOrUrl: string
  qrDownload: string
  qrEmpty: string
  // ── Diff ─────────────────────────────────────────────────────────────────
  diffOriginal: string
  diffModified: string
  diffAdded: string
  diffRemoved: string
  diffNoChanges: string
  diffEmpty: string
  // ── Regex ─────────────────────────────────────────────────────────────────
  regexInvalid: string
  regexGlobal: string
  regexCaseInsensitive: string
  regexMultiline: string
  regexDotAll: string
  regexInput: string
  regexInputPlaceholder: string
  regexMatches: string
  regexGroups: string
  // ── Case Converter ────────────────────────────────────────────────────────
  caseInput: string
  casePlaceholder: string
  // ── Contador ─────────────────────────────────────────────────────────────
  cntChars: string
  cntNoSpaces: string
  cntWords: string
  cntLines: string
  cntSentences: string
  cntBytesLabel: string
  cntReading: string
  cntLess1Min: string
  cntPlaceholder: string
  // ── IP Lookup ─────────────────────────────────────────────────────────────
  ipLabelIp: string
  ipLabelCity: string
  ipLabelRegion: string
  ipLabelCountry: string
  ipLabelOrg: string
  ipLabelTz: string
  ipLabelUtc: string
  ipLabelLat: string
  ipLabelLon: string
  ipPlaceholder: string
  ipSearching: string
  ipSearch: string
  ipMyIp: string
  ipViewMap: string
  ipEmpty: string
  // ── Headers HTTP ─────────────────────────────────────────────────────────
  httpCors: string
  httpLoading: string
  httpInspect: string
  httpHeadersSuffix: string
  httpEmpty1: string
  httpEmpty2: string
  // ── CIDR ─────────────────────────────────────────────────────────────────
  cidrNetwork: string
  cidrMask: string
  cidrWildcard: string
  cidrFirstIp: string
  cidrLastIp: string
  cidrBroadcast: string
  cidrTotal: string
  cidrUsable: string
  cidrLabel: string
  cidrInvalid: string
  cidrUsableLabel: string
  // ── DNS ───────────────────────────────────────────────────────────────────
  dnsSearching: string
  dnsSearch: string
  dnsNoRecords: string
  dnsEmpty: string
  // ── Bcrypt ───────────────────────────────────────────────────────────────
  bcHashTab: string
  bcVerifyTab: string
  bcInputHash: string
  bcPlaceholderHash: string
  bcRounds: string
  bcIterationsSuffix: string
  bcHashing: string
  bcGenerateHash: string
  bcInputPlain: string
  bcPlaceholderPlain: string
  bcInputBcrypt: string
  bcVerifying: string
  bcVerifyBtn: string
  bcMatch: string
  bcNoMatch: string
  // ── AES ───────────────────────────────────────────────────────────────────
  aesEncryptError: string
  aesWrongKey: string
  aesDecryptError: string
  aesEncrypt: string
  aesDecrypt: string
  aesPasswordLabel: string
  aesPasswordPlaceholder: string
  aesInputPlain: string
  aesInputEncrypted: string
  aesPlaceholderEncrypt: string
  aesPlaceholderDecrypt: string
  aesAlgorithm: string
  aesOutputEncrypted: string
  aesOutputDecrypted: string
  // ── RSA ───────────────────────────────────────────────────────────────────
  rsaError: string
  rsaPublic: string
  rsaPrivate: string
  rsaNote: string
  // ── Notepad ──────────────────────────────────────────────────────────────
  npdLoad: string
  npdSave: string
  npdCopy: string
  npdCopied: string
  npdAddTab: string
  npdUntitled: string
  npdCloseTab: string
  npdPlaceholder: string
  // ── Img ↔ Base64 ─────────────────────────────────────────────────────────
  imgFileToB64: string
  imgB64ToFile: string
  imgDropHint: string
  imgDropSub: string
  imgWithPrefix: string
  imgDownload: string
  imgPasteB64: string
  imgB64Placeholder: string
  imgInvalid: string
  imgChange: string
  imgInfoName: string
  imgInfoType: string
  imgInfoDims: string
  imgInfoSize: string
  // ── PDF ↔ Base64 ─────────────────────────────────────────────────────────
  pdfFileToB64: string
  pdfB64ToFile: string
  pdfDropHint: string
  pdfDropSub: string
  pdfDownload: string
  pdfPasteB64: string
  pdfB64Placeholder: string
  pdfInvalid: string
}

export const translations: Record<Lang, Translations> = {
  es: {
    // Shell
    home:                  'Inicio',
    pinned:                'Anclados',
    alsoInSidebar:         '· también en la barra lateral',
    categories:            'Categorías',
    collapseAll:           'Colapsar todo',
    expandAll:             'Expandir todo',
    collapse:              'Colapsar',
    expand:                'Expandir',
    heroTitle:             'Hola, dev 👋',
    heroSub:               '28 herramientas · sin cuenta · todo se procesa en tu navegador',
    searchPlaceholder:     'convertir base64, formatear json, generar uuid…',
    searchHint:            'Ctrl+F para buscar',
    noResults:             'Sin resultados para',
    history:               'Historial',
    historyLastN:          '· últimos',
    clearHistory:          'Limpiar historial',
    noHistory:             'Sin actividad reciente — usa una herramienta y aparecerá aquí.',
    openTool:              'Abrir',
    copyResult:            'Copiar resultado',
    pin:                   'Anclar',
    unpin:                 'Quitar de anclados',
    removeTool:            'Eliminar',
    searchTool:            'Buscar',
    toolNotFound:          'Herramienta no encontrada',
    splitV:                'Vertical (lado a lado)',
    splitH:                'Horizontal (apilado)',
    moreOptions:           'Más opciones',
    cmdPaletteLabel:       'Buscar herramienta',
    cmdPlaceholder:        'Buscar herramienta…',
    cmdNoResults:          'Sin resultados para',
    cmdBestMatch:          'Mejor coincidencia',
    cmdOthers:             'Otros',
    cmdNavigate:           'navegar',
    cmdOpen:               'abrir',
    cmdClose:              'cerrar',
    shortcutsTitle:        'Atajos de teclado',
    shortcutsCloseHint:    'Pulsa',
    shortcutOpenPalette:   'Abrir paleta de búsqueda',
    shortcutShowShortcuts: 'Mostrar atajos de teclado',
    shortcutCloseOverlay:  'Cerrar overlay / paleta',
    shortcutNavigate:      'Navegar resultados (paleta)',
    shortcutOpenTool:      'Abrir herramienta (paleta)',
    // Registry
    catConv:               'Conversores',
    catFmt:                'Formateadores',
    catGen:                'Generadores',
    catUtils:              'Utilidades',
    catNet:                'Red',
    catCrypt:              'Cripto',
    // Common tool UI
    tcActions:             'Acciones',
    tcFormat:              'Formatear',
    tcMinify:              'Minificar',
    tcCopy:                'Copiar',
    tcCopied:              '✓ Copiado',
    tcCopiedKey:           '✓ Copiada',
    tcClearEditor:         'Limpiar editor',
    tcPaste:               'Pegar',
    tcExport:              'Exportar',
    tcLoadFile:            'Cargar fichero',
    tcRegenerate:          'Regenerar',
    tcAutoUpdates:         'auto-actualiza',
    tcAutoFormats:         'auto-formatea',
    tcLines:               'líneas',
    tcBytes:               'bytes',
    tcDepth:               'profundidad',
    tcInput:               'Entrada',
    tcOutput:              'Salida',
    tcTree:                'Árbol',
    tcNavigable:           'navegable',
    tcExpandAll:           'expandir todo',
    tcResult:              'Resultado',
    tcOr:                  'o',
    tcEmptyTreeFix:        'Corrige el JSON para ver el árbol',
    tcEmptyTreeHere:       'El árbol aparecerá aquí',
    // Base64
    b64Invalid:            'Base64 inválido',
    b64UrlSafe:            'URL-safe',
    b64NoPadding:          'Sin padding',
    b64InputText:          'Entrada (texto)',
    b64InputB64:           'Entrada (Base64)',
    b64OutputB64:          'Salida (Base64)',
    b64OutputText:         'Salida (texto)',
    b64PlaceholderText:    'Escribe o pega texto…',
    b64PlaceholderB64:     'Pega el Base64 aquí…',
    // Hex / Binary
    hexInvalid:            'Hex inválido — usa bytes separados por espacio (ej: 48 65 6c 6c 6f)',
    binInvalid:            'Binario inválido — usa bytes de 8 bits separados por espacio',
    hexTextToHex:          'Texto → Hex',
    hexTextToBin:          'Texto → Bin',
    hexHexToText:          'Hex → Texto',
    hexBinToText:          'Bin → Texto',
    // URL Encode
    urlInvalid:            'URL encoding inválido',
    urlInputText:          'Texto sin codificar',
    urlInputEncoded:       'URL codificada',
    urlOutputEncoded:      'URL codificada',
    urlOutputDecoded:      'Texto decodificado',
    // Color
    colorPicker:           'Selector de color',
    colorInvalid:          'Formato no reconocido. Usa #hex, rgb(...) o hsl(...)',
    colorEmpty:            'Introduce un color para ver su conversión',
    // JWT Decode
    jwtExpiresIn:          'expira en',
    jwtExpiredAgo:         'expiró hace',
    jwtInvalid:            'JWT inválido — debe tener 3 partes separadas por punto',
    jwtEmpty:              'Pega un JWT para decodificarlo',
    jwt3Parts:             '3 partes',
    // Unix Timestamp
    tsNow:                 'Ahora → ',
    tsNowBtn:              'Ahora mismo',
    tsEpochToDate:         'Epoch → Fecha',
    tsDateToEpoch:         'Fecha → Epoch',
    tsInvalidEpoch:        'Epoch inválido — introduce un número',
    tsInvalidDate:         'Fecha inválida',
    tsRelative:            'Relativo',
    // JSON
    jsonCopyJson:          'Copiar JSON',
    jsonExportJson:        'Exportar JSON',
    jsonValidateSchema:    'Validar Schema',
    jsonErrorLine:         '↑ error línea',
    jsonReadyToValidate:   'Listo para validar',
    jsonPasteLeft:         'pega tu JSON a la izquierda',
    jsonValid:             'JSON válido',
    jsonNoErrors:          '0 errores · 0 warnings',
    jsonSyntaxOk:          'Sintaxis correcta, estructura verificada.',
    jsonInvalid:           'JSON inválido',
    jsonOneError:          '1 error · 0 warnings',
    jsonCopyPath:          'Copiar ruta',
    jsonKeys:              'keys',
    // XML
    xmlInvalid:            'XML inválido',
    xmlEmpty:              '(vacío)',
    xmlCopyXml:            'Copiar XML',
    xmlExportXml:          'Exportar XML',
    xmlValid:              'XML válido',
    xmlPasteLeft:          'pega tu XML a la izquierda',
    xmlFixForTree:         'Corrige el XML para ver el árbol',
    xmlTreeHere:           'El árbol aparecerá aquí',
    xmlElements:           'elementos',
    xmlAttributes:         'atributos',
    xmlValidated:          'Validado',
    // YAML
    yamlInvalid:           'YAML inválido',
    // JSON Schema
    schemaValidationOk:    'Validación OK',
    schemaValidationFailed:'Validación fallida',
    schemaEmpty:           'Introduce schema y data para validar',
    schemaValid:           'Válido — el data cumple el schema',
    schemaErrors:          'errores',
    schemaError:           'error',
    // Markdown
    mdPreviewLive:         'preview en vivo',
    mdPreviewLabel:        'Preview',
    mdEmpty:               'El preview aparecerá aquí',
    // JSON Pretty
    jpMinifiedLabel:       'Minificado',
    jpPrettyLabel:         'Pretty',
    // XML Pretty
    xpPretty:              'Pretty',
    xpIndent:              'indent',
    xpTab:                 'Tab',
    xpSpaces:              'esp',
    // SQL
    sqlInvalid:            'SQL inválido',
    sqlFormatted:          'Formateado',
    // CSS / SCSS
    cssFormatted:          'Formateado',
    // UUID / ULID
    uuidCopyAll:           'Copiar todos',
    uuidGeneratedSuffix:   'generados',
    // Hash
    hashInputLabel:        'Texto de entrada',
    hashInputPlaceholder:  'Escribe o pega el texto a hashear…',
    // Password
    pwNoOptions:           'Activa al menos una opción',
    pwLength:              'Longitud',
    pwChars:               'Caracteres',
    pwUppercase:           'Mayúsculas',
    pwLowercase:           'Minúsculas',
    pwNumbers:             'Números',
    pwSymbols:             'Símbolos',
    // Lorem Ipsum
    loremGeneratedSuffix:  'generados',
    loremWords:            'Palabras',
    loremSentences:        'Oraciones',
    loremParagraphs:       'Párrafos',
    loremConfig:           'Configuración',
    loremHelp:             'Selecciona tipo y cantidad en la barra superior, luego haz clic en Regenerar.',
    loremWordsSuffix:      'palabras',
    // QR Code
    qrTextOrUrl:           'Texto o URL',
    qrDownload:            'Descargar PNG',
    qrEmpty:               'El QR aparecerá aquí',
    // Diff
    diffOriginal:          'Original',
    diffModified:          'Modificado',
    diffAdded:             'añadidas',
    diffRemoved:           'eliminadas',
    diffNoChanges:         'Sin cambios',
    diffEmpty:             'Pega texto en ambos paneles para ver el diff',
    // Regex
    regexInvalid:          'Regex inválido',
    regexGlobal:           'global',
    regexCaseInsensitive:  'insensible',
    regexMultiline:        'multilinea',
    regexDotAll:           'dotAll',
    regexInput:            'Cadena de prueba',
    regexInputPlaceholder: 'Escribe o pega el texto a probar…',
    regexMatches:          'Coincidencias',
    regexGroups:           'Grupos (match 1)',
    // Case Converter
    caseInput:             'Texto de entrada',
    casePlaceholder:       'Escribe texto, camelCase, snake_case, etc.',
    // Contador
    cntChars:              'Caracteres',
    cntNoSpaces:           'Sin espacios',
    cntWords:              'Palabras',
    cntLines:              'Líneas',
    cntSentences:          'Oraciones',
    cntBytesLabel:         'Bytes',
    cntReading:            'Lectura',
    cntLess1Min:           '< 1 min',
    cntPlaceholder:        'Escribe o pega texto para contar caracteres, palabras, líneas…',
    // IP Lookup
    ipLabelIp:             'IP',
    ipLabelCity:           'Ciudad',
    ipLabelRegion:         'Región',
    ipLabelCountry:        'País',
    ipLabelOrg:            'Org / ISP',
    ipLabelTz:             'Zona horaria',
    ipLabelUtc:            'UTC offset',
    ipLabelLat:            'Latitud',
    ipLabelLon:            'Longitud',
    ipPlaceholder:         '1.1.1.1 — vacío para tu IP',
    ipSearching:           'Consultando…',
    ipSearch:              'Buscar',
    ipMyIp:                'Mi IP',
    ipViewMap:             'Ver en mapa ↗',
    ipEmpty:               'Introduce una IP o haz clic en "Mi IP"',
    // Headers HTTP
    httpCors:              'CORS bloqueó la petición. El servidor no permite solicitudes cross-origin desde el navegador.',
    httpLoading:           'Cargando…',
    httpInspect:           'Inspeccionar',
    httpHeadersSuffix:     'headers',
    httpEmpty1:            'Introduce una URL y haz clic en Inspeccionar.',
    httpEmpty2:            'Nota: muchos servidores bloquean peticiones CORS desde el navegador.',
    // CIDR
    cidrNetwork:           'Red',
    cidrMask:              'Máscara',
    cidrWildcard:          'Wildcard',
    cidrFirstIp:           'Primera IP',
    cidrLastIp:            'Última IP',
    cidrBroadcast:         'Broadcast',
    cidrTotal:             'Total IPs',
    cidrUsable:            'IPs utilizables',
    cidrLabel:             'Notación CIDR',
    cidrInvalid:           'Formato inválido — usa x.x.x.x/n (ej. 10.0.0.0/8)',
    cidrUsableLabel:       'IPs utilizables',
    // DNS
    dnsSearching:          '…',
    dnsSearch:             'Buscar',
    dnsNoRecords:          'No se encontraron registros',
    dnsEmpty:              'Introduce un dominio y selecciona el tipo de registro',
    // Bcrypt
    bcHashTab:             'Hashear',
    bcVerifyTab:           'Verificar',
    bcInputHash:           'Texto a hashear',
    bcPlaceholderHash:     'contraseña o texto secreto',
    bcRounds:              'Rounds (cost factor)',
    bcIterationsSuffix:    'iteraciones',
    bcHashing:             'Hasheando…',
    bcGenerateHash:        'Generar hash',
    bcInputPlain:          'Texto plano',
    bcPlaceholderPlain:    'texto a verificar',
    bcInputBcrypt:         'Hash bcrypt',
    bcVerifying:           'Verificando…',
    bcVerifyBtn:           'Verificar',
    bcMatch:               'Coincide — hash válido',
    bcNoMatch:             'No coincide',
    // AES
    aesEncryptError:       'Error de cifrado',
    aesWrongKey:           'Contraseña incorrecta o texto cifrado inválido',
    aesDecryptError:       'Error al descifrar',
    aesEncrypt:            'Cifrar',
    aesDecrypt:            'Descifrar',
    aesPasswordLabel:      'Contraseña / clave',
    aesPasswordPlaceholder:'clave secreta…',
    aesInputPlain:         'Texto plano',
    aesInputEncrypted:     'Texto cifrado (Base64)',
    aesPlaceholderEncrypt: 'Texto a cifrar…',
    aesPlaceholderDecrypt: 'Pega el texto cifrado (Base64)…',
    aesAlgorithm:          'AES-256 CBC',
    aesOutputEncrypted:    'Cifrado (Base64)',
    aesOutputDecrypted:    'Texto descifrado',
    // RSA
    rsaError:              'Error generando claves',
    rsaPublic:             'Clave pública (JWK)',
    rsaPrivate:            'Clave secreta (JWK)',
    rsaNote:               'Generación 100% local via Web Crypto API. Formato JWK (JSON Web Key, RFC 7517). Las claves nunca salen del navegador.',
    // Notepad
    npdLoad:               'Cargar',
    npdSave:               'Guardar',
    npdCopy:               'Copiar',
    npdCopied:             '✓ Copiado',
    npdAddTab:             'Nueva pestaña',
    npdUntitled:           'Sin título',
    npdCloseTab:           'Cerrar pestaña',
    npdPlaceholder:        'Escribe o pega texto aquí…',
    // Img ↔ Base64
    imgFileToB64:          'Imagen → Base64',
    imgB64ToFile:          'Base64 → Imagen',
    imgDropHint:           'Arrastra una imagen o haz clic para seleccionar',
    imgDropSub:            'PNG, JPG, GIF, WebP, SVG',
    imgWithPrefix:         'Incluir prefijo data URI',
    imgDownload:           'Descargar imagen',
    imgPasteB64:           'Base64 de entrada',
    imgB64Placeholder:     'Pega el Base64 aquí (con o sin prefijo data:image/…)',
    imgInvalid:            'Base64 inválido o formato de imagen no soportado',
    imgChange:             'Cambiar',
    imgInfoName:           'Nombre',
    imgInfoType:           'Tipo',
    imgInfoDims:           'Dimensiones',
    imgInfoSize:           'Tamaño',
    // PDF ↔ Base64
    pdfFileToB64:          'PDF → Base64',
    pdfB64ToFile:          'Base64 → PDF',
    pdfDropHint:           'Arrastra un PDF o haz clic para seleccionar',
    pdfDropSub:            'Solo archivos PDF',
    pdfDownload:           'Descargar PDF',
    pdfPasteB64:           'Base64 de entrada',
    pdfB64Placeholder:     'Pega el Base64 aquí (con o sin prefijo data:application/pdf;base64,…)',
    pdfInvalid:            'Base64 inválido',
  },

  en: {
    // Shell
    home:                  'Home',
    pinned:                'Pinned',
    alsoInSidebar:         '· also in sidebar',
    categories:            'Categories',
    collapseAll:           'Collapse all',
    expandAll:             'Expand all',
    collapse:              'Collapse',
    expand:                'Expand',
    heroTitle:             'Hello, dev 👋',
    heroSub:               '28 tools · no account · everything runs in your browser',
    searchPlaceholder:     'convert base64, format json, generate uuid…',
    searchHint:            'Ctrl+F to search',
    noResults:             'No results for',
    history:               'History',
    historyLastN:          '· last',
    clearHistory:          'Clear history',
    noHistory:             'No recent activity — use a tool and it will appear here.',
    openTool:              'Open',
    copyResult:            'Copy result',
    pin:                   'Pin',
    unpin:                 'Unpin',
    removeTool:            'Remove',
    searchTool:            'Search',
    toolNotFound:          'Tool not found',
    splitV:                'Vertical (side by side)',
    splitH:                'Horizontal (stacked)',
    moreOptions:           'More options',
    cmdPaletteLabel:       'Search tool',
    cmdPlaceholder:        'Search tool…',
    cmdNoResults:          'No results for',
    cmdBestMatch:          'Best match',
    cmdOthers:             'Others',
    cmdNavigate:           'navigate',
    cmdOpen:               'open',
    cmdClose:              'close',
    shortcutsTitle:        'Keyboard shortcuts',
    shortcutsCloseHint:    'Press',
    shortcutOpenPalette:   'Open search palette',
    shortcutShowShortcuts: 'Show keyboard shortcuts',
    shortcutCloseOverlay:  'Close overlay / palette',
    shortcutNavigate:      'Navigate results (palette)',
    shortcutOpenTool:      'Open tool (palette)',
    // Registry
    catConv:               'Converters',
    catFmt:                'Formatters',
    catGen:                'Generators',
    catUtils:              'Utilities',
    catNet:                'Network',
    catCrypt:              'Crypto',
    // Common tool UI
    tcActions:             'Actions',
    tcFormat:              'Format',
    tcMinify:              'Minify',
    tcCopy:                'Copy',
    tcCopied:              '✓ Copied',
    tcCopiedKey:           '✓ Copied',
    tcClearEditor:         'Clear editor',
    tcPaste:               'Paste',
    tcExport:              'Export',
    tcLoadFile:            'Load file',
    tcRegenerate:          'Regenerate',
    tcAutoUpdates:         'auto-updates',
    tcAutoFormats:         'auto-formats',
    tcLines:               'lines',
    tcBytes:               'bytes',
    tcDepth:               'depth',
    tcInput:               'Input',
    tcOutput:              'Output',
    tcTree:                'Tree',
    tcNavigable:           'navigable',
    tcExpandAll:           'expand all',
    tcResult:              'Result',
    tcOr:                  'or',
    tcEmptyTreeFix:        'Fix the JSON to see the tree',
    tcEmptyTreeHere:       'The tree will appear here',
    // Base64
    b64Invalid:            'Invalid Base64',
    b64UrlSafe:            'URL-safe',
    b64NoPadding:          'No padding',
    b64InputText:          'Input (text)',
    b64InputB64:           'Input (Base64)',
    b64OutputB64:          'Output (Base64)',
    b64OutputText:         'Output (text)',
    b64PlaceholderText:    'Write or paste text…',
    b64PlaceholderB64:     'Paste Base64 here…',
    // Hex / Binary
    hexInvalid:            'Invalid hex — use bytes separated by spaces (e.g.: 48 65 6c 6c 6f)',
    binInvalid:            'Invalid binary — use 8-bit bytes separated by spaces',
    hexTextToHex:          'Text → Hex',
    hexTextToBin:          'Text → Bin',
    hexHexToText:          'Hex → Text',
    hexBinToText:          'Bin → Text',
    // URL Encode
    urlInvalid:            'Invalid URL encoding',
    urlInputText:          'Unencoded text',
    urlInputEncoded:       'Encoded URL',
    urlOutputEncoded:      'Encoded URL',
    urlOutputDecoded:      'Decoded text',
    // Color
    colorPicker:           'Color picker',
    colorInvalid:          'Unrecognized format. Use #hex, rgb(...) or hsl(...)',
    colorEmpty:            'Enter a color to see its conversion',
    // JWT Decode
    jwtExpiresIn:          'expires in',
    jwtExpiredAgo:         'expired',
    jwtInvalid:            'Invalid JWT — must have 3 parts separated by dots',
    jwtEmpty:              'Paste a JWT to decode it',
    jwt3Parts:             '3 parts',
    // Unix Timestamp
    tsNow:                 'Now → ',
    tsNowBtn:              'Right now',
    tsEpochToDate:         'Epoch → Date',
    tsDateToEpoch:         'Date → Epoch',
    tsInvalidEpoch:        'Invalid epoch — enter a number',
    tsInvalidDate:         'Invalid date',
    tsRelative:            'Relative',
    // JSON
    jsonCopyJson:          'Copy JSON',
    jsonExportJson:        'Export JSON',
    jsonValidateSchema:    'Validate Schema',
    jsonErrorLine:         '↑ error line',
    jsonReadyToValidate:   'Ready to validate',
    jsonPasteLeft:         'paste your JSON on the left',
    jsonValid:             'Valid JSON',
    jsonNoErrors:          '0 errors · 0 warnings',
    jsonSyntaxOk:          'Correct syntax, structure verified.',
    jsonInvalid:           'Invalid JSON',
    jsonOneError:          '1 error · 0 warnings',
    jsonCopyPath:          'Copy path',
    jsonKeys:              'keys',
    // XML
    xmlInvalid:            'Invalid XML',
    xmlEmpty:              '(empty)',
    xmlCopyXml:            'Copy XML',
    xmlExportXml:          'Export XML',
    xmlValid:              'Valid XML',
    xmlPasteLeft:          'paste your XML on the left',
    xmlFixForTree:         'Fix the XML to see the tree',
    xmlTreeHere:           'The tree will appear here',
    xmlElements:           'elements',
    xmlAttributes:         'attributes',
    xmlValidated:          'Validated',
    // YAML
    yamlInvalid:           'Invalid YAML',
    // JSON Schema
    schemaValidationOk:    'Validation OK',
    schemaValidationFailed:'Validation failed',
    schemaEmpty:           'Enter schema and data to validate',
    schemaValid:           'Valid — data matches the schema',
    schemaErrors:          'errors',
    schemaError:           'error',
    // Markdown
    mdPreviewLive:         'live preview',
    mdPreviewLabel:        'Preview',
    mdEmpty:               'The preview will appear here',
    // JSON Pretty
    jpMinifiedLabel:       'Minified',
    jpPrettyLabel:         'Pretty',
    // XML Pretty
    xpPretty:              'Pretty',
    xpIndent:              'indent',
    xpTab:                 'Tab',
    xpSpaces:              'sp',
    // SQL
    sqlInvalid:            'Invalid SQL',
    sqlFormatted:          'Formatted',
    // CSS / SCSS
    cssFormatted:          'Formatted',
    // UUID / ULID
    uuidCopyAll:           'Copy all',
    uuidGeneratedSuffix:   'generated',
    // Hash
    hashInputLabel:        'Input text',
    hashInputPlaceholder:  'Write or paste the text to hash…',
    // Password
    pwNoOptions:           'Enable at least one option',
    pwLength:              'Length',
    pwChars:               'Characters',
    pwUppercase:           'Uppercase',
    pwLowercase:           'Lowercase',
    pwNumbers:             'Numbers',
    pwSymbols:             'Symbols',
    // Lorem Ipsum
    loremGeneratedSuffix:  'generated',
    loremWords:            'Words',
    loremSentences:        'Sentences',
    loremParagraphs:       'Paragraphs',
    loremConfig:           'Configuration',
    loremHelp:             'Select type and amount above, then click Regenerate.',
    loremWordsSuffix:      'words',
    // QR Code
    qrTextOrUrl:           'Text or URL',
    qrDownload:            'Download PNG',
    qrEmpty:               'The QR code will appear here',
    // Diff
    diffOriginal:          'Original',
    diffModified:          'Modified',
    diffAdded:             'added',
    diffRemoved:           'removed',
    diffNoChanges:         'No changes',
    diffEmpty:             'Paste text in both panels to see the diff',
    // Regex
    regexInvalid:          'Invalid regex',
    regexGlobal:           'global',
    regexCaseInsensitive:  'case insensitive',
    regexMultiline:        'multiline',
    regexDotAll:           'dotAll',
    regexInput:            'Test string',
    regexInputPlaceholder: 'Write or paste the text to test…',
    regexMatches:          'Matches',
    regexGroups:           'Groups (match 1)',
    // Case Converter
    caseInput:             'Input text',
    casePlaceholder:       'Write text, camelCase, snake_case, etc.',
    // Contador
    cntChars:              'Characters',
    cntNoSpaces:           'Without spaces',
    cntWords:              'Words',
    cntLines:              'Lines',
    cntSentences:          'Sentences',
    cntBytesLabel:         'Bytes',
    cntReading:            'Reading',
    cntLess1Min:           '< 1 min',
    cntPlaceholder:        'Write or paste text to count characters, words, lines…',
    // IP Lookup
    ipLabelIp:             'IP',
    ipLabelCity:           'City',
    ipLabelRegion:         'Region',
    ipLabelCountry:        'Country',
    ipLabelOrg:            'Org / ISP',
    ipLabelTz:             'Timezone',
    ipLabelUtc:            'UTC offset',
    ipLabelLat:            'Latitude',
    ipLabelLon:            'Longitude',
    ipPlaceholder:         '1.1.1.1 — empty for your IP',
    ipSearching:           'Searching…',
    ipSearch:              'Search',
    ipMyIp:                'My IP',
    ipViewMap:             'View on map ↗',
    ipEmpty:               'Enter an IP or click "My IP"',
    // Headers HTTP
    httpCors:              'CORS blocked the request. The server does not allow cross-origin requests from the browser.',
    httpLoading:           'Loading…',
    httpInspect:           'Inspect',
    httpHeadersSuffix:     'headers',
    httpEmpty1:            'Enter a URL and click Inspect.',
    httpEmpty2:            'Note: many servers block CORS requests from the browser.',
    // CIDR
    cidrNetwork:           'Network',
    cidrMask:              'Mask',
    cidrWildcard:          'Wildcard',
    cidrFirstIp:           'First IP',
    cidrLastIp:            'Last IP',
    cidrBroadcast:         'Broadcast',
    cidrTotal:             'Total IPs',
    cidrUsable:            'Usable IPs',
    cidrLabel:             'CIDR Notation',
    cidrInvalid:           'Invalid format — use x.x.x.x/n (e.g. 10.0.0.0/8)',
    cidrUsableLabel:       'Usable IPs',
    // DNS
    dnsSearching:          '…',
    dnsSearch:             'Search',
    dnsNoRecords:          'No records found',
    dnsEmpty:              'Enter a domain and select the record type',
    // Bcrypt
    bcHashTab:             'Hash',
    bcVerifyTab:           'Verify',
    bcInputHash:           'Text to hash',
    bcPlaceholderHash:     'password or secret text',
    bcRounds:              'Rounds (cost factor)',
    bcIterationsSuffix:    'iterations',
    bcHashing:             'Hashing…',
    bcGenerateHash:        'Generate hash',
    bcInputPlain:          'Plain text',
    bcPlaceholderPlain:    'text to verify',
    bcInputBcrypt:         'Bcrypt hash',
    bcVerifying:           'Verifying…',
    bcVerifyBtn:           'Verify',
    bcMatch:               'Match — valid hash',
    bcNoMatch:             'No match',
    // AES
    aesEncryptError:       'Encryption error',
    aesWrongKey:           'Wrong password or invalid encrypted text',
    aesDecryptError:       'Decryption error',
    aesEncrypt:            'Encrypt',
    aesDecrypt:            'Decrypt',
    aesPasswordLabel:      'Password / key',
    aesPasswordPlaceholder:'secret key…',
    aesInputPlain:         'Plain text',
    aesInputEncrypted:     'Encrypted text (Base64)',
    aesPlaceholderEncrypt: 'Text to encrypt…',
    aesPlaceholderDecrypt: 'Paste encrypted text (Base64)…',
    aesAlgorithm:          'AES-256 CBC',
    aesOutputEncrypted:    'Encrypted (Base64)',
    aesOutputDecrypted:    'Decrypted text',
    // RSA
    rsaError:              'Error generating keys',
    rsaPublic:             'Public key (JWK)',
    rsaPrivate:            'Private key (JWK)',
    rsaNote:               '100% local generation via Web Crypto API. JWK format (JSON Web Key, RFC 7517). Keys never leave the browser.',
    // Notepad
    npdLoad:               'Load',
    npdSave:               'Save',
    npdCopy:               'Copy',
    npdCopied:             '✓ Copied',
    npdAddTab:             'New tab',
    npdUntitled:           'Untitled',
    npdCloseTab:           'Close tab',
    npdPlaceholder:        'Type or paste text here…',
    // Img ↔ Base64
    imgFileToB64:          'Image → Base64',
    imgB64ToFile:          'Base64 → Image',
    imgDropHint:           'Drag an image or click to select',
    imgDropSub:            'PNG, JPG, GIF, WebP, SVG',
    imgWithPrefix:         'Include data URI prefix',
    imgDownload:           'Download image',
    imgPasteB64:           'Base64 input',
    imgB64Placeholder:     'Paste Base64 here (with or without data:image/… prefix)',
    imgInvalid:            'Invalid Base64 or unsupported image format',
    imgChange:             'Change',
    imgInfoName:           'Name',
    imgInfoType:           'Type',
    imgInfoDims:           'Dimensions',
    imgInfoSize:           'Size',
    // PDF ↔ Base64
    pdfFileToB64:          'PDF → Base64',
    pdfB64ToFile:          'Base64 → PDF',
    pdfDropHint:           'Drag a PDF or click to select',
    pdfDropSub:            'PDF files only',
    pdfDownload:           'Download PDF',
    pdfPasteB64:           'Base64 input',
    pdfB64Placeholder:     'Paste Base64 here (with or without data:application/pdf;base64,… prefix)',
    pdfInvalid:            'Invalid Base64',
  },
}
