import { useMemo } from 'react'
import { useLang } from '@/store/lang.context'
import { CATEGORIES, VISIBLE_CATEGORIES, ALL_TOOLS, type ToolMeta, type Category } from '@/tools/registry'
import { toolI18n, categoryI18n } from '@/i18n/registry-translations'

function localizeTools(tools: ToolMeta[], lang: 'es' | 'en'): ToolMeta[] {
  return tools.map(tool => {
    const i18n = toolI18n[tool.id]?.[lang]
    return i18n ? { ...tool, name: i18n.name, description: i18n.desc } : tool
  })
}

function localizeCategory(cat: Category, lang: 'es' | 'en'): Category {
  return {
    ...cat,
    name:  categoryI18n[cat.id]?.[lang] ?? cat.name,
    tools: localizeTools(cat.tools, lang),
  }
}

export function useLocalizedRegistry() {
  const { lang } = useLang()

  const allTools         = useMemo(() => localizeTools(ALL_TOOLS, lang),                         [lang])
  const allCategories    = useMemo(() => CATEGORIES.map(c => localizeCategory(c, lang)),          [lang])
  const visibleCategories= useMemo(() => VISIBLE_CATEGORIES.map(c => localizeCategory(c, lang)), [lang])

  const allToolsMap = useMemo(() => {
    const m = new Map<string, ToolMeta>()
    for (const cat of allCategories) for (const tool of cat.tools) m.set(tool.id, tool)
    return m
  }, [allCategories])

  const categoriesMap = useMemo(() => new Map<string, Category>(allCategories.map(c => [c.id, c])), [allCategories])

  function getToolById(id: string): ToolMeta | undefined {
    return allToolsMap.get(id)
  }

  function getCategoryById(id: string): Category | undefined {
    return categoriesMap.get(id)
  }

  return { allTools, allCategories, visibleCategories, getToolById, getCategoryById }
}
