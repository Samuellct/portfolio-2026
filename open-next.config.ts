import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

// The site is fully statically generated (no `revalidate`, no ISR): the
// prerendered pages are served read-only from the static assets binding, and
// cache interception answers them without loading the Next server, which keeps
// each request under the Workers Free CPU limit (error 1102 otherwise).
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
})
