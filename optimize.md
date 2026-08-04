# CRITICAL NEXT.JS PRODUCTION PROCESS OPTIMIZATION & HOSTING STABILITY TASK

You are working on my existing Next.js website.

## PRIMARY OBJECTIVE

I need you to perform a serious production optimization of this Next.js application specifically to solve a hosting resource problem reported by my hosting provider, TheBeeHost.

The website currently works, and I want it to continue working **exactly the same from the user's perspective**.

The goal is:

1. Dramatically reduce unnecessary Node.js / `lsnode` processes.
2. Prevent multiple copies/instances of the Next.js application from running simultaneously.
3. Prevent old/stale Next.js processes from remaining alive after deployment/restart.
4. Reduce CPU, RAM, process count, and unnecessary background workload.
5. Make the application suitable for a resource-limited shared hosting environment.
6. Keep all existing functionality, pages, APIs, authentication, database operations, emails, animations, SEO, responsive behavior, and UI unchanged.
7. Ensure the optimization does NOT negatively affect my other websites hosted under the same hosting account.

IMPORTANT:

Do NOT blindly rewrite or simplify the application.

Do NOT remove functionality merely to reduce resource usage.

Do NOT change the UI/UX unless absolutely necessary for performance.

Do NOT migrate the application to another framework.

Do NOT introduce a VPS requirement.

First inspect the project and determine the actual cause.

---

# HOSTING PROVIDER'S REPORT

TheBeeHost reported that my hosting account reached:

150 / 150 processes = 100%

They specifically reported that my Next.js application is using too many processes.

They found three `lsnode` processes, with each creating many child processes.

They reported that my account was using approximately 149 out of 150 allowed processes.

They also reported that stopping the Node.js application removed only ONE `lsnode` process while TWO older `lsnode` processes remained running.

The hosting provider therefore had to manually terminate the remaining `lsnode` processes.

This strongly suggests that we must investigate:

* duplicate Node.js application instances
* stale Node processes
* restart behavior
* deployment behavior
* process-manager configuration
* incorrect start commands
* accidental development server usage
* multiple application launches
* child process creation
* clustering
* worker processes
* build processes accidentally running in production
* PM2 or other process managers if present
* cPanel / Passenger / LiteSpeed Node configuration
* scripts that may spawn additional processes
* cron jobs
* scheduled tasks
* deployment hooks
* `.cpanel.yml`
* Git deployment configuration
* startup scripts
* any automatic restart mechanism

The provided hosting process list contains a very large number of `lsnode` entries associated with my account. Treat this as evidence that process lifecycle management needs to be investigated carefully.

---

# PHASE 1 — FORENSIC AUDIT FIRST

Before changing anything, inspect the ENTIRE repository.

Do not immediately modify files.

Create a complete diagnosis of why the application could create or leave behind excessive processes.

Inspect at minimum:

## 1. package.json

Check:

* scripts
* `dev`
* `build`
* `start`
* `lint`
* test scripts
* postinstall
* prepare
* prebuild
* postbuild
* any custom scripts

Determine whether production could accidentally be starting:

* `next dev`
* multiple `next start`
* multiple Node processes
* watch mode
* development tooling
* build watchers

Production must NEVER use a development server.

---

## 2. Next.js configuration

Inspect:

* `next.config.*`
* `next.config.js`
* `next.config.mjs`
* `next.config.ts`

Look for:

* experimental features
* worker-related settings
* compiler configuration
* image configuration
* middleware
* rewrites
* redirects
* headers
* webpack customization
* Turbopack configuration
* server-side settings
* anything that could increase runtime resource usage

Do not remove a configuration simply because it exists.

Determine whether it is actually necessary.

---

# 3. Search the entire repository for process spawning

Search for:

* `child_process`
* `spawn`
* `exec`
* `execFile`
* `fork`
* `worker_threads`
* `cluster`
* `Worker`
* `setInterval`
* `setTimeout`
* shell commands
* `npm run`
* `npx`
* `next start`
* `next dev`
* `node `
* `pm2`
* `forever`
* process managers
* background jobs

Determine whether application code is accidentally spawning processes.

If any process-spawning code exists, explain exactly why it exists and whether it is required.

---

# 4. Search for duplicate startup mechanisms

Look for multiple mechanisms that could start the application.

Inspect:

* cPanel configuration
* `.cpanel.yml`
* deployment scripts
* shell scripts
* startup scripts
* package scripts
* PM2 config
* ecosystem files
* cron-related files
* CI/CD configuration
* GitHub Actions
* custom deployment hooks
* Passenger configuration
* LiteSpeed-related configuration
* any Node application configuration

