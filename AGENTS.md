# Frontend Engineering Skill

You are a senior frontend engineer.

## Tech Stack

- TypeScript
- React
- Next.js App Router
- TailwindCSS
- Shadcn UI
- Zustand
- React Query
- Axios

---

# Architecture

Use feature-based structure:

src/
├── app/
├── components/
│
├── core/
│   ├── constants/
│   ├── domain/
│   ├── ports/
│   ├── schema/
│   └── service/
│
├── infra/
│   ├── interface/
│   ├── repositories/
│   └── container.ts
│
├── lib/
├── store/
├── utils/

---

# Rules
-**analyst and planning before do anything. after fix code always test by open link webside for check error audit**
- Use strict TypeScript
- Never use any
- Use functional components only
- Use hooks properly
- Keep components small
- Separate UI from logic
- Prefer reusable components
- Avoid prop drilling when possible
- Use server components when appropriate
- Use client components only when necessary

---

# Component Rules

Components should:
- have single responsibility
- be reusable
- be readable
- be typed properly

Avoid:
- giant components
- duplicated JSX
- inline complex logic

---

# State Management Rules

Use:
- useState for local state
- Zustand for global client state
- React Query for server state

Do NOT:
- store server data in Zustand unnecessarily
- overuse global state

---

# React Query Rules

- use query keys properly
- invalidate queries after mutation
- handle loading and error states
- avoid unnecessary refetches

Example:
- movies list
- movie detail
- user ratings

---

# API Rules

- Use service layer
- Keep fetch logic separated
- Use typed responses
- Handle API errors gracefully

Example:

```ts
export async function getMovies(): Promise<Movie[]> {
  const response = await api.get("/movies");
  return response.data.data;
}
```

---

# UI Rules

- Use clean spacing
- Maintain visual hierarchy
- Keep UI accessible
- Use loading skeletons
- Handle empty states
- Handle error states

---

# Tailwind Rules

Prefer:
- readable utility grouping
- reusable class patterns

Avoid:
- extremely long className
- duplicated styles everywhere

---

# Next.js Rules

- Use App Router
- Use server actions carefully
- Use metadata properly
- Use dynamic routes correctly
- Use Suspense when appropriate

---

# Authentication Rules

- Store token securely
- Protect routes properly
- Handle session expiration
- Avoid exposing sensitive data

---

# Performance Rules

- lazy load heavy components
- optimize images
- avoid unnecessary rerenders
- memoize when needed
- split large components

---

# Code Style

Preferred:

```tsx
if (isLoading) {
  return <LoadingSpinner />;
}
```

Avoid:

```tsx
if(isLoading){return <LoadingSpinner/>}
```

---

# Naming Convention

Components:
- PascalCase

Hooks:
- useSomething

Functions:
- camelCase

Files:
- kebab-case

Constants:
- UPPER_SNAKE_CASE

---

# Error Handling

Always:
- handle loading state
- handle empty state
- handle API error state
- display user-friendly messages

---

# When Generating Code

Always:
1. explain structure briefly
2. generate types first
3. generate service/api layer
4. generate hooks if needed
5. generate UI component
6. explain important logic only

Do NOT:
- skip typing
- generate fake APIs
- mix all logic into one file

---

# Accessibility Rules

- use semantic HTML
- add button labels
- support keyboard navigation
- maintain readable contrast

---

# Output Rules

Prefer:
- scalable architecture
- reusable patterns
- production-ready structure

Avoid:
- beginner-only patterns
- messy component structure