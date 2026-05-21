// pulse-data.js - Your Central Ecosystem Database
const pulseLogs = [
  {
  date: "May 21, 2026",
  platform: "Hashnode",
  icon: "ph-hash",
  color: "#2962ff",
  title: "The Client-Side Mandate: Redesigning the Online Code Editor",
  link: "https://nitroide.hashnode.dev/redesigning-online-code-editor-client-side"
},
  {
  date: "May 21, 2026",
  platform: "LinkedIn",
  icon: "ph-linkedin-logo",
  color: "#0a66c2",
  title: "The most powerful piece of software on your device is being severely underutilized by the tools built to create for it.",
  link: "https://www.linkedin.com/feed/update/urn:li:activity:7463249747827580928/"
},
  {
  date: "May 21, 2026",
  platform: "Peerlist",
  icon: "ph-leaf",
  color: "#00aa45",
  title: "We dropped the cloud backend for our web editor. Here is why your browser is better off without it.",
  link: "https://peerlist.io/scroll/post/ACTH9OBPDEG6O8PGQI8777NNARLQ9J"
},
  {
  date: "May 21, 2026",
  platform: "X",
  icon: "ph-twitter-logo",
  color: "#1da1f2",
  title: "We expect browsers to run AAA games via WebAssembly, but we accept network lag when writing JavaScript.",
  link: "https://x.com/trynitroide/status/2057484129646825590"
},
  {
  date: "May 20, 2026",
  platform: "LinkedIn",
  icon: "ph-linkedin-logo",
  color: "#0a66c2",
  title: "The architectural bottleneck in modern web development isn’t the browser anymore—it’s the tooling ecosystem.",
  link: "https://www.linkedin.com/feed/update/urn:li:activity:7462887388193730560/"
},
  {
  date: "May 20, 2026",
  platform: "Hashnode",
  icon: "ph-hash",
  color: "#2962ff",
  title: "The Edge is Your Machine: Rethinking Online Code Editors",
  link: "https://nitroide.hashnode.dev/edge-is-your-machine-rethinking-online-code-editors"
},
  {
  date: "May 20, 2026",
  platform: "Peerlist",
  icon: "ph-leaf",
  color: "#00aa45",
  title: "We built a client-side IDE because waiting for a cloud container to spin up in 2026 is absurd.",
  link: "https://peerlist.io/scroll/post/ACTHLKLB8GQPBLDAOH97E8L7D9PO9K"
},
  {
  date: "May 20, 2026",
  platform: "X",
  icon: "ph-twitter-logo",
  color: "#1da1f2",
  title: "Browsers can render 3D environments at 60fps, yet your web editor lags when typing CSS.",
  link: "https://x.com/trynitroide/status/2057121696759558278"
},
  {
  date: "May 19, 2026",
  platform: "LinkedIn",
  icon: "ph-linkedin-logo",
  color: "#0a66c2",
  title: "We are utilizing browsers that can run sophisticated WebAssembly applications.",
  link: "https://www.linkedin.com/feed/update/urn:li:share:7462523395184861184/"
},
  {
  date: "May 19, 2026",
  platform: "Peerlist",
  icon: "ph-leaf",
  color: "#00aa45",
  title: "Why boot a cloud container for a frontend prototype?",
  link: "https://peerlist.io/scroll/post/ACTHBARJEG9JEEBDLIEOBDKBJRMDOE"
},
  {
  date: "May 19, 2026",
  platform: "X",
  icon: "ph-twitter-logo",
  color: "#1da1f2",
  title: "Web tooling architecture is stuck in the past. The modern browser is a powerhouse",
  link: "https://x.com/trynitroide/status/2056757212471840899"
},
  {
  date: "May 18, 2026",
  platform: "Hashnode",
  icon: "ph-hash",
  color: "#2962ff",
  title: "Rethinking the Web IDE: Why We Abandoned Cloud Containers",
  link: "https://nitroide.hashnode.dev/rethinking-web-ide-abandoning-cloud-containers"
},
  {
  date: "May 18, 2026",
  platform: "LinkedIn",
  icon: "ph-linkedin-logo",
  color: "#0a66c2",
  title: "We are utilizing browsers that can run complex 3D rendering engines and WebAssembly,",
  link: "https://www.linkedin.com/feed/update/urn:li:activity:7462154688524668928/"
},
  {
  date: "May 18, 2026",
  platform: "Peerlist",
  icon: "ph-leaf",
  color: "#00aa45",
  title: "Why are we still spinning up servers just to prototype a UI?",
  link: "https://peerlist.io/scroll/post/ACTHKKDABEQKPKLG91JLD7OLNN7LDG"
},
  {
  date: "May 18, 2026",
  platform: "X",
  icon: "ph-twitter-logo",
  color: "#1da1f2",
  title: "The modern browser is a powerhouse. Yet most developer tools still behave like it's 2018.",
  link: "https://x.com/trynitroide/status/2056388122045509959"
},
  {
  date: "May 17, 2026",
  platform: "LinkedIn",
  icon: "ph-linkedin-logo",
  color: "#0a66c2",
  title: "We have normalized a broken standard in browser-based development",
  link: "https://www.linkedin.com/feed/update/urn:li:activity:7461801765559078912/"
},
  {
  date: "May 17, 2026",
  platform: "Product Hunt",
  icon: "ph-rocket-launch",
  color: "#ff6154",
  title: "Have you ever noticed that slight, annoying lag when using an online IDE?",
  link: "https://www.producthunt.com/p/self-promotion/have-you-ever-noticed-that-slight-annoying-lag-when-using-an-online-ide"
},
  {
  date: "May 17, 2026",
  platform: "Hashnode",
  icon: "ph-hash",
  color: "#2962ff",
  title: "The Flow State Deficit: Engineering a Browser IDE at the Speed of Thought",
  link: "https://nitroide.hashnode.dev/flow-state-deficit-browser-ide-speed-of-thought?utm_source=hashnode&utm_medium=feed"
},
  {
  date: "May 17, 2026",
  platform: "Peerlist",
  icon: "ph-leaf",
  color: "#00aa45",
  title: "Project Update: Eliminating the latency tax in developer tools",
  link: "https://peerlist.io/scroll/post/ACTHJKN9ABRLJKB9N3MN6JJ68GQ9AA"
},
  {
  date: "May 17, 2026",
  platform: "X",
  icon: "ph-twitter-logo",
  color: "#1da1f2",
  title: "We built NitroIDE to fix this. It’s a 100% client-side IDE.",
  link: "https://x.com/trynitroide/status/2056031188536717449"
},
  {
  date: "May 16, 2026",
  platform: "LinkedIn",
  icon: "ph-linkedin-logo",
  color: "#0a66c2",
  title: "The evolution of developer tools has hit a critical inflection point.",
  link: "https://www.linkedin.com/feed/update/urn:li:activity:7461434637140201472/"
},
  {
  date: "May 16, 2026",
  platform: "Product Hunt",
  icon: "ph-rocket-launch",
  color: "#ff6154",
  title: "For too long, the phrase online IDE meant sacrificing speed for convenience.",
  link: "https://www.producthunt.com/p/self-promotion/nitroide-is-a-zero-latency-local-first-browser-ide"
},
  {
  date: "May 16, 2026",
  platform: "Hashnode",
  icon: "ph-hash",
  color: "#2962ff",
  title: "Redefining the Web IDE: Why We Chose a Local-First Architecture",
  link: "https://nitroide.hashnode.dev/redefining-the-web-ide-local-first-browser-ide-architecture"
},
  {
  date: "May 16, 2026",
  platform: "Peerlist",
  icon: "ph-leaf",
  color: "#00aa45",
  title: "Project Update: Pushing the limits of the browser environment",
  link: "https://peerlist.io/scroll/post/ACTH7B8O6Q6GB6QDRI9DQGBDDA9GKD"
},
  {
  date: "May 16, 2026",
  platform: "X",
  icon: "ph-twitter-logo",
  color: "#1da1f2",
  title: "The browser was never the bottleneck; the cloud architecture was. ",
  link: "https://x.com/trynitroide/status/2055663860108132368"
},
{
  date: "May 15, 2026",
  platform: "Peerlist",
  icon: "ph-leaf",
  color: "#00aa45",
  title: "Project Update: Eliminating Latency in the Web IDE",
  link: "https://peerlist.io/scroll/post/ACTHNN7EKMBL79OJRHOG6R9GNO8OJP"
},
  {
  date: "May 15, 2026",
  platform: "X",
  icon: "ph-twitter-logo",
  color: "#1da1f2",
  title: "We built NitroIDE as a truly local-first IDE.",
  link: "https://x.com/trynitroide/status/2055336562989363294"
},
  {
  date: "May 15, 2026",
  platform: "LinkedIn",
  icon: "ph-linkedin-logo",
  color: "#0a66c2",
  title: "The standard for browser-based development is broken. We have normalized latency.",
  link: "https://www.linkedin.com/feed/update/urn:li:activity:7461100896912003073/"
},
  {
    date: "May 15, 2026",
    platform: "Product Hunt",
    icon: "ph-rocket-launch",
    color: "#ff6154",
    title: "Discussion: What if an online IDE felt instant?",
    link: "https://www.producthunt.com/p/general/what-if-an-online-ide-felt-instant"
  },
  {
    date: "May 14, 2026",
    platform: "LinkedIn",
    icon: "ph-linkedin-logo",
    color: "#0a66c2",
    title: "Why are cloud IDEs so slow? I built a local alternative.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7460748122923618304/"
  },
  {
    date: "May 12, 2026",
    platform: "X",
    icon: "ph-twitter-logo",
    color: "#1da1f2",
    title: "We just pushed a massive update to the execution engine...",
    link: "https://x.com/trynitroide/status/2054956322869899699"
  }
];
