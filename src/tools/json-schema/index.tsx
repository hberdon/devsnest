import { useState, useEffect } from 'react'
import Ajv from 'ajv'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import s from './schema.module.css'
import ts from '@/tools/tool.module.css'

const ajv = new Ajv({ allErrors: true })

type ValidateResult =
  | { status: 'idle' }
  | { status: 'valid' }
  | { status: 'invalid'; errors: string[] }
  | { status: 'error'; message: string }

function validateAgainstSchema(schemaStr: string, dataStr: string): ValidateResult {
  if (!schemaStr.trim() || !dataStr.trim()) return { status: 'idle' }
  let schema: unknown, data: unknown
  try { schema = JSON.parse(schemaStr) } catch (e) {
    return { status: 'error', message: `Schema: ${e instanceof Error ? e.message : 'JSON inválido'}` }
  }
  try { data = JSON.parse(dataStr) } catch (e) {
    return { status: 'error', message: `Data: ${e instanceof Error ? e.message : 'JSON inválido'}` }
  }
  try {
    const validate = ajv.compile(schema as object)
    const valid = validate(data)
    if (valid) return { status: 'valid' }
    return {
      status: 'invalid',
      errors: (validate.errors ?? []).map(e => `${e.instancePath || '/'} ${e.message}`),
    }
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'Error validando' }
  }
}

export default function JSONSchema() {
  const [schema, setSchema] = useState('')
  const [data,   setData]   = useState('')
  const { addToHistory } = useDevTools()

  const result = validateAgainstSchema(schema, data)

  const debouncedData = useDebounce(data, 1500)
  useEffect(() => {
    if (!debouncedData || result.status === 'idle') return
    addToHistory({
      toolId: 'json-schema', toolName: 'JSON Schema', badge: 'JSV',
      categoryName: 'Formateadores',
      description: result.status === 'valid' ? 'Validación OK' : 'Validación fallida',
    })
  }, [debouncedData]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ToolLayout toolId="json-schema">
      <div className={s.layout}>
        <div className={s.inputs}>
          <div className={s.pane}>
            <div className={s.paneHeader}>Schema</div>
            <textarea
              className={ts.textarea}
              value={schema}
              onChange={e => setSchema(e.target.value)}
              placeholder={'{\n  "type": "object",\n  "properties": {\n    "nombre": { "type": "string" }\n  }\n}'}
              spellCheck={false}
            />
          </div>
          <div className={s.pane}>
            <div className={s.paneHeader}>Data</div>
            <textarea
              className={ts.textarea}
              value={data}
              onChange={e => setData(e.target.value)}
              placeholder='{ "nombre": "Hugo" }'
              spellCheck={false}
            />
          </div>
        </div>

        <div className={s.resultBox}>
          {result.status === 'idle' && (
            <span className={s.idle}>Introduce schema y data para validar</span>
          )}
          {result.status === 'valid' && (
            <div className={s.valid}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Válido — el data cumple el schema
            </div>
          )}
          {result.status === 'invalid' && (
            <div className={s.invalidBox}>
              <div className={s.invalidTitle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {result.errors.length} error{result.errors.length !== 1 ? 'es' : ''}
              </div>
              <ul className={s.errorList}>
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
          {result.status === 'error' && (
            <span className={ts.error}>{result.message}</span>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