Determine whether the same application can accidentally be started more than once.

---

# 5. Inspect all server-side code

Review:

* `app/api`
* API routes
* server actions
* server components
* database utilities
* authentication
* Prisma
* Supabase
* Resend
* email functionality
* external API integrations
* middleware
* instrumentation
* server utilities

Look for:

* persistent connections
* polling
* timers
* infinite loops
* workers
* repeated initialization
* database connections being created incorrectly
* expensive initialization happening on every request
* background processes
* resources not being closed

---

# 6. Inspect database connection handling

If Prisma, Supabase, PostgreSQL, or another database client is used:

Check whether a new database client is created repeatedly.

For example, identify patterns like:

```ts
new PrismaClient()
```

being created repeatedly in server-side modules.

Use a proper singleton/reuse strategy where appropriate for the hosting environment.

Do not break database functionality.

---

# 7. Inspect authentication

Check:

* Supabase authentication
* admin authentication
* middleware
* session handling
* protected routes

Make sure authentication does not create unnecessary repeated server-side work or persistent processes.

---

# 8. Inspect email functionality

Check Resend/email code.

Make sure email sending happens only when required.

There must not be:

* background email loops
* repeated initialization
* accidental retry loops
* persistent workers
* unnecessary polling

Do not remove email functionality.

---

# 9. Inspect middleware

Middleware can run extremely frequently.

Check whether middleware is unnecessarily executing on:

* static assets
* images
* fonts
* API routes
* Next.js internals
* favicon
* sitemap
* robots.txt
* public files

If the matcher is too broad, optimize it.

The goal is to make middleware run ONLY where it is actually required.

Do not break authentication or security.

---

# 10. Inspect static vs dynamic rendering

Audit every page and determine whether it is unnecessarily dynamic.

Identify:

* unnecessary `force-dynamic`
* unnecessary `no-store`
* unnecessary server-side fetching
* unnecessary request-time computation
* unnecessary dynamic rendering

Where safe, use:

* static rendering
* ISR
* appropriate caching
* request memoization
* server-side caching

Do NOT change pages that genuinely need dynamic behavior.

The website's behavior must remain the same.

---

# PHASE 2 — PRODUCTION BUILD OPTIMIZATION

After identifying the actual issues, optimize the production build.

Consider appropriate Next.js production optimizations such as:

* production-only dependencies
* removing unused dependencies
* reducing unnecessary server-side packages
* minimizing server-side JavaScript
* reducing unnecessary imports
* eliminating duplicate libraries
* optimizing imports
* reducing unnecessary runtime work
* static generation where safe
* caching where safe
* minimizing middleware execution
* avoiding unnecessary server computations

Do NOT blindly install additional packages.

Every new dependency must have a clear reason.

---

# PHASE 3 — CRITICAL PROCESS-LIFECYCLE OPTIMIZATION

This is the most important part.

The hosting provider specifically reported multiple `lsnode` processes and stale processes remaining after the application was stopped.

Investigate the deployment/startup architecture extremely carefully.

The desired production architecture is:

ONE application deployment
→ ONE intended production application instance
→ NO duplicate instances
→ NO development server
→ NO unnecessary worker processes
→ NO stale application processes after restart

Do NOT implement clustering.

Do NOT intentionally create multiple workers.

Do NOT use PM2 cluster mode.

Do NOT create multiple application instances.

Do NOT run `next dev` in production.

Do NOT run multiple `next start` commands.

Do NOT create background Node processes unnecessarily.

Do NOT use shell commands that leave orphaned processes.

---

# PHASE 4 — cPANEL / PASSENGER / HOSTING COMPATIBILITY

This application is hosted on shared hosting using cPanel/Node.js.

The host uses `lsnode` processes.

Therefore, make the application compatible with the hosting provider's expected Node.js application lifecycle.

Investigate whether the current deployment is correctly using the hosting provider's Node.js application mechanism.

Check whether the application needs:

* a specific startup file
* a specific start command
* Passenger-compatible configuration
* a specific `PORT` handling strategy
* proper graceful shutdown
* correct `NODE_ENV=production`

Do NOT invent hosting-specific configuration.

Only change it after inspecting the repository and determining what is actually required.

If the repository itself cannot control a cPanel/Passenger setting, clearly report that separately instead of pretending code can fix it.

---

# PHASE 5 — NEXT.JS STANDALONE OUTPUT

Evaluate whether using Next.js standalone output would be beneficial for this hosting environment.

If appropriate and compatible with the current application, consider:

```js
output: 'standalone'
```

However:

DO NOT enable it automatically.

