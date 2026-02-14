# Agent Workflow: Fuel-EU Platform Implementation

This document details the iterative process, prompts, and corrections made by the Gemini CLI agent during the development of the Fuel-EU Platform.

## Summary of Tasks
1.  **Compare Tab**: Implementation of compliance intensity comparison vs. a fixed target (89.3368 g/MJ).
2.  **Banking Tab**: Implementation of surplus banking and application logic with KPI tracking.
3.  **Pooling Tab**: Implementation of multi-vessel compliance pooling with greedy balancing.
4.  **Frontend Testing**: Setup of Vitest and RTL with specific test cases for business logic.

---

## Prompts & Outputs

### 1. Compare Tab Implementation
**Prompt:**
"Compare Tab Implementation. Requirements: Fetch /routes/comparison. Target intensity fixed 89.3368. Table baseline vs comparison. percentDiff formula. compliant flag. chart. Use Recharts."

**Output Snippet:**
```typescript
const chartData = useMemo(() => {
  const all = data.baseline ? [data.baseline, ...data.others] : data.others;
  return all.map(r => ({
    name: r.name,
    intensity: r.ghgIntensity,
    isBaseline: r.isBaseline,
    diff: ((r.ghgIntensity - TARGET_INTENSITY) / TARGET_INTENSITY) * 100
  }));
}, [data]);
```

**Correction:**
The initial implementation lacked a unique identifier for `Cell` mapping in the Recharts `BarChart`, which could lead to rendering issues. I updated the `useMemo` to include the `id` from the backend model.

---

### 2. Banking Tab Logic
**Prompt:**
"Banking Tab Implementation. Requirements: GET /compliance/cb?year. POST /banking/bank. POST /banking/apply. show KPIs cb_before, applied, cb_after. disable if cb <= 0"

**Correction:**
I initially forgot that the backend `BankingController` used `/banking/records` for GET, not `/compliance/cb` (which is for current balance). I had to add `getBankingRecord` to `IApiPort` and `AxiosApiAdapter` after inspecting the backend source code.

---

## Hallucinations & Corrections

### The "Missing Export" Hallucination
**Observed Error:**
`Uncaught SyntaxError: The requested module '/src/core/domain/types.ts' does not provide an export named 'BankingRecord'`

**What Happened:**
I assumed standard ESM imports `import { Interface } from './file'` would work. However, in a Vite/TypeScript environment using ESM, importing an interface that is erased at runtime can sometimes cause the browser to look for a physical export that doesn't exist.

**Correction:**
Changed all interface-only imports to `import type { ... }`.
```typescript
// From this:
import { Route } from '../domain/types';
// To this:
import type { Route } from '../domain/types';
```

### The "IApiPort" Export Hallucination
**Observed Error:**
`The requested module '...IApiPort.ts' does not provide an export named 'IApiPort'`

**Correction:**
Applied the same `import type` fix to the Service layers. This is a common pitfall when using Clean Architecture with TypeScript interfaces in an ESM-first environment (like Vite).

---

## Lessons Learned

1.  **Strict Typing in ESM**: Always prefer `import type` for interfaces in Vite projects to avoid runtime "missing export" errors.
2.  **Service Discovery**: Before implementing a frontend service, always grep the backend `Controller` and `Service` files to verify exact endpoint paths (e.g., `/banking/records` vs `/banking`).
3.  **Component State**: For complex tabs like `PoolingTab`, using `useMemo` for derived state (like `poolSummary`) is cleaner than multiple `useEffect` hooks and ensures the "Create Pool" button disables instantly when selection changes.

## Tool Usage Log
- **grep_search**: Used extensively to find where `types.ts` was used to bulk-fix imports.
- **run_shell_command**: Used for `npm run lint` and `npm test` to verify every change.
- **replace**: Used for surgical updates to `IApiPort` to avoid rewriting the entire file and losing context.
