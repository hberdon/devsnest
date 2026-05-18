import type { Lang } from './translations'
import type { CategoryId } from '@/tools/registry'

interface ToolI18n { name: string; desc: string }

export const toolI18n: Record<string, Record<Lang, ToolI18n>> = {
  'base64':         { es: { name: 'Base64',          desc: 'Codifica y decodifica texto en Base64'              }, en: { name: 'Base64',          desc: 'Encode and decode text in Base64'                   } },
  'hex-binario':    { es: { name: 'Hex / Binario',   desc: 'Convierte entre texto, hex y binario'               }, en: { name: 'Hex / Binary',    desc: 'Convert between text, hex and binary'               } },
  'url-encode':     { es: { name: 'URL Encode',      desc: 'Encode/decode componentes de URL'                   }, en: { name: 'URL Encode',      desc: 'Encode/decode URL components'                       } },
  'color':          { es: { name: 'Color (HEX/RGB)', desc: 'Convierte entre HEX, RGB y HSL'                     }, en: { name: 'Color (HEX/RGB)', desc: 'Convert between HEX, RGB and HSL'                   } },
  'jwt-decode':     { es: { name: 'JWT Decode',      desc: 'Decodifica tokens JWT (sin validación)'             }, en: { name: 'JWT Decode',      desc: 'Decode JWT tokens (no validation)'                  } },
  'unix-timestamp': { es: { name: 'Unix Timestamp',  desc: 'Convierte epoch a fecha y viceversa'                }, en: { name: 'Unix Timestamp',  desc: 'Convert epoch to date and back'                     } },
  'json':           { es: { name: 'JSON',            desc: 'Valida y formatea JSON'                             }, en: { name: 'JSON',            desc: 'Validate and format JSON'                           } },
  'xml':            { es: { name: 'XML',             desc: 'Valida y formatea XML'                              }, en: { name: 'XML',             desc: 'Validate and format XML'                            } },
  'yaml':           { es: { name: 'YAML',            desc: 'Valida y convierte YAML'                            }, en: { name: 'YAML',            desc: 'Validate and convert YAML'                          } },
  'json-schema':    { es: { name: 'JSON Schema',     desc: 'Valida JSON contra un schema'                       }, en: { name: 'JSON Schema',     desc: 'Validate JSON against a schema'                     } },
  'markdown':       { es: { name: 'Markdown',        desc: 'Preview en tiempo real de Markdown'                 }, en: { name: 'Markdown',        desc: 'Real-time Markdown preview'                         } },
  'json-pretty':    { es: { name: 'JSON Pretty',     desc: 'Pretty print JSON con indentación configurable'     }, en: { name: 'JSON Pretty',     desc: 'Pretty print JSON with configurable indentation'    } },
  'xml-pretty':     { es: { name: 'XML Pretty',      desc: 'Pretty print XML'                                   }, en: { name: 'XML Pretty',      desc: 'Pretty print XML'                                   } },
  'sql':            { es: { name: 'SQL',             desc: 'Formatea queries SQL'                               }, en: { name: 'SQL',             desc: 'Format SQL queries'                                 } },
  'css-scss':       { es: { name: 'CSS / SCSS',      desc: 'Formatea y valida CSS/SCSS'                         }, en: { name: 'CSS / SCSS',      desc: 'Format and validate CSS/SCSS'                       } },
  'uuid-ulid':      { es: { name: 'UUID / ULID',     desc: 'Genera UUIDs v4 y ULIDs'                            }, en: { name: 'UUID / ULID',     desc: 'Generate UUIDs v4 and ULIDs'                        } },
  'hash':           { es: { name: 'Hash MD5 / SHA',  desc: 'MD5, SHA-1, SHA-256, SHA-512'                       }, en: { name: 'Hash MD5 / SHA',  desc: 'MD5, SHA-1, SHA-256, SHA-512'                       } },
  'password':       { es: { name: 'Password',        desc: 'Genera contraseñas seguras'                         }, en: { name: 'Password',        desc: 'Generate secure passwords'                          } },
  'lorem-ipsum':    { es: { name: 'Lorem Ipsum',     desc: 'Genera texto de relleno'                            }, en: { name: 'Lorem Ipsum',     desc: 'Generate placeholder text'                          } },
  'qr-code':        { es: { name: 'QR Code',         desc: 'Genera QR de texto o URL'                           }, en: { name: 'QR Code',         desc: 'Generate QR code from text or URL'                  } },
  'diff':           { es: { name: 'Diff',            desc: 'Compara dos textos'                                 }, en: { name: 'Diff',            desc: 'Compare two texts'                                  } },
  'regex':          { es: { name: 'Regex Tester',    desc: 'Prueba expresiones regulares'                       }, en: { name: 'Regex Tester',    desc: 'Test regular expressions'                           } },
  'case-converter': { es: { name: 'Case Converter',  desc: 'Convierte entre camelCase, snake_case, etc.'        }, en: { name: 'Case Converter',  desc: 'Convert between camelCase, snake_case, etc.'        } },
  'contador':       { es: { name: 'Contador',        desc: 'Cuenta chars, palabras, líneas y bytes'             }, en: { name: 'Counter',         desc: 'Count chars, words, lines and bytes'                } },
  'notepad':        { es: { name: 'Notepad',         desc: 'Bloc de notas con pestañas persistentes'           }, en: { name: 'Notepad',         desc: 'Tabbed notepad with persistent content'             } },
  'cron':           { es: { name: 'Cron',            desc: 'Testa y construye expresiones cron'                 }, en: { name: 'Cron',            desc: 'Test and build cron expressions'                    } },
  'ip-lookup':      { es: { name: 'IP Lookup',       desc: 'Geolocalización de IPs'                             }, en: { name: 'IP Lookup',       desc: 'IP geolocation'                                     } },
  'headers-http':   { es: { name: 'Headers HTTP',    desc: 'Inspecciona headers de una URL'                     }, en: { name: 'HTTP Headers',    desc: 'Inspect headers of a URL'                           } },
  'cidr':           { es: { name: 'CIDR',            desc: 'Calculadora de subredes'                            }, en: { name: 'CIDR',            desc: 'Subnet calculator'                                  } },
  'dns':            { es: { name: 'DNS',             desc: 'DNS lookup por tipo de registro'                    }, en: { name: 'DNS',             desc: 'DNS lookup by record type'                          } },
  'bcrypt':         { es: { name: 'Bcrypt',          desc: 'Hash y verifica con Bcrypt'                         }, en: { name: 'Bcrypt',          desc: 'Hash and verify with Bcrypt'                        } },
  'aes':            { es: { name: 'AES',             desc: 'Cifra y descifra con AES-256'                       }, en: { name: 'AES',             desc: 'Encrypt and decrypt with AES-256'                   } },
  'rsa-keys':       { es: { name: 'RSA Keys',        desc: 'Genera pares de claves RSA'                         }, en: { name: 'RSA Keys',        desc: 'Generate RSA key pairs'                             } },
}

export const categoryI18n: Record<CategoryId, Record<Lang, string>> = {
  conv:  { es: 'Conversores',   en: 'Converters'  },
  fmt:   { es: 'Formateadores', en: 'Formatters'  },
  gen:   { es: 'Generadores',   en: 'Generators'  },
  utils: { es: 'Utilidades',    en: 'Utilities'   },
  net:   { es: 'Red',           en: 'Network'     },
  crypt: { es: 'Cripto',        en: 'Crypto'      },
}
