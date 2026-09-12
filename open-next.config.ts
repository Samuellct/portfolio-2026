import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// The site is fully statically generated (no `revalidate`, no ISR) so the
// default in-memory cache is enough: no R2 incremental cache, no Durable
// Object queue/tag cache needed.
export default defineCloudflareConfig({})
