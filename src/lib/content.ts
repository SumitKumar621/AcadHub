export const books = [
  {
    id: 'book_sysdesign',
    title: 'System Design',
    description: 'Architect scalable, reliable distributed systems.',
    chapters: [
      {
        id: 'ch_scale',
        title: 'Scalability Fundamentals',
        order: 1,
        content: {
          body: `Scalability refers to a system's ability to handle growing amounts of work by adding resources. There are two primary strategies: **horizontal scaling** (adding more machines) and **vertical scaling** (upgrading existing ones).

Horizontal scaling is preferred for most modern systems because it offers near-unlimited growth potential and built-in redundancy. However, it introduces complexity — your application must be stateless, and you need to coordinate across nodes.

Vertical scaling is simpler to implement but has hard limits and creates a single point of failure. It works well for databases and stateful workloads that are difficult to shard.`,
          videos: [
            { id: 'v_scale_1', label: 'Horizontal vs Vertical Scaling', durationSeconds: 480 },
            { id: 'v_scale_2', label: 'Load Balancers in Practice', durationSeconds: 360 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_db',
        title: 'Database Architecture',
        order: 2,
        content: {
          body: `Choosing the right database is one of the most impactful decisions in system design. Relational databases (PostgreSQL, MySQL) excel at structured data with complex relationships and strong consistency guarantees via ACID transactions.

Document stores (MongoDB) work well for flexible schemas. Key-value stores (Redis) are ideal for caching and session storage. Column-family databases (Cassandra) shine for time-series and write-heavy workloads.

Match your database choice to your access patterns, not just your familiarity. Read/write ratio, query complexity, and consistency requirements should all drive the decision.`,
          videos: [
            { id: 'v_db_1', label: 'SQL vs NoSQL: When to Use Each', durationSeconds: 600 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_cache',
        title: 'Caching Strategies',
        order: 3,
        content: {
          body: `Caching is one of the highest-leverage optimisations available. By storing computed or fetched results closer to the consumer, you reduce latency and database load dramatically.

The four main patterns are: **cache-aside** (application manages cache explicitly), **write-through** (writes go to cache and DB simultaneously), **write-behind** (writes go to cache, DB is updated asynchronously), and **read-through** (cache sits in front of DB transparently).

Eviction policies determine what gets removed when the cache is full. LRU (Least Recently Used) is the most common and works well for temporal locality. LFU (Least Frequently Used) works better when some items are perennially popular.`,
          videos: [
            { id: 'v_cache_1', label: 'Redis Deep Dive', durationSeconds: 540 },
            { id: 'v_cache_2', label: 'Cache Invalidation Patterns', durationSeconds: 420 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_msgqueue',
        title: 'Message Queues',
        order: 4,
        content: {
          body: `Message queues decouple producers from consumers, enabling asynchronous communication between services. Instead of a direct call that blocks until a response arrives, a producer drops a message onto a queue and moves on — the consumer processes it independently.

Popular systems include **Kafka** (high-throughput, durable, log-based), **RabbitMQ** (flexible routing, AMQP protocol), and **AWS SQS** (managed, simple). Kafka treats messages as an immutable log, enabling replay — critical for event sourcing and audit trails.

Key concepts include dead-letter queues (for failed messages), at-least-once vs exactly-once delivery semantics, and consumer groups for parallel processing.`,
          videos: [
            { id: 'v_mq_1', label: 'Kafka vs RabbitMQ vs SQS', durationSeconds: 600 },
            { id: 'v_mq_2', label: 'Event-Driven Architecture', durationSeconds: 480 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_cdn',
        title: 'CDNs & Edge Computing',
        order: 5,
        content: {
          body: `A Content Delivery Network (CDN) distributes static assets — images, CSS, JS, videos — to servers geographically close to the user, dramatically reducing latency. Instead of every request hitting your origin server in one region, users are served from a nearby edge node.

**Edge computing** takes this further by running actual application logic at edge nodes. Platforms like Cloudflare Workers and Vercel Edge Functions allow you to execute code at hundreds of locations worldwide with sub-millisecond cold starts.

CDNs also provide DDoS protection, SSL termination, and intelligent caching headers. Understanding Cache-Control, ETags, and cache invalidation strategies is essential to using CDNs effectively.`,
          videos: [
            { id: 'v_cdn_1', label: 'How CDNs Work', durationSeconds: 420 },
            { id: 'v_cdn_2', label: 'Edge Functions in Practice', durationSeconds: 360 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_ratelimit',
        title: 'Rate Limiting & API Design',
        order: 6,
        content: {
          body: `Rate limiting protects your API from abuse, prevents resource exhaustion, and ensures fair usage across clients. Common algorithms include **token bucket** (allows bursts up to a limit), **leaky bucket** (smooths traffic), and **sliding window** (most accurate, slightly more expensive).

Good API design goes hand in hand with rate limiting. RESTful conventions (proper use of HTTP verbs, status codes, and resource naming), versioning strategies (/v1/, Accept headers), and pagination patterns (cursor-based vs offset) all affect how scalable and maintainable your API is over time.

Always return meaningful error responses with Retry-After headers when limits are hit, and document your limits clearly so clients can implement proper backoff strategies.`,
          videos: [
            { id: 'v_rl_1', label: 'Rate Limiting Algorithms Explained', durationSeconds: 480 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
    ],
  },
  {
    id: 'book_dsa',
    title: 'Data Structures & Algorithms',
    description: 'Master the fundamentals of efficient computation.',
    chapters: [
      {
        id: 'ch_arrays',
        title: 'Arrays & Strings',
        order: 1,
        content: {
          body: `Arrays are the most fundamental data structure — a contiguous block of memory holding elements of the same type. Random access is O(1), but insertion and deletion at arbitrary positions is O(n).

Two essential patterns for array problems are the **sliding window** (maintaining a subarray that satisfies some condition) and the **two pointer** technique (converging pointers from both ends). These patterns reduce many O(n²) brute-force solutions to O(n).

String problems often reduce to array problems. Key techniques include character frequency maps (using a hash map or fixed-size array for ASCII), and recognising that many string operations mirror array rotations and searches.`,
          videos: [
            { id: 'v_arr_1', label: 'Two Pointer & Sliding Window', durationSeconds: 660 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_trees',
        title: 'Trees & Graphs',
        order: 2,
        content: {
          body: `Trees are hierarchical data structures with a root node and child nodes forming a directed acyclic graph. Binary search trees support O(log n) search, insertion, and deletion on average — but degrade to O(n) when unbalanced. Self-balancing variants like AVL and Red-Black trees maintain O(log n) guarantees.

Graph traversal is the foundation of countless real-world algorithms. **BFS** (breadth-first search) finds shortest paths in unweighted graphs and explores level by level using a queue. **DFS** (depth-first search) explores as far as possible before backtracking, using a stack or recursion.

Topological sort orders the nodes of a DAG such that every directed edge goes from earlier to later — essential for dependency resolution and build systems.`,
          videos: [
            { id: 'v_tree_1', label: 'BFS vs DFS Visualised', durationSeconds: 720 },
            { id: 'v_tree_2', label: 'Binary Search Trees', durationSeconds: 480 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_dp',
        title: 'Dynamic Programming',
        order: 3,
        content: {
          body: `Dynamic programming solves complex problems by breaking them into overlapping subproblems and storing results to avoid redundant computation. The two key properties needed are **optimal substructure** (optimal solution built from optimal subproblems) and **overlapping subproblems** (same subproblems solved repeatedly).

The two implementation styles are **top-down memoisation** (recursive + cache) and **bottom-up tabulation** (iterative, fills a table). Bottom-up is usually faster due to no recursion overhead.

Classic DP problems include: Fibonacci, 0/1 Knapsack, Longest Common Subsequence, Coin Change, and Edit Distance. The key insight is always identifying the state — what information do you need to represent a subproblem uniquely?`,
          videos: [
            { id: 'v_dp_1', label: 'Dynamic Programming Intuition', durationSeconds: 720 },
            { id: 'v_dp_2', label: 'Top-Down vs Bottom-Up', durationSeconds: 480 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_sorting',
        title: 'Sorting & Searching',
        order: 4,
        content: {
          body: `Sorting is one of the most studied problems in computer science. **Merge sort** and **heap sort** guarantee O(n log n) in all cases. **Quick sort** is O(n log n) average but O(n²) worst case — mitigated with randomised pivot selection. Most production sort implementations (Timsort in Python/Java) are hybrids.

**Binary search** reduces search in a sorted array from O(n) to O(log n) by halving the search space each step. Beyond simple search, binary search applies to a wide class of problems: find the first/last occurrence, find a peak element, minimise the maximum value, and more.

The template is always: define the search space, write a condition that determines which half to discard, and narrow until convergence.`,
          videos: [
            { id: 'v_sort_1', label: 'Sorting Algorithms Compared', durationSeconds: 600 },
            { id: 'v_sort_2', label: 'Binary Search Patterns', durationSeconds: 420 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_heaps',
        title: 'Heaps & Priority Queues',
        order: 5,
        content: {
          body: `A heap is a complete binary tree satisfying the heap property: in a **min-heap**, every parent is smaller than its children. This guarantees O(1) access to the minimum element and O(log n) insertion and deletion.

Priority queues are the primary use case — scheduling tasks, Dijkstra's shortest path, and the merge k sorted lists problem all rely on efficient min/max access. In Python, the \`heapq\` module provides a min-heap; negate values for max-heap behaviour.

The **top-K elements** pattern is a classic application: use a min-heap of size K to track the K largest elements in a stream without sorting the entire dataset. Time complexity is O(n log K) vs O(n log n) for sorting.`,
          videos: [
            { id: 'v_heap_1', label: 'Heaps & Priority Queues', durationSeconds: 540 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
    ],
  },
  {
    id: 'book_webdev',
    title: 'Modern Web Development',
    description: 'Build fast, accessible, production-ready web applications.',
    chapters: [
      {
        id: 'ch_react',
        title: 'React & Component Design',
        order: 1,
        content: {
          body: `React's component model encourages breaking UIs into small, reusable pieces. **Functional components** with hooks have replaced class components as the standard. Understanding when to use \`useState\`, \`useEffect\`, \`useContext\`, and \`useReducer\` is foundational.

**Component design principles**: single responsibility (each component does one thing), lifting state up (share state by moving it to the closest common ancestor), and composition over inheritance (compose behaviour via props and children).

Performance optimisation involves \`React.memo\` to skip re-renders, \`useMemo\` to cache expensive computations, and \`useCallback\` to stabilise function references. The React DevTools profiler is indispensable for identifying bottlenecks.`,
          videos: [
            { id: 'v_react_1', label: 'React Hooks Deep Dive', durationSeconds: 660 },
            { id: 'v_react_2', label: 'Component Design Patterns', durationSeconds: 480 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_nextjs',
        title: 'Next.js & Server Components',
        order: 2,
        content: {
          body: `Next.js App Router introduced **React Server Components (RSC)** — components that render on the server and send HTML to the client with zero JS bundle impact. This fundamentally changes how we think about data fetching: fetch directly in the component, no useEffect or API route needed.

**Rendering strategies**: Static (build time, fastest), Dynamic (per request), and Incremental Static Regeneration (ISR — revalidate on a schedule). Choosing the right strategy per route dramatically affects both performance and infrastructure cost.

The \`'use client'\` directive marks the boundary where server components hand off to client components. Keep this boundary as high as possible to maximise server rendering benefits.`,
          videos: [
            { id: 'v_next_1', label: 'Server vs Client Components', durationSeconds: 600 },
            { id: 'v_next_2', label: 'App Router Data Fetching', durationSeconds: 540 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_css',
        title: 'CSS Architecture',
        order: 3,
        content: {
          body: `Modern CSS has evolved dramatically. **CSS custom properties** (variables) enable dynamic theming without JavaScript. **CSS Grid** and **Flexbox** handle the vast majority of layout needs — Grid for two-dimensional layouts, Flexbox for one-dimensional alignment.

**CSS Modules** scope styles to components, eliminating specificity conflicts. **Tailwind CSS** takes a utility-first approach, trading semantic class names for composable utility classes that colocate style with markup.

Performance considerations include: avoiding layout thrash (reading then writing layout properties in a loop), using \`will-change\` sparingly, preferring CSS transitions over JS animations, and minimising paint areas with \`contain: layout\`.`,
          videos: [
            { id: 'v_css_1', label: 'CSS Grid & Flexbox Mastery', durationSeconds: 720 },
            { id: 'v_css_2', label: 'CSS Architecture Patterns', durationSeconds: 420 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_perf',
        title: 'Web Performance',
        order: 4,
        content: {
          body: `Web performance is measured by Core Web Vitals: **LCP** (Largest Contentful Paint — loading), **INP** (Interaction to Next Paint — interactivity), and **CLS** (Cumulative Layout Shift — visual stability). These directly impact SEO rankings and user retention.

Key optimisation techniques: **code splitting** (load JS only when needed), **image optimisation** (next/image, WebP/AVIF formats, lazy loading), **font optimisation** (font-display: swap, preload critical fonts), and **bundle analysis** (identify and eliminate large dependencies).

The Network tab and Lighthouse in Chrome DevTools are your primary diagnostic tools. Always measure before and after optimisations — perceived performance (skeleton screens, optimistic UI) can be as impactful as actual speed improvements.`,
          videos: [
            { id: 'v_perf_1', label: 'Core Web Vitals Explained', durationSeconds: 540 },
            { id: 'v_perf_2', label: 'Bundle Optimisation Techniques', durationSeconds: 480 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
    ],
  },
  {
    id: 'book_devops',
    title: 'DevOps & Cloud',
    description: 'Deploy, scale, and operate production systems with confidence.',
    chapters: [
      {
        id: 'ch_docker',
        title: 'Docker & Containers',
        order: 1,
        content: {
          body: `Containers package an application and all its dependencies into a single, portable unit that runs consistently across environments. Docker is the dominant containerisation platform — a **Dockerfile** defines the image, and \`docker run\` creates a container from it.

Key concepts: **layers** (each instruction adds a layer; order matters for cache efficiency), **volumes** (persist data outside the container lifecycle), **networks** (containers communicate via Docker networks), and **multi-stage builds** (produce lean production images by separating build and runtime stages).

A well-crafted Dockerfile minimises image size (use alpine base images), maximises cache reuse (copy dependency files before source code), and runs as a non-root user for security.`,
          videos: [
            { id: 'v_docker_1', label: 'Docker Fundamentals', durationSeconds: 660 },
            { id: 'v_docker_2', label: 'Multi-Stage Builds', durationSeconds: 360 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_cicd',
        title: 'CI/CD Pipelines',
        order: 2,
        content: {
          body: `Continuous Integration (CI) automatically builds and tests code on every push, catching bugs before they reach production. Continuous Deployment (CD) automatically deploys passing builds to production. Together they reduce deployment risk by making releases small, frequent, and reversible.

**GitHub Actions** is the most popular CI/CD platform for open-source projects. A workflow file defines triggers (push, pull request), jobs (test, build, deploy), and steps (individual commands or reusable actions).

Best practices: fast feedback (run unit tests before integration tests), parallelise independent jobs, cache dependencies, use environment-specific secrets, and implement rollback strategies (blue-green deployments, feature flags).`,
          videos: [
            { id: 'v_cicd_1', label: 'GitHub Actions from Scratch', durationSeconds: 600 },
            { id: 'v_cicd_2', label: 'Deployment Strategies', durationSeconds: 420 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
      {
        id: 'ch_k8s',
        title: 'Kubernetes Basics',
        order: 3,
        content: {
          body: `Kubernetes (K8s) is a container orchestration platform that automates deployment, scaling, and management of containerised applications. Core objects: **Pod** (smallest deployable unit, one or more containers), **Deployment** (manages replicas and rolling updates), **Service** (stable network endpoint for a set of pods), and **Ingress** (routes external HTTP traffic).

**Horizontal Pod Autoscaler** scales the number of pods based on CPU/memory metrics. **ConfigMaps** and **Secrets** externalise configuration from container images. **Namespaces** provide logical isolation within a cluster.

The learning curve is steep but the primitives are consistent. Start with \`kubectl get\`, \`describe\`, \`logs\`, and \`exec\` — these cover 90% of day-to-day debugging.`,
          videos: [
            { id: 'v_k8s_1', label: 'Kubernetes Core Concepts', durationSeconds: 720 },
            { id: 'v_k8s_2', label: 'Deployments & Services', durationSeconds: 540 },
          ],
          buttons: ['Mark as Complete', 'Download Notes', 'Take Quiz', 'Ask a Question', 'Bookmark'],
        },
      },
    ],
  },
]

export type Book = typeof books[0]
export type Chapter = Book['chapters'][0]