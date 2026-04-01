// ── New chapters ───────────────────────────────────────────────────────────
export const chapterNotes: Record<string, string> = {};
chapterNotes['ch_msgqueue'] = `# Message Queues — Notes

## Why Message Queues?
- Decouple producers from consumers
- Enable async, non-blocking communication
- Buffer traffic spikes; smooth load

## Popular Systems
| System | Best For |
|---|---|
| Kafka | High throughput, event log, replay |
| RabbitMQ | Flexible routing, AMQP |
| AWS SQS | Managed, simple, serverless |

## Key Concepts
- **Dead-letter queue** — holds failed messages for inspection
- **At-least-once** — retries on failure, may duplicate; consumers must be idempotent
- **Exactly-once** — no duplicates; higher cost
- **Consumer groups** — multiple consumers share partitions for parallel processing

## Key Takeaways
1. Design consumers to be idempotent (safe to run twice)
2. Always configure a DLQ — silent failures are dangerous
3. Kafka = log; RabbitMQ = router; SQS = simplicity
`

chapterNotes['ch_cdn'] = `# CDNs & Edge Computing — Notes

## How CDNs Work
1. User requests asset
2. DNS resolves to nearest edge node
3. Edge serves from cache (HIT) or fetches from origin (MISS)
4. Response cached at edge for future requests

## Key Headers
| Header | Purpose |
|---|---|
| Cache-Control: max-age=N | Cache for N seconds |
| ETag | Version identifier for conditional requests |
| If-None-Match | Client sends ETag back; server returns 304 if unchanged |
| Vary | Cache separately per header value (e.g. Accept-Encoding) |

## Edge Computing
- Run code at CDN nodes (Cloudflare Workers, Vercel Edge)
- Sub-millisecond cold starts
- Ideal for: auth checks, A/B testing, personalisation, geo-routing

## Key Takeaways
1. CDNs are free performance — use them for all static assets
2. Set long max-age + content-hash filenames for immutable assets
3. Edge functions excel at low-latency, stateless logic
`

chapterNotes['ch_ratelimit'] = `# Rate Limiting & API Design — Notes

## Rate Limiting Algorithms
| Algorithm | Allows Bursts | Smoothness |
|---|---|---|
| Token bucket | Yes | Medium |
| Leaky bucket | No | High |
| Fixed window | Limited | Low |
| Sliding window | Limited | High |

## API Best Practices
- Return 429 Too Many Requests when limit exceeded
- Include Retry-After header
- Document limits in API docs
- Implement exponential backoff in clients

## Pagination Strategies
- **Offset**: simple but inconsistent on updates
- **Cursor-based**: stable, efficient for large datasets — prefer this

## Key Takeaways
1. Token bucket for APIs that allow occasional bursts
2. Always return Retry-After so clients can back off gracefully
3. Cursor pagination for any dataset that changes frequently
`

chapterNotes['ch_dp'] = `# Dynamic Programming — Notes

## Two Requirements for DP
1. **Optimal substructure** — optimal solution built from optimal subproblems
2. **Overlapping subproblems** — same subproblems solved repeatedly

## Approaches
| Approach | Style | Pros |
|---|---|---|
| Top-down (memoisation) | Recursive + cache | Natural to write |
| Bottom-up (tabulation) | Iterative table | Faster, no stack overflow |

## State Definition Template
Ask: "What information do I need to uniquely describe a subproblem?"

## Classic Problems
- Fibonacci (intro)
- 0/1 Knapsack — O(n × W)
- Longest Common Subsequence — O(m × n)
- Coin Change — O(amount × coins)
- Edit Distance — O(m × n)

## Key Takeaways
1. Identify overlapping subproblems first
2. Define state carefully before writing any code
3. Bottom-up tabulation is usually faster in practice
`

