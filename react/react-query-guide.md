# React Query (TanStack Query) - Complete Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Core Concepts](#core-concepts)
4. [Basic Setup](#basic-setup)
5. [useQuery Hook](#usequery-hook)
6. [useMutation Hook](#usemutation-hook)
7. [Query Keys](#query-keys)
8. [Caching](#caching)
9. [Error Handling](#error-handling)
10. [Loading States](#loading-states)
11. [Background Refetching](#background-refetching)
12. [Optimistic Updates](#optimistic-updates)
13. [Infinite Queries](#infinite-queries)
14. [Query Invalidation](#query-invalidation)
15. [DevTools](#devtools)
16. [Best Practices](#best-practices)
17. [Advanced Features](#advanced-features)

## Introduction

React Query (now TanStack Query) is a data-fetching library that provides:

- **Intelligent Caching**: Automatic caching with smart cache invalidation
- **Background Updates**: Keeps data fresh without user intervention
- **Optimistic Updates**: Update UI immediately for better UX
- **Error Handling**: Built-in error boundaries and retry logic
- **Loading States**: Comprehensive loading state management
- **DevTools**: Powerful debugging tools

### Why Use React Query?

- Eliminates boilerplate code for data fetching
- Provides excellent user experience with background updates
- Handles complex caching scenarios automatically
- Reduces application state complexity
- Improves performance with intelligent request deduplication

## Installation

```bash
# npm
npm install @tanstack/react-query

# yarn
yarn add @tanstack/react-query

# pnpm
pnpm add @tanstack/react-query
```

For DevTools (optional but recommended):
```bash
npm install @tanstack/react-query-devtools
```

## Core Concepts

### Server State vs Client State

**Server State:**
- Persisted remotely (database, API)
- Asynchronous APIs for fetching/updating
- Shared ownership (other users can modify it)
- Can become "stale" over time

**Client State:**
- Persisted in your app's memory
- Synchronous access
- Owned by your application
- Always up-to-date

React Query focuses on managing server state efficiently.

### Key Features

1. **Caching**: Store fetched data to avoid repeated requests
2. **Synchronization**: Keep cached data in sync with server
3. **Background Updates**: Fetch fresh data without blocking UI
4. **Stale Data**: Serve cached data while fetching fresh data
5. **Request Deduplication**: Prevent duplicate requests

## Basic Setup

### 1. Create Query Client

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})
```

### 2. Wrap Your App

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourAppComponents />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## useQuery Hook

The `useQuery` hook is used for fetching data.

### Basic Usage

```javascript
import { useQuery } from '@tanstack/react-query'

function Posts() {
  const {
    data,
    isLoading,
    error,
    isError,
    isSuccess,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(res => res.json())
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <div>
      {data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

### Advanced Options

```javascript
const { data } = useQuery({
  queryKey: ['posts', page, filters],
  queryFn: ({ queryKey }) => {
    const [_key, page, filters] = queryKey
    return fetchPosts(page, filters)
  },
  enabled: !!user, // Only run if user exists
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: (failureCount, error) => {
    if (error.status === 404) return false
    return failureCount < 3
  },
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchInterval: 30000, // Refetch every 30 seconds
  select: data => data?.posts || [], // Transform data
  placeholderData: [], // Show while loading
  keepPreviousData: true, // Keep previous data during refetch
})
```

## useMutation Hook

The `useMutation` hook is used for creating, updating, or deleting data.

### Basic Usage

```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreatePost() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      }).then(res => res.json())
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => {
      console.error('Error creating post:', error)
    }
  })

  return (
    <button
      onClick={() => {
        mutation.mutate({
          title: 'New Post',
          content: 'This is a new post'
        })
      }}
      disabled={mutation.isLoading}
    >
      {mutation.isLoading ? 'Creating...' : 'Create Post'}
    </button>
  )
}
```

### Advanced Mutations

```javascript
const updatePostMutation = useMutation({
  mutationFn: ({ id, ...updates }) => 
    fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).then(res => res.json()),
  
  onMutate: async ({ id, ...updates }) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['posts', id] })

    // Snapshot previous value
    const previousPost = queryClient.getQueryData(['posts', id])

    // Optimistically update
    queryClient.setQueryData(['posts', id], old => ({
      ...old,
      ...updates
    }))

    return { previousPost }
  },
  
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(
      ['posts', variables.id],
      context.previousPost
    )
  },
  
  onSettled: (data, error, variables) => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['posts', variables.id] })
  }
})
```

## Query Keys

Query keys are used to identify and cache queries.

### Simple Keys

```javascript
// String key
useQuery({ queryKey: ['posts'], queryFn: fetchPosts })

// Array key
useQuery({ queryKey: ['posts', 'list'], queryFn: fetchPosts })
```

### Dynamic Keys

```javascript
// With parameters
useQuery({
  queryKey: ['posts', postId],
  queryFn: () => fetchPost(postId)
})

// With complex parameters
useQuery({
  queryKey: ['posts', { page, limit, filters }],
  queryFn: ({ queryKey }) => {
    const [_key, params] = queryKey
    return fetchPosts(params)
  }
})
```

### Key Factories

```javascript
// Create consistent keys
const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: string) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
}

// Usage
useQuery({
  queryKey: postKeys.detail(postId),
  queryFn: () => fetchPost(postId)
})
```

## Caching

### Cache Configuration

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time until data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Time until inactive data is garbage collected
      cacheTime: 10 * 60 * 1000, // 10 minutes (renamed to gcTime in v5)
    },
  },
})
```

### Manual Cache Management

```javascript
// Set cache data
queryClient.setQueryData(['posts', postId], newPost)

// Get cache data
const post = queryClient.getQueryData(['posts', postId])

// Remove from cache
queryClient.removeQueries({ queryKey: ['posts', postId] })

// Clear all cache
queryClient.clear()
```

### Cache Updates

```javascript
// Update existing cache
queryClient.setQueryData(['posts'], (oldPosts) => {
  return oldPosts.map(post => 
    post.id === updatedPost.id ? updatedPost : post
  )
})

// Add to existing list
queryClient.setQueryData(['posts'], (oldPosts) => {
  return [newPost, ...oldPosts]
})
```

## Error Handling

### Global Error Handling

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 3
      },
      throwOnError: true, // Throw errors to error boundaries
    },
    mutations: {
      throwOnError: true,
    },
  },
})
```

### Component Level Error Handling

```javascript
function Posts() {
  const { data, error, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    onError: (error) => {
      console.error('Failed to fetch posts:', error)
      // Log to error reporting service
    }
  })

  if (isError) {
    return (
      <div className="error">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Try Again</button>
      </div>
    )
  }

  // ... rest of component
}
```

### Error Boundaries

```javascript
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => queryClient.resetQueries()}
    >
      <Posts />
    </ErrorBoundary>
  )
}
```

## Loading States

### Query States

```javascript
function Posts() {
  const { 
    data, 
    isLoading,      // Initial loading (no cached data)
    isFetching,     // Any fetching (including background)
    isRefetching,   // Refetching with cached data
    isLoadingError, // Error during initial load
    isRefetchError, // Error during refetch
    status          // 'idle' | 'loading' | 'error' | 'success'
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  })

  // Show skeleton during initial load
  if (isLoading) return <PostsSkeleton />
  
  // Show error state
  if (isLoadingError) return <ErrorMessage />

  return (
    <div>
      {/* Show loading indicator during background fetch */}
      {isFetching && <LoadingSpinner />}
      
      <PostsList posts={data} />
    </div>
  )
}
```

### Suspense Mode

```javascript
import { Suspense } from 'react'

// Enable suspense for queries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
})

function Posts() {
  // No loading states needed - Suspense handles it
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  })

  return <PostsList posts={data} />
}

function App() {
  return (
    <Suspense fallback={<PostsSkeleton />}>
      <Posts />
    </Suspense>
  )
}
```

## Background Refetching

### Automatic Refetching

```javascript
useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  
  // Refetch when window regains focus
  refetchOnWindowFocus: true,
  
  // Refetch when coming back online
  refetchOnReconnect: true,
  
  // Refetch when component mounts
  refetchOnMount: true,
  
  // Interval refetching
  refetchInterval: 30000, // 30 seconds
  
  // Only refetch interval when window has focus
  refetchIntervalInBackground: false,
})
```

### Manual Refetching

```javascript
function Posts() {
  const { data, refetch, isRefetching } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  })

  return (
    <div>
      <button 
        onClick={() => refetch()}
        disabled={isRefetching}
      >
        {isRefetching ? 'Refreshing...' : 'Refresh'}
      </button>
      
      <PostsList posts={data} />
    </div>
  )
}
```

## Optimistic Updates

### Basic Optimistic Update

```javascript
const updatePostMutation = useMutation({
  mutationFn: updatePost,
  
  onMutate: async (updatedPost) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries({ queryKey: ['posts'] })

    // Get current data
    const previousPosts = queryClient.getQueryData(['posts'])

    // Optimistically update
    queryClient.setQueryData(['posts'], (old) =>
      old.map(post => 
        post.id === updatedPost.id 
          ? { ...post, ...updatedPost }
          : post
      )
    )

    return { previousPosts }
  },
  
  onError: (err, updatedPost, context) => {
    // Rollback on error
    queryClient.setQueryData(['posts'], context.previousPosts)
  },
  
  onSettled: () => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }
})
```

## Infinite Queries

### Basic Infinite Query

```javascript
import { useInfiniteQuery } from '@tanstack/react-query'

function Posts() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined
    },
    getPreviousPageParam: (firstPage, pages) => {
      return firstPage.prevCursor
    }
  })

  if (status === 'loading') return <p>Loading...</p>
  if (status === 'error') return <p>Error: {error.message}</p>

  return (
    <div>
      {data.pages.map((group, i) => (
        <div key={i}>
          {group.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      ))}
      
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'Nothing more to load'}
      </button>
    </div>
  )
}
```

## Query Invalidation

### Invalidate Queries

```javascript
// Invalidate all queries
queryClient.invalidateQueries()

// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: ['posts'] })

// Invalidate with filters
queryClient.invalidateQueries({
  queryKey: ['posts'],
  exact: true, // Only exact matches
  refetchType: 'active', // Only active queries
})

// Invalidate by predicate
queryClient.invalidateQueries({
  predicate: query => 
    query.queryKey[0] === 'posts' && query.queryKey[1]?.status === 'draft'
})
```

### Reset Queries

```javascript
// Reset to initial state
queryClient.resetQueries({ queryKey: ['posts'] })

// Reset with new data
queryClient.resetQueries({
  queryKey: ['posts'],
  exact: true
})
```

## DevTools

### Setup

```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {/* Only include in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
```

### Features

- View all queries and their states
- Inspect query data and errors
- Trigger manual refetches
- View cache contents
- Monitor network requests
- Debug performance issues

## Best Practices

### 1. Use Query Key Factories

```javascript
const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
}
```

### 2. Separate Data Fetching Logic

```javascript
// api/posts.js
export const postApi = {
  getAll: (params) => fetch('/api/posts', { params }).then(res => res.json()),
  getById: (id) => fetch(`/api/posts/${id}`).then(res => res.json()),
  create: (data) => fetch('/api/posts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetch(`/api/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetch(`/api/posts/${id}`, { method: 'DELETE' }),
}

// hooks/usePosts.js
export const usePosts = (filters) => {
  return useQuery({
    queryKey: postKeys.list(filters),
    queryFn: () => postApi.getAll(filters)
  })
}
```

### 3. Handle Loading States Gracefully

```javascript
function Posts() {
  const { data, isLoading, error } = usePosts()

  if (isLoading) return <PostsSkeleton />
  if (error) return <ErrorState error={error} />
  if (!data?.length) return <EmptyState />

  return <PostsList posts={data} />
}
```

### 4. Use Proper Error Boundaries

```javascript
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
```

### 5. Configure Sensible Defaults

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        if (error.status === 404) return false
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
  },
})
```

## Advanced Features

### Dependent Queries

```javascript
function UserPosts({ userId }) {
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  })

  const postsQuery = useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userQuery.data?.id, // Only run if user exists
  })

  // ...
}
```

### Parallel Queries

```javascript
function Dashboard() {
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser
  })

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  })

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications
  })

  // All queries run in parallel
  if (userQuery.isLoading || postsQuery.isLoading || notificationsQuery.isLoading) {
    return <Loading />
  }

  // ...
}
```

### Query Filters

```javascript
// Remove all inactive queries
queryClient.removeQueries({
  type: 'inactive'
})

// Invalidate all post queries
queryClient.invalidateQueries({
  queryKey: ['posts']
})

// Cancel all outgoing queries
await queryClient.cancelQueries({
  queryKey: ['posts']
})
```

### Custom Query Client

```javascript
class CustomQueryClient extends QueryClient {
  constructor() {
    super({
      defaultOptions: {
        queries: {
          retry: (failureCount, error) => {
            // Custom retry logic
            return this.shouldRetry(failureCount, error)
          }
        }
      }
    })
  }

  shouldRetry(failureCount, error) {
    // Custom logic here
    return failureCount < 3 && error.status >= 500
  }
}
```

## Conclusion

React Query is a powerful tool that simplifies data fetching and state management in React applications. By understanding its core concepts and following best practices, you can build more responsive and maintainable applications with excellent user experiences.

Key takeaways:
- Use React Query for server state management
- Leverage caching and background updates for better UX
- Handle loading and error states properly
- Use optimistic updates for immediate feedback
- Configure sensible defaults for your application
- Use DevTools for debugging and optimization

For more information, visit the [official TanStack Query documentation](https://tanstack.com/query/latest).