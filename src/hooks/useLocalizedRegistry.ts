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

  function getToolById(id: string): ToolMeta | undefined {
    const tool = allTools.find(t => t.id === id)
    if (tool) return tool
    // also check hidden tools
    for (const cat of allCategories) {
      const found = cat.tools.find(t => t.id === id)
      if (found) return found
    }
    return undefined
  }

  function getCategoryById(id: string): Category | undefined {
    return allCategories.find(c => c.id === id)
  }

  return { allTools, allCategories, visibleCategories, getToolById, getCategoryById }
}