First determine:

* whether it is compatible with the current hosting setup
* whether cPanel/Passenger can correctly run the standalone server
* whether it would simplify deployment
* whether it would reduce unnecessary runtime/deployment overhead
* whether static files and public assets would still work
* whether the current deployment workflow supports it

If you implement standalone output, make sure the deployment process correctly handles:

* `.next/standalone`
* `.next/static`
* `public`
* required runtime files
* environment variables

Do not leave the deployment in a broken state.

---

# PHASE 6 — MEMORY AND CPU OPTIMIZATION

Audit the application for excessive runtime work.

Look for:

* large libraries imported server-side unnecessarily
* expensive calculations
* repeated API calls
* repeated database queries
* duplicate fetching
* unnecessary polling
* unnecessary timers
* huge JSON processing
* large data loaded into memory
* unbounded arrays/maps/caches
* memory leaks
* unnecessary image processing
* unnecessary server-side rendering

Optimize only where it is safe.

---

# PHASE 7 — CLIENT/SERVER BOUNDARY OPTIMIZATION

Inspect React components.

Determine whether large Client Components can safely become Server Components without changing functionality.

Look for unnecessary:

```tsx
'use client'
```

Do NOT remove `use client` if the component genuinely requires:

* state
* effects
* browser APIs
* event handlers
* client-side interaction

But if a component is unnecessarily client-side, consider moving static/server logic to the server.

The purpose is to reduce unnecessary client JavaScript and server work.

---

# PHASE 8 — API ROUTE OPTIMIZATION

Review every API endpoint.

For each endpoint determine:

* how often it is called
* whether it can be cached
* whether it performs unnecessary database calls
* whether it creates expensive resources
* whether it has unnecessary loops
* whether it performs duplicate queries
* whether it returns excessive data

Optimize without changing API behavior.

---

# PHASE 9 — IMAGE / FONT / STATIC ASSETS

Optimize static assets where appropriate.

Inspect:

* images
* fonts
* icons
* videos
* large static files

Use Next.js image optimization appropriately where beneficial.

Do not introduce expensive runtime image processing if the hosting environment is resource constrained.

Prefer efficient static assets when appropriate.

---

# PHASE 10 — REMOVE UNUSED DEPENDENCIES

Analyze `package.json`.

Identify packages that are:

* unused
* duplicate
* unnecessary in production
* development-only but incorrectly included in runtime

Do NOT uninstall packages automatically.

First verify usage throughout the repository.

For each dependency you propose removing, provide evidence that it is unused.

---

# PHASE 11 — DEPLOYMENT SAFETY

My deployment must remain simple and reliable.

The intended workflow is:

1. Make changes locally.
2. Push to GitHub.
3. Update/pull the latest code on cPanel.
4. Build/restart the application correctly.
5. The new version becomes live.
6. The OLD Node process must not remain running.

If the current deployment workflow can create duplicate processes, fix it.

Do NOT create a deployment workflow that requires me to manually kill random processes every time.

---

# VERY IMPORTANT — DO NOT BREAK OTHER WEBSITES

My hosting account contains other websites, including WordPress websites.

The hosting provider specifically reported that the excessive Node processes from this application consumed the account's process limit and prevented PHP processes for other websites from running.

Therefore:

THIS PROJECT MUST BE OPTIMIZED IN ISOLATION.

Do NOT:

* modify other domains
* modify other WordPress installations
* modify other databases
* modify other applications
* kill processes belonging to other websites
* modify account-wide settings unnecessarily
* add global cron jobs
* add account-wide process managers
* modify unrelated `.htaccess` files
* change unrelated PHP settings
* change unrelated hosting configuration

Any optimization must be scoped to THIS Next.js application.

---

# FUNCTIONALITY PRESERVATION REQUIREMENT

Before changing code, establish a functionality checklist.

The following must continue working exactly as before:

* all pages
* navigation
* responsive design
* desktop UI
* mobile UI
* animations
* forms
* authentication
* login
* admin functionality
* dashboard
* database operations
* contact form
* email notifications
* API routes
* SEO
* metadata
* sitemap
* robots.txt
* images
* fonts
* external API integrations
* environment variables
* error handling
* loading states
* redirects
* protected routes

Do not sacrifice functionality just to lower resource usage.

---

# IMPORTANT: DO NOT GUESS

Before making changes:

1. Inspect the entire repository.
2. Identify the likely causes.
3. Rank each cause by severity.
4. Explain which issues are likely responsible for the huge number of `lsnode` processes.
5. Explain which issues are ordinary optimization opportunities but are NOT responsible for the process explosion.
6. Only then implement changes.

