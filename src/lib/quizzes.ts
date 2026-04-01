export interface Question {
  q: string
  options: string[]
  answer: number // index of correct option
  explanation: string
}

export const chapterQuizzes: Record<string, Question[]> = {
  ch_scale: [
    {
      q: 'Which scaling strategy adds more machines to handle increased load?',
      options: ['Vertical scaling', 'Horizontal scaling', 'Diagonal scaling', 'Cache scaling'],
      answer: 1,
      explanation: 'Horizontal scaling (scale out) means adding more machines. Vertical scaling (scale up) means upgrading the existing machine.',
    },
    {
      q: 'What is a key requirement for horizontal scaling to work effectively?',
      options: ['More RAM per server', 'Stateless application design', 'A single powerful database', 'Synchronous processing'],
      answer: 1,
      explanation: 'Applications must be stateless so any server can handle any request. Session data must be stored externally (e.g. Redis), not in memory.',
    },
    {
      q: 'Which of the following is a disadvantage of vertical scaling?',
      options: ['Requires code changes', 'Complex to implement', 'Has a hard upper limit', 'Requires load balancers'],
      answer: 2,
      explanation: 'Vertical scaling has a hard ceiling — there is only so much CPU and RAM you can add to a single machine. It also creates a single point of failure.',
    },
    {
      q: 'What does a load balancer primarily do?',
      options: ['Stores session data', 'Distributes traffic across multiple servers', 'Compresses responses', 'Manages database connections'],
      answer: 1,
      explanation: 'A load balancer distributes incoming requests across multiple backend servers using algorithms like Round Robin or Least Connections.',
    },
    {
      q: 'For which workload is vertical scaling typically preferred first?',
      options: ['Web servers', 'Stateless APIs', 'Databases', 'Static file serving'],
      answer: 2,
      explanation: 'Databases are often scaled vertically first because sharding (horizontal scaling) is complex. They are then sharded horizontally when vertical limits are reached.',
    },
  ],

  ch_db: [
    {
      q: 'Which database type guarantees ACID transactions?',
      options: ['Document stores', 'Key-value stores', 'Relational databases', 'Column-family databases'],
      answer: 2,
      explanation: 'Relational databases like PostgreSQL and MySQL provide ACID (Atomicity, Consistency, Isolation, Durability) guarantees.',
    },
    {
      q: 'You need sub-millisecond reads and your access pattern is always by a single key. Which database fits best?',
      options: ['PostgreSQL', 'MongoDB', 'Cassandra', 'Redis'],
      answer: 3,
      explanation: 'Redis is a key-value store optimised for extremely fast reads and writes. It stores data in memory, making it ideal for caching and sessions.',
    },
    {
      q: 'What does "polyglot persistence" mean?',
      options: ['Using one database for everything', 'Using multiple database types in one application', 'Translating queries between databases', 'Storing data in multiple languages'],
      answer: 1,
      explanation: 'Polyglot persistence means using different databases for different parts of an application based on access patterns — e.g. PostgreSQL for user data, Redis for sessions, Cassandra for logs.',
    },
    {
      q: 'Which database is best suited for write-heavy time-series workloads like IoT sensor data?',
      options: ['MySQL', 'MongoDB', 'Cassandra', 'Redis'],
      answer: 2,
      explanation: 'Cassandra is a column-family database optimised for high write throughput and time-series data. It scales horizontally with no single point of failure.',
    },
    {
      q: 'What should be the primary factor when choosing a database?',
      options: ['Team familiarity', 'Popularity', 'Access patterns and query requirements', 'Licensing cost'],
      answer: 2,
      explanation: 'The database choice should be driven by your access patterns — read/write ratio, query complexity, and consistency requirements — not just familiarity.',
    },
  ],

  ch_cache: [
    {
      q: 'In cache-aside pattern, what happens on a cache miss?',
      options: ['The request fails', 'The app fetches from DB and populates cache', 'The cache fetches from DB automatically', 'A background job fills the cache'],
      answer: 1,
      explanation: 'In cache-aside (lazy loading), on a miss the application fetches the data from the database and then writes it to the cache before returning it.',
    },
    {
      q: 'Which caching pattern has the risk of data loss if the cache crashes before flushing?',
      options: ['Cache-aside', 'Write-through', 'Write-behind', 'Read-through'],
      answer: 2,
      explanation: 'Write-behind (write-back) writes to cache and asynchronously flushes to the database. If the cache crashes before flushing, those writes are lost.',
    },
    {
      q: 'Which eviction policy works best when some items are always popular regardless of recency?',
      options: ['LRU', 'FIFO', 'LFU', 'TTL'],
      answer: 2,
      explanation: 'LFU (Least Frequently Used) evicts items accessed least often, keeping perennially popular items in cache even if they were not accessed recently.',
    },
    {
      q: 'What does TTL stand for in caching?',
      options: ['Total Transfer Limit', 'Time To Live', 'Type Transfer Layer', 'Temporary Table Lock'],
      answer: 1,
      explanation: 'TTL (Time To Live) defines how long a cached item remains valid before expiring. Always setting TTLs prevents caches from growing unbounded.',
    },
    {
      q: 'Which caching pattern ensures the cache is always in sync with the database on every write?',
      options: ['Cache-aside', 'Write-through', 'Write-behind', 'Read-through'],
      answer: 1,
      explanation: 'Write-through writes to both cache and database simultaneously on every write, ensuring they are always in sync. The trade-off is higher write latency.',
    },
  ],

  ch_arrays: [
    {
      q: 'What is the time complexity of accessing an element by index in an array?',
      options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'],
      answer: 2,
      explanation: 'Arrays store elements in contiguous memory, so any element can be accessed directly by its index in constant time O(1).',
    },
    {
      q: 'Which pattern is best for finding a pair of elements that sum to a target in a sorted array?',
      options: ['Sliding window', 'Two pointers', 'Binary search', 'Frequency map'],
      answer: 1,
      explanation: 'The two-pointer technique uses left and right pointers converging toward the centre. If the sum is too small, move left pointer right; if too large, move right pointer left.',
    },
    {
      q: 'What is the time complexity of inserting an element at an arbitrary position in an array?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      answer: 2,
      explanation: 'Inserting at an arbitrary position requires shifting all elements after that position, resulting in O(n) time complexity.',
    },
    {
      q: 'The sliding window pattern is most useful for problems involving:',
      options: ['Sorting elements', 'Finding subarrays satisfying a condition', 'Binary search', 'Graph traversal'],
      answer: 1,
      explanation: 'The sliding window maintains a subarray (window) that satisfies some condition, expanding or shrinking it as needed. It turns O(n²) brute force into O(n).',
    },
    {
      q: 'What data structure is best for checking character frequencies in a string?',
      options: ['Stack', 'Queue', 'Hash map / frequency array', 'Linked list'],
      answer: 2,
      explanation: 'A hash map (or fixed-size array for ASCII) maps each character to its count. Building it is O(n) and lookups are O(1).',
    },
  ],

  ch_trees: [
    {
      q: 'Which traversal algorithm uses a queue and explores nodes level by level?',
      options: ['DFS preorder', 'DFS inorder', 'BFS', 'DFS postorder'],
      answer: 2,
      explanation: 'BFS (Breadth-First Search) uses a queue to explore all nodes at the current depth before moving to the next level.',
    },
    {
      q: 'For finding the shortest path in an unweighted graph, which algorithm should you use?',
      options: ['DFS', 'BFS', 'Topological sort', 'Inorder traversal'],
      answer: 1,
      explanation: 'BFS guarantees the shortest path in unweighted graphs because it explores nodes level by level — the first time it reaches a node is via the shortest path.',
    },
    {
      q: 'What is a key difference when doing DFS on a graph vs a tree?',
      options: ['Graphs use recursion, trees use iteration', 'You must track visited nodes in graphs to avoid infinite loops', 'Trees require a queue', 'Graphs cannot be traversed with DFS'],
      answer: 1,
      explanation: 'Graphs can have cycles, so you must track visited nodes to avoid visiting the same node repeatedly and entering an infinite loop. Trees are acyclic so this is not needed.',
    },
    {
      q: 'Topological sort can only be applied to which type of graph?',
      options: ['Undirected graphs', 'Graphs with cycles', 'Directed Acyclic Graphs (DAGs)', 'Weighted graphs'],
      answer: 2,
      explanation: 'Topological sort orders nodes such that every directed edge goes from earlier to later. It only works on DAGs — graphs with cycles have no valid topological ordering.',
    },
    {
      q: 'What is the average time complexity of search in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      answer: 1,
      explanation: 'In a balanced BST, each comparison eliminates half the remaining nodes, giving O(log n) average search time. An unbalanced BST degrades to O(n).',
    },
  ],
}