chapterNotes['ch_sorting'] = `# Sorting & Searching — Notes

## Sorting Complexity
| Algorithm | Best | Average | Worst | Stable |
|---|---|---|---|---|
| Merge sort | O(n log n) | O(n log n) | O(n log n) | Yes |
| Quick sort | O(n log n) | O(n log n) | O(n²) | No |
| Heap sort | O(n log n) | O(n log n) | O(n log n) | No |
| Insertion sort | O(n) | O(n²) | O(n²) | Yes |
| Timsort | O(n) | O(n log n) | O(n log n) | Yes |

## Binary Search Template
\`\`\`
left, right = 0, len(arr) - 1
while left <= right:
    mid = (left + right) // 2
    if arr[mid] == target: return mid
    elif arr[mid] < target: left = mid + 1
    else: right = mid - 1
\`\`\`

## Key Takeaways
1. Merge sort when stability required; quick sort for general use
2. Binary search applies to any monotonic function, not just arrays
3. Timsort (Python/Java default) is optimal for real-world data
`

chapterNotes['ch_heaps'] = `# Heaps & Priority Queues — Notes

## Heap Properties
- Complete binary tree
- Min-heap: parent ≤ children (root = minimum)
- Max-heap: parent ≥ children (root = maximum)

## Complexities
| Operation | Time |
|---|---|
| Get min/max | O(1) |
| Insert | O(log n) |
| Remove min/max | O(log n) |
| Build heap | O(n) |

## Python heapq (min-heap)
\`\`\`
import heapq
heap = []
heapq.heappush(heap, val)      # insert
heapq.heappop(heap)            # remove min
heap[0]                        # peek min
heapq.heapify(list)            # O(n) build

# Max-heap: negate values
heapq.heappush(heap, -val)
max_val = -heapq.heappop(heap)
\`\`\`

## Top-K Pattern
\`\`\`
def top_k(nums, k):
    return heapq.nlargest(k, nums)  # O(n log k)
\`\`\`

## Key Takeaways
1. Use heap when you repeatedly need the min or max
2. Dijkstra's, Prim's, and merge-k-sorted all use heaps
3. heapq in Python is a min-heap — negate for max-heap
`

chapterNotes['ch_react'] = `# React & Component Design — Notes

## Core Hooks
| Hook | Purpose |
|---|---|
| useState | Local component state |
| useEffect | Side effects (fetch, subscriptions) |
| useContext | Consume context without prop drilling |
| useReducer | Complex state logic |
| useMemo | Cache expensive computation |
| useCallback | Stable function reference |
| useRef | Mutable ref, access DOM |

## Performance Checklist
- Wrap expensive child in React.memo
- Wrap passed functions in useCallback
- Wrap expensive computations in useMemo
- Use React DevTools profiler to measure before optimising

## Component Design Rules
1. Single responsibility — one component, one job
2. Lift state to nearest common ancestor
3. Composition over inheritance
4. Keep 'use client' boundary as high as possible

## Key Takeaways
1. Don't optimise prematurely — measure first
2. Most performance issues come from unnecessary re-renders
3. Composition via children prop is more flexible than inheritance
`

chapterNotes['ch_nextjs'] = `# Next.js & Server Components — Notes

## Rendering Strategies
| Strategy | When | Speed |
|---|---|---|
| Static | Build time | Fastest (CDN) |
| ISR | Build + revalidate | Fast |
| Dynamic | Per request | Slower |
| Client | Browser | Variable |

## Server vs Client Components
- **Server**: async, fetch data directly, no hooks, no browser APIs
- **Client**: 'use client', useState/useEffect, event handlers, browser APIs

## Data Fetching (App Router)
\`\`\`tsx
// Server component — just async/await
async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>
}

// ISR
export const revalidate = 60 // rebuild every 60s
\`\`\`

## Key Takeaways
1. Default to Server Components — add 'use client' only when needed
2. Use ISR for content that changes occasionally
3. Co-locate data fetching with the component that needs it
`

chapterNotes['ch_css'] = `# CSS Architecture — Notes

## Layout Tools
| Tool | Use For |
|---|---|
| CSS Grid | 2D layouts (rows + columns) |
| Flexbox | 1D alignment (row or column) |
| Position | Overlapping, fixed elements |

## Scoping Strategies
- **CSS Modules** — class names hashed per file, zero conflict
- **Tailwind** — utility classes in markup, no separate CSS files
- **CSS-in-JS** — styles in JS, dynamic theming

## Performance Tips
- Avoid layout thrash: batch DOM reads before writes
- Use will-change sparingly (creates compositor layer)
- Prefer CSS transitions over JS animations
- Set image dimensions to prevent CLS

## CSS Custom Properties
\`\`\`css
:root { --color-primary: #2d5a3d; }
.button { background: var(--color-primary); }
\`\`\`

## Key Takeaways
1. Grid for page layout, Flexbox for component layout
2. CSS Modules eliminate specificity issues in component systems
3. Always set image width/height to avoid layout shift
`