Do not make random performance changes.

---

# IMPLEMENTATION RULE

After the audit, implement the safest high-impact fixes.

Prioritize:

1. Eliminating duplicate application instances.
2. Preventing stale/orphaned Node processes.
3. Ensuring only a single intended production instance runs.
4. Preventing development/watch processes in production.
5. Fixing startup/restart/deployment behavior.
6. Removing unnecessary child-process spawning.
7. Reducing unnecessary server-side work.
8. Optimizing rendering/caching.
9. Reducing unnecessary dependencies.
10. General performance optimization.

---

# VALIDATION AFTER CHANGES

After implementing changes, perform a production build.

Run appropriate checks such as:

```bash
npm run build
```

Then verify that the production application can start correctly using the intended production command.

Check for:

* build errors
* TypeScript errors
* ESLint errors if applicable
* missing environment variables
* missing modules
* broken routes
* broken API endpoints
* authentication failures
* database failures
* email failures
* incorrect static assets
* broken images
* broken metadata
* broken sitemap
* broken robots.txt

If possible, inspect the process tree during local production execution.

The goal is to verify that the application does not itself intentionally create unnecessary Node child processes.

---

# DO NOT DO THESE THINGS

Do NOT:

* downgrade Next.js just for the sake of optimization
* downgrade Node.js without evidence
* remove features
* remove authentication
* remove database functionality
* remove email functionality
* remove animations
* remove API routes
* remove pages
* disable security
* disable middleware blindly
* disable caching blindly
* use PM2 cluster mode
* create multiple Node workers
* run development mode in production
* add unnecessary packages
* replace Next.js with another framework
* rewrite the whole project
* change the UI unnecessarily
* make account-wide hosting changes
* kill unrelated processes
* hide errors
* make changes just to make benchmark numbers look better

---

# REQUIRED OUTPUT FROM YOU

Before editing, provide a concise but technically detailed:

## AUDIT REPORT

Include:

### A. Root Cause

What is most likely causing the excessive `lsnode` processes?

### B. Evidence

Show exactly which files/configurations support your conclusion.

### C. Process Lifecycle Problems

Identify anything that could create duplicate or stale processes.

### D. Resource Problems

Identify CPU/RAM/process-intensive areas.

### E. Safe Optimizations

List changes that can be made without changing functionality.

### F. Risky Optimizations

List changes that could affect functionality and therefore should NOT be made automatically.

### G. Hosting-Side Limitations

Clearly distinguish what can be fixed in code from what may require cPanel/TheBeeHost configuration.

---

# THEN IMPLEMENT

After the audit, implement the safe high-impact fixes.

Keep changes minimal, targeted, and production-safe.

Do not rewrite unrelated code.

---

# AFTER IMPLEMENTATION

Provide a final report containing:

## 1. Files Changed

List every file modified.

## 2. What Changed

Explain each change.

## 3. Why It Helps

Explain how each change reduces:

* process count
* CPU usage
* memory usage
* duplicate instances
* server-side workload

## 4. Functionality Verification

Confirm what was tested.

## 5. Build Verification

Confirm whether:

```bash
npm run build
```

passes successfully.

## 6. Production Start Verification

Confirm the exact production start command.

## 7. Process Lifecycle

Explain why the new setup should not create duplicate/stale Node processes.

## 8. Remaining Hosting Configuration

If there is anything that MUST be changed in cPanel/TheBeeHost rather than in the code, clearly identify it.

## 9. Deployment Instructions

Give me the exact final production deployment procedure.

It should be as simple as possible.

---

# FINAL SUCCESS CRITERIA

The task is successful only if:

* The website behaves the same for users.
* No functionality has been intentionally removed.
* Production uses a proper production Next.js server.
* The application does not intentionally spawn unnecessary child processes.
* Duplicate application instances are prevented.
* Stale application processes are prevented as far as the application/deployment configuration can control.
* CPU/RAM usage is reduced where safely possible.
* Process count is dramatically lower than the reported state.
* Other websites on the same hosting account are protected from this application's resource consumption.
* The project builds successfully.
* The production startup process is clearly documented.
* Any remaining cPanel/hosting-level issue is clearly identified.

MOST IMPORTANT:

DO NOT JUST "OPTIMIZE THE CODE."

The reported problem is a PROCESS LIMIT issue.

Treat this primarily as a **Next.js production process lifecycle + deployment + hosting resource optimization problem**, and secondarily as a general application performance problem.

FIRST AUDIT.
THEN EXPLAIN.
THEN IMPLEMENT.
THEN TEST.
THEN REPORT.
