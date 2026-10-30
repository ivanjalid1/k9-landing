import { useEffect } from 'react'

const SITE = 'https://k9movement.com'

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

/**
 * Per-page <title>, meta description, canonical and Open Graph title/description/url.
 * index.html holds the defaults (used by crawlers that don't run JS); this updates
 * the same tags in place on every route so there are never duplicates.
 */
export function useSeo({ title, description, path }: { title: string; description: string; path: string }) {
  useEffect(() => {
    const url = `${SITE}${path}`
    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', description)
  }, [title, description, path])
}