chapterNotes['ch_perf'] = `# Web Performance — Notes

## Core Web Vitals
| Metric | Measures | Good Threshold |
|---|---|---|
| LCP | Largest element loads | < 2.5s |
| INP | Response to interaction | < 200ms |
| CLS | Layout stability | < 0.1 |

## Optimisation Techniques
- **Code splitting**: React.lazy() + dynamic import()
- **Image**: next/image, WebP/AVIF, lazy loading, explicit dimensions
- **Fonts**: font-display: swap, preload critical fonts
- **Bundle**: analyse with webpack-bundle-analyzer, remove large deps

## Perceived Performance
- Skeleton screens instead of spinners
- Optimistic UI updates (assume success)
- Progressive loading (show content as it arrives)

## Tools
- Chrome Lighthouse — audit & scores
- Network tab — waterfall, blocking resources
- React DevTools Profiler — component render times

## Key Takeaways
1. Measure with real devices, not just localhost
2. Images are usually the biggest LCP offender
3. Perceived performance matters as much as actual speed
`

chapterNotes['ch_docker'] = `# Docker & Containers — Notes

## Key Docker Concepts
| Concept | Description |
|---|---|
| Image | Blueprint (read-only layers) |
| Container | Running instance of an image |
| Volume | Persistent storage outside container |
| Network | Communication between containers |
| Registry | Store & distribute images (Docker Hub) |

## Efficient Dockerfile Pattern
\`\`\`dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci                    # cache this layer

FROM deps AS builder
COPY . .
RUN npm run build

FROM node:20-alpine AS runner  # lean final image
COPY --from=builder /app/dist ./dist
USER node                      # non-root
CMD ["node", "dist/index.js"]
\`\`\`

## Key Takeaways
1. Order Dockerfile layers: rarely-changed → frequently-changed
2. Multi-stage builds keep production images small
3. Always run as non-root user in production
`

chapterNotes['ch_cicd'] = `# CI/CD Pipelines — Notes

## CI/CD Flow
\`\`\`
Push → CI: lint → unit test → build → integration test → CD: deploy
\`\`\`

## GitHub Actions Structure
\`\`\`yaml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy
\`\`\`

## Deployment Strategies
| Strategy | Rollback | Downtime |
|---|---|---|
| Blue-green | Instant | None |
| Canary | Gradual | None |
| Rolling | Moderate | Minimal |
| Feature flags | Instant | None |

## Key Takeaways
1. Store secrets in GitHub Secrets, never in code
2. Fast feedback: unit tests first, integration tests after
3. Feature flags decouple deployment from release
`

chapterNotes['ch_k8s'] = `# Kubernetes Basics — Notes

## Core Objects
| Object | Purpose |
|---|---|
| Pod | Smallest unit; one or more containers |
| Deployment | Manages replicas + rolling updates |
| Service | Stable network endpoint for Pods |
| Ingress | Routes external HTTP traffic |
| ConfigMap | Non-sensitive configuration |
| Secret | Sensitive data (base64-encoded) |
| Namespace | Logical cluster isolation |

## Essential kubectl Commands
\`\`\`bash
kubectl get pods                    # list pods
kubectl describe pod <name>         # detailed info
kubectl logs <pod> -f               # stream logs
kubectl exec -it <pod> -- sh        # shell into pod
kubectl apply -f deployment.yaml    # apply config
kubectl rollout undo deployment/<n> # rollback
\`\`\`

## Scaling
\`\`\`bash
kubectl scale deployment app --replicas=5
# or use HPA:
kubectl autoscale deployment app --cpu-percent=70 --min=2 --max=10
\`\`\`

## Key Takeaways
1. Pods are ephemeral — never store state in them
2. Services decouple consumers from Pod IPs
3. Learn kubectl describe and logs — covers 90% of debugging
`