// ── New System Design chapters ─────────────────────────────────────────────
const newQuizzes = {
  ch_msgqueue: [
    { q: 'What is the primary benefit of using a message queue?', options: ['Faster database queries', 'Decoupling producers from consumers', 'Reducing memory usage', 'Simplifying authentication'], answer: 1, explanation: 'Message queues decouple producers and consumers so they operate independently and asynchronously — the producer does not wait for the consumer to process the message.' },
    { q: 'Which system treats messages as an immutable, replayable log?', options: ['RabbitMQ', 'AWS SQS', 'Apache Kafka', 'Redis Pub/Sub'], answer: 2, explanation: 'Kafka stores messages as an immutable log that consumers can replay from any offset. This enables event sourcing, audit trails, and rebuilding state.' },
    { q: 'What is a dead-letter queue used for?', options: ['Storing deleted messages permanently', 'Holding messages that failed processing', 'Archiving old messages', 'Prioritising urgent messages'], answer: 1, explanation: 'A dead-letter queue (DLQ) captures messages that could not be processed after a maximum number of retries, allowing teams to inspect and debug failures.' },
    { q: 'Which delivery semantic guarantees a message is processed at least once but may cause duplicates?', options: ['Exactly-once', 'At-most-once', 'At-least-once', 'Best-effort'], answer: 2, explanation: 'At-least-once delivery retries failed messages, which can result in duplicates. Consumers must be idempotent to handle this safely.' },
    { q: 'What are consumer groups used for in Kafka?', options: ['Encrypting messages', 'Load balancing message processing across multiple consumers', 'Routing messages by type', 'Compressing the message log'], answer: 1, explanation: 'Consumer groups allow multiple consumer instances to share the work of processing a topic in parallel — each partition is assigned to one consumer in the group.' },
  ],
  ch_cdn: [
    { q: 'What is the primary purpose of a CDN?', options: ['Encrypt data in transit', 'Serve content from servers geographically close to users', 'Compress database queries', 'Manage DNS records'], answer: 1, explanation: 'A CDN distributes static assets to edge servers worldwide so users are served from a nearby location, reducing latency dramatically.' },
    { q: 'Which HTTP header controls how long a CDN caches a response?', options: ['Authorization', 'Cache-Control', 'Content-Type', 'X-Forwarded-For'], answer: 1, explanation: 'The Cache-Control header tells both browsers and CDNs how long to cache a response (e.g. max-age=3600) and whether it can be cached at all.' },
    { q: 'What advantage do edge functions have over traditional server functions?', options: ['They use more memory', 'They run physically closer to users with near-zero cold starts', 'They support larger file uploads', 'They bypass CDN caching'], answer: 1, explanation: 'Edge functions run at CDN nodes worldwide, executing close to the user with extremely low latency and near-instant cold starts compared to regional servers.' },
    { q: 'What does an ETag HTTP header enable?', options: ['Authentication', 'Conditional requests to validate cached content', 'Compression', 'Load balancing'], answer: 1, explanation: 'An ETag is a version identifier for a resource. Clients send it back with If-None-Match; if unchanged, the server returns 304 Not Modified instead of the full response.' },
    { q: 'Which of these is NOT a benefit of using a CDN?', options: ['DDoS protection', 'Reduced origin server load', 'SSL termination', 'Faster database writes'], answer: 3, explanation: 'CDNs handle static content delivery, DDoS mitigation, and SSL termination — they do not interact with your database or speed up write operations.' },
  ],
  ch_ratelimit: [
    { q: 'Which rate limiting algorithm allows short bursts above the average rate?', options: ['Leaky bucket', 'Token bucket', 'Fixed window', 'Sliding log'], answer: 1, explanation: 'Token bucket accumulates tokens over time up to a maximum. Burst traffic can consume multiple tokens at once, allowing short spikes while still enforcing an average rate.' },
    { q: 'What HTTP status code should an API return when a rate limit is exceeded?', options: ['400 Bad Request', '401 Unauthorized', '429 Too Many Requests', '503 Service Unavailable'], answer: 2, explanation: '429 Too Many Requests is the correct status code for rate limit violations. It should be accompanied by a Retry-After header indicating when the client can retry.' },
    { q: 'Which pagination strategy is most efficient for large, frequently updated datasets?', options: ['Offset pagination', 'Cursor-based pagination', 'Page number pagination', 'Random pagination'], answer: 1, explanation: 'Cursor-based pagination uses a stable pointer (like an ID or timestamp) rather than an offset. It handles inserts/deletes without skipping or duplicating rows.' },
    { q: 'What does the Retry-After header tell an API client?', options: ['When the server will restart', 'How long to wait before making another request', 'The API version to use', 'The maximum request size'], answer: 1, explanation: 'Retry-After tells the client how long (in seconds) to wait before retrying a rate-limited request. Well-behaved clients use this to implement exponential backoff.' },
    { q: 'Which rate limiting algorithm provides the smoothest traffic flow?', options: ['Token bucket', 'Fixed window', 'Leaky bucket', 'Sliding window'], answer: 2, explanation: 'The leaky bucket processes requests at a constant rate regardless of burst — like water leaking from a bucket at a fixed rate, smoothing out all traffic spikes.' },
  ],
  ch_dp: [
    { q: 'What are the two key properties a problem must have to apply dynamic programming?', options: ['Recursion and iteration', 'Optimal substructure and overlapping subproblems', 'Greedy choice and local optimum', 'Divide and conquer and merge'], answer: 1, explanation: 'DP requires optimal substructure (optimal solution built from optimal subproblems) and overlapping subproblems (same subproblems solved repeatedly, making caching worthwhile).' },
    { q: 'What is memoisation in the context of dynamic programming?', options: ['Writing comments in code', 'Caching results of recursive calls to avoid recomputation', 'Sorting the input before processing', 'Using iteration instead of recursion'], answer: 1, explanation: 'Memoisation stores the result of each unique subproblem the first time it is solved. Subsequent calls return the cached result in O(1) rather than recomputing.' },
    { q: 'Which DP approach fills a table iteratively from base cases up?', options: ['Top-down memoisation', 'Bottom-up tabulation', 'Greedy approach', 'Divide and conquer'], answer: 1, explanation: 'Bottom-up tabulation solves subproblems in order from smallest to largest, filling a table iteratively. It avoids recursion overhead and is typically faster.' },
    { q: 'What is the time complexity of the classic 0/1 Knapsack problem with DP?', options: ['O(n)', 'O(n log n)', 'O(n × W) where W is capacity', 'O(2^n)'], answer: 2, explanation: 'The DP solution to 0/1 Knapsack has O(n × W) time and space complexity — for each of n items we consider each weight from 0 to W.' },
    { q: 'What is the key to formulating a DP solution?', options: ['Finding the right sorting order', 'Identifying the state — what information uniquely describes a subproblem', 'Choosing the fastest language', 'Using recursion always'], answer: 1, explanation: 'The hardest part of DP is defining the state. The state must contain exactly the information needed to solve a subproblem without knowing how you got there.' },
  ],
  ch_sorting: [
    { q: 'Which sorting algorithm guarantees O(n log n) in the worst case?', options: ['Quick sort', 'Bubble sort', 'Merge sort', 'Insertion sort'], answer: 2, explanation: 'Merge sort always divides the array in half and merges in O(n), giving O(n log n) in all cases. Quick sort degrades to O(n²) on already-sorted input with a bad pivot.' },
    { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 1, explanation: 'Binary search halves the search space each step. Starting with n elements: n → n/2 → n/4 → ... → 1, which takes log₂(n) steps.' },
    { q: 'Binary search requires the input to be:', options: ['Unsorted', 'Sorted', 'Unique elements only', 'Numeric only'], answer: 1, explanation: 'Binary search only works on sorted data because it relies on the property that all elements left of mid are smaller and all right are larger.' },
    { q: 'Which hybrid sorting algorithm is used in Python and Java?', options: ['Introsort', 'Timsort', 'Heapsort', 'Shell sort'], answer: 1, explanation: 'Timsort is a hybrid of merge sort and insertion sort. It finds naturally ordered runs in the data and merges them efficiently, performing well on real-world data.' },
    { q: 'What is the best case time complexity of insertion sort?', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'], answer: 2, explanation: 'When the input is already sorted, insertion sort only makes one comparison per element and no swaps — O(n). This is why Timsort uses it for small or nearly-sorted runs.' },
  ],
  ch_heaps: [
    { q: 'What does a min-heap guarantee about the root element?', options: ['It is the largest element', 'It is the smallest element', 'It is the median element', 'It is a random element'], answer: 1, explanation: 'In a min-heap, every parent is smaller than its children. The root is therefore always the minimum element, accessible in O(1).' },
    { q: 'What is the time complexity of inserting into a heap?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, explanation: 'Insertion adds the element at the end and "bubbles up" by swapping with parents until the heap property is restored. This takes at most O(log n) swaps (the height of the tree).' },
    { q: 'How do you simulate a max-heap using Python\'s heapq (which is a min-heap)?', options: ['Use a different library', 'Negate all values before inserting', 'Reverse the list after building', 'Use heapq.max()'], answer: 1, explanation: 'Python\'s heapq is a min-heap only. By negating values (-x), the smallest negated value corresponds to the largest original value, simulating max-heap behaviour.' },
    { q: 'What is the time complexity of finding the top-K largest elements using a min-heap?', options: ['O(n²)', 'O(n log n)', 'O(n log K)', 'O(K)'], answer: 2, explanation: 'Maintain a min-heap of size K. For each of n elements: if larger than heap root, replace it and sift down in O(log K). Total: O(n log K), better than O(n log n) sorting when K is small.' },
    { q: 'Which algorithm uses a min-heap as its core data structure?', options: ['Merge sort', 'Dijkstra\'s shortest path', 'Binary search', 'DFS'], answer: 1, explanation: 'Dijkstra\'s algorithm uses a min-heap (priority queue) to always process the unvisited node with the smallest known distance, achieving O((V + E) log V) time.' },
  ],
  ch_react: [
    { q: 'When should you use useCallback?', options: ['To cache expensive computations', 'To stabilise function references passed as props to child components', 'To fetch data on mount', 'To manage global state'], answer: 1, explanation: 'useCallback memoises a function so its reference stays stable between renders. This prevents child components wrapped in React.memo from re-rendering unnecessarily.' },
    { q: 'What is the correct way to share state between sibling components?', options: ['Use localStorage', 'Lift state to the closest common ancestor', 'Use useRef in each component', 'Duplicate state in each component'], answer: 1, explanation: 'Lifting state up means moving it to the nearest common ancestor and passing it down as props. This is the React-idiomatic way to share state between siblings.' },
    { q: 'What does React.memo do?', options: ['Memoises the result of an expensive function', 'Prevents a component from re-rendering if its props haven\'t changed', 'Caches API responses', 'Creates a memoised selector'], answer: 1, explanation: 'React.memo wraps a functional component and performs a shallow comparison of props. If props are unchanged, the component skips re-rendering.' },
    { q: 'What is the purpose of the dependency array in useEffect?', options: ['It lists all state variables', 'It controls when the effect re-runs', 'It defines the effect\'s return type', 'It specifies which props to ignore'], answer: 1, explanation: 'The dependency array tells React when to re-run the effect. Empty array = run once on mount. Listed values = re-run when any of them change. Omitted = run after every render.' },
    { q: 'What does the "use client" directive do in Next.js?', options: ['Marks a route as client-side only', 'Tells React the component needs browser APIs or interactivity', 'Disables server-side rendering', 'Enables client-side caching'], answer: 1, explanation: '"use client" marks the boundary where server component trees hand off to client components. Components below this boundary are included in the JS bundle sent to the browser.' },
  ],
  ch_nextjs: [
    { q: 'What is the main advantage of React Server Components?', options: ['They run faster on the client', 'They render on the server with zero JS bundle impact', 'They replace useEffect entirely', 'They enable offline support'], answer: 1, explanation: 'Server Components render on the server and send HTML to the client. They have no client-side JS footprint, reducing bundle size and enabling direct database/file system access.' },
    { q: 'What does ISR (Incremental Static Regeneration) do?', options: ['Renders pages client-side only', 'Rebuilds static pages in the background after a set interval', 'Disables caching for a route', 'Generates all pages at build time'], answer: 1, explanation: 'ISR allows statically generated pages to be revalidated on a schedule. After the revalidation period, the next request triggers a background rebuild while still serving the old page.' },
    { q: 'Which rendering strategy is fastest for users?', options: ['Dynamic (per request)', 'Client-side rendering', 'Static generation', 'Server-side rendering'], answer: 2, explanation: 'Static generation builds pages at compile time and serves them from a CDN. There is no server processing per request — it is the fastest possible delivery.' },
    { q: 'In Next.js App Router, how do you fetch data in a server component?', options: ['Using useEffect and fetch', 'Using getServerSideProps', 'Using async/await directly in the component', 'Using SWR'], answer: 2, explanation: 'Server components can be async functions. You call await fetch() or query a database directly inside the component body — no useEffect or API route needed.' },
    { q: 'What is the purpose of the "revalidate" export in a Next.js page?', options: ['It re-runs the component on every keystroke', 'It sets the ISR revalidation interval in seconds', 'It validates form inputs', 'It refreshes the browser cache'], answer: 1, explanation: 'export const revalidate = N tells Next.js to treat the page as ISR and rebuild it in the background every N seconds after the first request past that interval.' },
  ],
  ch_css: [
    { q: 'When should you use CSS Grid over Flexbox?', options: ['For single-row navigation bars', 'For two-dimensional layouts with both rows and columns', 'For text alignment', 'For animations'], answer: 1, explanation: 'CSS Grid excels at two-dimensional layouts where you control both rows and columns. Flexbox is better for one-dimensional layouts (a row OR a column).' },
    { q: 'What is the benefit of CSS Modules?', options: ['Faster rendering', 'Scoped class names that prevent style conflicts', 'Built-in animations', 'Automatic vendor prefixing'], answer: 1, explanation: 'CSS Modules transform class names to unique hashes at build time (e.g. .button → .Button_button__abc12), ensuring styles never leak between components.' },
    { q: 'What does "will-change" tell the browser?', options: ['That an element will be removed', 'To optimise rendering for an upcoming animation or transformation', 'That styles will change on hover', 'To preload resources'], answer: 1, explanation: 'will-change hints to the browser that an element will change (e.g. will-change: transform), allowing it to promote the element to its own compositor layer in advance.' },
    { q: 'What causes Cumulative Layout Shift (CLS)?', options: ['Slow JavaScript execution', 'Elements shifting position after initial render', 'Large images', 'Too many HTTP requests'], answer: 1, explanation: 'CLS occurs when content shifts unexpectedly — common causes include images without dimensions, ads loading late, and web fonts causing text reflow (FOIT/FOUT).' },
    { q: 'Which CSS approach colocates utility classes directly in HTML/JSX?', options: ['CSS Modules', 'BEM', 'Tailwind CSS', 'CSS-in-JS'], answer: 2, explanation: 'Tailwind CSS uses utility classes like flex, pt-4, text-center directly in markup instead of separate CSS files, keeping styles and structure colocated.' },
  ],
  ch_perf: [
    { q: 'Which Core Web Vital measures loading performance?', options: ['CLS', 'INP', 'LCP', 'FID'], answer: 2, explanation: 'LCP (Largest Contentful Paint) measures when the largest visible content element finishes loading. A good LCP is under 2.5 seconds.' },
    { q: 'What is code splitting?', options: ['Breaking CSS into smaller files', 'Loading JavaScript bundles only when needed rather than all upfront', 'Splitting a database into shards', 'Separating HTML from JS'], answer: 1, explanation: 'Code splitting divides the JS bundle into smaller chunks loaded on demand. React.lazy() and dynamic import() enable component-level splitting, reducing initial load time.' },
    { q: 'What does "font-display: swap" do?', options: ['Disables web fonts', 'Shows fallback text immediately while the web font loads', 'Swaps font sizes dynamically', 'Enables variable fonts'], answer: 1, explanation: 'font-display: swap tells the browser to show text in a fallback font immediately and swap to the web font when it loads, preventing invisible text during loading (FOIT).' },
    { q: 'What is an "optimistic UI" update?', options: ['Showing a loading spinner', 'Updating the UI immediately before the server confirms the action', 'Caching API responses', 'Pre-rendering all pages'], answer: 1, explanation: 'Optimistic UI updates the interface immediately on user action (assuming success) and reverts if the server returns an error. This makes apps feel instantaneous.' },
    { q: 'Which image format provides the best compression for web use?', options: ['PNG', 'JPEG', 'GIF', 'WebP or AVIF'], answer: 3, explanation: 'WebP provides 25-35% smaller files than JPEG at equivalent quality. AVIF is even better but has slightly less browser support. Both should be served with JPEG/PNG fallbacks.' },
  ],
  ch_docker: [
    { q: 'What is the purpose of a multi-stage Docker build?', options: ['To run multiple containers', 'To produce a lean production image by separating build and runtime stages', 'To enable parallel builds', 'To cache all dependencies'], answer: 1, explanation: 'Multi-stage builds use one stage to compile/build (with all dev tools) and copy only the output to a minimal runtime image, dramatically reducing final image size.' },
    { q: 'What are Docker volumes used for?', options: ['Speeding up builds', 'Persisting data outside the container lifecycle', 'Sharing CPU resources', 'Encrypting container traffic'], answer: 1, explanation: 'Volumes persist data independently of containers. When a container is stopped or deleted, volume data survives — essential for databases and stateful applications.' },
    { q: 'Which base image results in the smallest Docker image size?', options: ['ubuntu', 'debian', 'alpine', 'centos'], answer: 2, explanation: 'Alpine Linux is a minimal distribution (~5MB) purpose-built for containers. It provides a shell and package manager while being dramatically smaller than full distros.' },
    { q: 'Why should Docker containers run as non-root users?', options: ['For better performance', 'For security — root in container can be root on host', 'To enable networking', 'To access volumes'], answer: 1, explanation: 'Running as root inside a container is a security risk. If the container is compromised, the attacker may gain root access to the host. Always use USER in your Dockerfile.' },
    { q: 'What determines Docker layer caching behaviour?', options: ['File sizes', 'The order of Dockerfile instructions and whether inputs changed', 'Network speed', 'Number of containers'], answer: 1, explanation: 'Docker caches each layer. If a layer\'s instruction or its inputs change, that layer and all subsequent layers are rebuilt. Copy dependency files before source code to maximise cache hits.' },
  ],
  ch_cicd: [
    { q: 'What is the main goal of Continuous Integration?', options: ['Automatically deploy to production', 'Automatically build and test code on every push', 'Monitor production systems', 'Manage infrastructure'], answer: 1, explanation: 'CI automatically runs builds and tests on every code push, catching integration bugs early when they are cheapest to fix — before they reach production.' },
    { q: 'What is a blue-green deployment?', options: ['A colour-coded monitoring dashboard', 'Running two identical environments and switching traffic between them', 'Deploying to blue servers only', 'A testing methodology'], answer: 1, explanation: 'Blue-green deployment maintains two identical production environments. The new version deploys to the idle environment; traffic switches instantly. Rollback is just switching back.' },
    { q: 'Why should CI pipelines run unit tests before integration tests?', options: ['Unit tests are harder to write', 'Fast feedback — unit tests catch most bugs quickly and cheaply', 'Integration tests are optional', 'Unit tests require less setup'], answer: 1, explanation: 'Unit tests run in milliseconds with no external dependencies. Running them first provides fast feedback. Integration tests are slower and should only run after unit tests pass.' },
    { q: 'What are feature flags used for in deployment?', options: ['Flagging bugs in code', 'Enabling/disabling features without deploying new code', 'Marking files as changed', 'Tracking feature requests'], answer: 1, explanation: 'Feature flags let you deploy code to production but keep features hidden behind a toggle. You can enable features for specific users or roll back instantly without redeploying.' },
    { q: 'What should secrets (API keys, passwords) be stored as in GitHub Actions?', options: ['Hardcoded in workflow files', 'In environment variables committed to the repo', 'As GitHub Actions Secrets', 'In a .env file in the repository'], answer: 2, explanation: 'GitHub Actions Secrets are encrypted and injected at runtime. They never appear in logs or the repository. Never commit secrets to source control or hardcode them in workflows.' },
  ],
  ch_k8s: [
    { q: 'What is the smallest deployable unit in Kubernetes?', options: ['Container', 'Pod', 'Node', 'Deployment'], answer: 1, explanation: 'A Pod is the smallest deployable unit in Kubernetes. It contains one or more containers that share network and storage, and are scheduled together on the same node.' },
    { q: 'What does a Kubernetes Deployment manage?', options: ['Network routing', 'A set of identical Pod replicas and rolling updates', 'Persistent storage', 'DNS records'], answer: 1, explanation: 'A Deployment declares the desired state (e.g. 3 replicas of image X). Kubernetes continuously reconciles actual state to match, handling rolling updates and rollbacks.' },
    { q: 'What is the purpose of a Kubernetes Service?', options: ['To run one-off jobs', 'To provide a stable network endpoint for a dynamic set of Pods', 'To schedule Pods on nodes', 'To store configuration'], answer: 1, explanation: 'Pods are ephemeral and get new IPs when replaced. A Service provides a stable virtual IP and DNS name, load-balancing traffic to all healthy matching Pods.' },
    { q: 'What does the Horizontal Pod Autoscaler do?', options: ['Adds CPU to existing nodes', 'Scales the number of Pod replicas based on metrics like CPU usage', 'Distributes Pods across regions', 'Manages storage volumes'], answer: 1, explanation: 'HPA monitors metrics (CPU, memory, or custom) and automatically increases or decreases the number of Pod replicas to maintain target utilisation.' },
    { q: 'What is the difference between ConfigMaps and Secrets in Kubernetes?', options: ['ConfigMaps are faster', 'Secrets are base64-encoded and intended for sensitive data; ConfigMaps are for plain config', 'They are identical', 'ConfigMaps support more data types'], answer: 1, explanation: 'Both store key-value data, but Secrets are intended for sensitive information (passwords, tokens) and are base64-encoded. In production, Secrets should be encrypted at rest.' },
  ],
}

Object.assign(chapterQuizzes, newQuizzes)