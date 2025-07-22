# Redux Toolkit Complete Guide 2025

## Table of Contents
1. [Introduction to Redux Toolkit](#introduction-to-redux-toolkit)
2. [Installation and Setup](#installation-and-setup)
3. [Core Concepts](#core-concepts)
4. [configureStore](#configurestore)
5. [createSlice](#createslice)
6. [createAsyncThunk](#createasyncthunk)
7. [createEntityAdapter](#createentityadapter)
8. [RTK Query](#rtk-query)
9. [Advanced Patterns](#advanced-patterns)
10. [Best Practices](#best-practices)
11. [Real-World Examples](#real-world-examples)
12. [TypeScript Integration](#typescript-integration)
13. [Testing](#testing)
14. [Performance Optimization](#performance-optimization)

---

## Introduction to Redux Toolkit

Redux Toolkit (RTK) is the **official, opinionated, batteries-included toolset** for efficient Redux development. It was created to solve the most common Redux pain points:

- **Too much boilerplate code**
- **Complex setup process**
- **Accidental state mutations**
- **Verbose action creators and reducers**

### Why Redux Toolkit?

```javascript
// Traditional Redux (verbose and error-prone)
// Actions
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';

const addTodo = (text) => ({
  type: ADD_TODO,
  payload: {
    id: Date.now(),
    text,
    completed: false
  }
});

const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: id
});

// Reducer
const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.payload];
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case DELETE_TODO:
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
};
```

```javascript
// Redux Toolkit (concise and safe)
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      });
    },
    toggleTodo: (state, action) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      return state.filter(todo => todo.id !== action.payload);
    }
  }
});

export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

### Key Benefits

1. **Reduced Boilerplate**: 70% less code compared to traditional Redux
2. **Immutability Built-in**: Uses Immer under the hood for safe mutations
3. **DevTools Integration**: Automatic Redux DevTools setup
4. **TypeScript Support**: Excellent TypeScript integration
5. **Performance Optimized**: Built-in optimizations and best practices

---

## Installation and Setup

### Basic Installation

```bash
# NPM
npm install @reduxjs/toolkit react-redux

# Yarn
yarn add @reduxjs/toolkit react-redux

# PNPM
pnpm add @reduxjs/toolkit react-redux
```

### Create React App with Redux Template

```bash
# Create new project with Redux Toolkit template
npx create-react-app my-app --template redux

# Or with TypeScript
npx create-react-app my-app --template redux-typescript
```

### Vite Setup

```bash
# Create Vite project
npm create vite@latest my-redux-app --template react

# Install Redux Toolkit
cd my-redux-app
npm install @reduxjs/toolkit react-redux
```

### Basic Project Structure

```
src/
├── app/
│   └── store.js           # Store configuration
├── features/
│   ├── todos/
│   │   ├── todosSlice.js  # Todo slice
│   │   └── TodosList.jsx  # Todo components
│   └── users/
│       ├── usersSlice.js  # User slice
│       └── usersAPI.js    # API calls
├── components/            # Shared components
├── hooks/                 # Custom hooks
└── App.jsx
```

---

## Core Concepts

### 1. Store - Single Source of Truth

```javascript
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    users: usersReducer,
  },
  // Middleware and DevTools are configured automatically
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 2. Slices - Combined Reducers and Actions

```javascript
// features/todos/todosSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  filter: 'all', // 'all' | 'active' | 'completed'
  loading: false,
  error: null
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Simple reducer
    addTodo: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: (text) => ({
        payload: {
          id: nanoid(),
          text,
          completed: false,
          createdAt: new Date().toISOString()
        }
      })
    },
    
    // Direct mutation (safe with Immer)
    toggleTodo: (state, action) => {
      const todo = state.items.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    
    // Returning new state
    deleteTodo: (state, action) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
    },
    
    // Multiple state updates
    clearCompleted: (state) => {
      state.items = state.items.filter(todo => !todo.completed);
    },
    
    // Update filter
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    
    // Bulk operations
    toggleAll: (state, action) => {
      const allCompleted = action.payload;
      state.items.forEach(todo => {
        todo.completed = allCompleted;
      });
    }
  }
});

export const { 
  addTodo, 
  toggleTodo, 
  deleteTodo, 
  clearCompleted, 
  setFilter, 
  toggleAll 
} = todosSlice.actions;

export default todosSlice.reducer;

// Selectors
export const selectTodos = (state) => state.todos.items;
export const selectTodosFilter = (state) => state.todos.filter;
export const selectFilteredTodos = (state) => {
  const todos = selectTodos(state);
  const filter = selectTodosFilter(state);
  
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
```

---

## configureStore

`configureStore` is the standard way to create a Redux store with Redux Toolkit. It provides good defaults and eliminates most boilerplate.

### Basic Configuration

```javascript
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    users: usersReducer,
  }
});

// Automatically includes:
// - redux-thunk middleware
// - Redux DevTools Extension
// - Immutability and serializability checks in development
```

### Advanced Configuration

```javascript
import { 
  configureStore, 
  getDefaultMiddleware,
  isRejectedWithValue 
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import logger from 'redux-logger';

// Custom error handling middleware
const rtkQueryErrorLogger = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.warn('RTK Query Error:', action.payload);
    // Send to error reporting service
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    users: usersReducer,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
      immutableCheck: {
        ignoredPaths: ['register'],
      },
    })
    .concat(logger) // Add redux-logger
    .concat(rtkQueryErrorLogger) // Custom middleware
    .concat(apiSlice.middleware), // RTK Query middleware
  
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'My App',
    trace: true,
    traceLimit: 25,
  },
  
  preloadedState: {
    todos: {
      items: JSON.parse(localStorage.getItem('todos') || '[]'),
      filter: 'all',
      loading: false,
      error: null
    }
  },
});

// Enable listener behavior for RTK Query
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Environment-Specific Configuration

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import rootReducer from './rootReducer';

const isDevelopment = process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: !isDevelopment, // Disable in production for performance
      immutableCheck: !isDevelopment,
    });

    if (isDevelopment) {
      middleware.concat(createLogger({
        collapsed: true,
        diff: true,
      }));
    }

    return middleware;
  },
  devTools: isDevelopment,
});

// Hot module replacement in development
if (isDevelopment && module.hot) {
  module.hot.accept('./rootReducer', () => {
    store.replaceReducer(require('./rootReducer').default);
  });
}
```

---

## createSlice

`createSlice` is the core API for creating Redux logic. It generates action creators and reducers automatically.

### Basic Slice

```javascript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  step: number;
}

const initialState: CounterState = {
  value: 0,
  step: 1,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += state.step;
    },
    decrement: (state) => {
      state.value -= state.step;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    reset: (state) => {
      state.value = 0;
      state.step = 1;
    },
  },
});

export const { increment, decrement, incrementByAmount, setStep, reset } = counterSlice.actions;
export default counterSlice.reducer;
```

### Advanced Slice with Prepare Functions

```javascript
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  reactions: {
    thumbsUp: number;
    hooray: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
}

interface PostsState {
  posts: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.posts.push(action.payload);
      },
      prepare: (title: string, content: string, author: string) => ({
        payload: {
          id: nanoid(),
          title,
          content,
          author,
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            eyes: 0,
          },
        },
      }),
    },
    
    updatePost: (state, action: PayloadAction<{ id: string; title: string; content: string }>) => {
      const { id, title, content } = action.payload;
      const existingPost = state.posts.find(post => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    
    reactionAdded: (state, action: PayloadAction<{ postId: string; reaction: keyof Post['reactions'] }>) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find(post => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
});

export const { addPost, updatePost, deletePost, reactionAdded } = postsSlice.actions;
export default postsSlice.reducer;

// Selectors
export const selectAllPosts = (state: RootState) => state.posts.posts;
export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find(post => post.id === postId);
export const selectPostsByUser = (state: RootState, userId: string) =>
  state.posts.posts.filter(post => post.author === userId);
```

### Slice with Extra Reducers

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await fetch('/api/posts');
    return response.json();
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Regular reducers
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch posts';
      });
  },
});
```

---

## createAsyncThunk

`createAsyncThunk` handles asynchronous logic and automatically generates action creators for pending, fulfilled, and rejected states.

### Basic Async Thunk

```javascript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async thunk for fetching user data
export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  }
);

interface User {
  id: string;
  name: string;
  email: string;
}

interface UsersState {
  entities: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  entities: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.entities.push(action.payload);
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      });
  },
});
```

### Advanced Async Thunk with Error Handling

```javascript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Custom error type
interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Async thunk with custom error handling
export const createPost = createAsyncThunk<
  Post, // Return type
  { title: string; content: string }, // Argument type
  { rejectValue: ApiError } // ThunkAPI type
>(
  'posts/createPost',
  async (postData, { rejectWithValue, getState }) => {
    try {
      // Access state if needed
      const state = getState() as RootState;
      const userId = state.auth.user?.id;
      
      if (!userId) {
        return rejectWithValue({
          message: 'User not authenticated',
          status: 401,
          code: 'UNAUTHORIZED'
        });
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}`
        },
        body: JSON.stringify({ ...postData, authorId: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue({
          message: errorData.message || 'Failed to create post',
          status: response.status,
          code: errorData.code
        });
      }

      return response.json();
    } catch (error) {
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
        code: 'NETWORK_ERROR'
      });
    }
  }
);

// Usage in slice
const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create post';
      });
  },
});
```

### Conditional Dispatch and Cancellation

```javascript
// Async thunk with condition and cancellation
export const fetchUserData = createAsyncThunk(
  'user/fetchData',
  async (userId: string, { getState, signal }) => {
    const state = getState() as RootState;
    
    // Check if we already have the data
    if (state.users.entities[userId]) {
      // Skip the request if we already have the data
      return state.users.entities[userId];
    }

    try {
      const response = await fetch(`/api/users/${userId}`, { signal });
      
      // Check if the request was cancelled
      if (signal.aborted) {
        throw new Error('Request was cancelled');
      }

      return response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }
      throw error;
    }
  },
  {
    condition: (userId, { getState }) => {
      // Don't fetch if already loading or if we have the data
      const state = getState() as RootState;
      const { loading, entities } = state.users;
      
      if (loading || entities[userId]) {
        return false; // Skip the request
      }
    },
  }
);

// Usage with cancellation
function UserProfile({ userId }) {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Dispatch returns a promise with an abort method
    const promise = dispatch(fetchUserData(userId));
    
    return () => {
      // Cancel the request if component unmounts
      promise.abort();
    };
  }, [userId, dispatch]);
  
  // Component rendering logic...
}
```

### Multiple Async Operations

```javascript
// Complex async operations with multiple steps
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    userData: { name: string; email: string; avatar?: File },
    { dispatch, rejectWithValue }
  ) => {
    try {
      let avatarUrl = '';
      
      // Step 1: Upload avatar if provided
      if (userData.avatar) {
        const uploadResult = await dispatch(uploadAvatar(userData.avatar)).unwrap();
        avatarUrl = uploadResult.url;
      }
      
      // Step 2: Update user profile
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          avatarUrl,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedUser = await response.json();
      
      // Step 3: Update local cache
      dispatch(updateUserInCache(updatedUser));
      
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper async thunk for avatar upload
export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    return response.json();
  }
);
```

---

## createEntityAdapter

`createEntityAdapter` provides a standardized way to store and update normalized data.

### Basic Entity Adapter

```javascript
import { 
  createEntityAdapter, 
  createSlice, 
  createAsyncThunk 
} from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'away';
}

// Create entity adapter
const usersAdapter = createEntityAdapter<User>({
  // Sort users by name
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// Get initial state with normalized structure
const initialState = usersAdapter.getInitialState({
  loading: false,
  error: null,
});

// Async thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('/api/users');
  return response.json();
});

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: Omit<User, 'id'>) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Use adapter methods for CRUD operations
    userAdded: usersAdapter.addOne,
    userUpdated: usersAdapter.updateOne,
    userRemoved: usersAdapter.removeOne,
    usersReceived: usersAdapter.setAll,
    
    // Custom reducer with adapter methods
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      usersAdapter.updateOne(state, {
        id: userId,
        changes: { status }
      });
    },
    
    // Bulk operations
    removeSelectedUsers: (state, action) => {
      usersAdapter.removeMany(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        usersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addUser.fulfilled, usersAdapter.addOne);
  },
});

export const {
  userAdded,
  userUpdated,
  userRemoved,
  usersReceived,
  updateUserStatus,
  removeSelectedUsers,
} = usersSlice.actions;

export default usersSlice.reducer;

// Generate selectors
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectTotal: selectTotalUsers,
} = usersAdapter.getSelectors((state: RootState) => state.users);

// Custom selectors
export const selectOnlineUsers = createSelector(
  selectAllUsers,
  (users) => users.filter(user => user.status === 'online')
);

export const selectUsersByStatus = createSelector(
  [selectAllUsers, (state, status) => status],
  (users, status) => users.filter(user => user.status === status)
);
```

### Advanced Entity Adapter Patterns

```javascript
import { 
  createEntityAdapter, 
  createSlice,
  createSelector 
} from '@reduxjs/toolkit';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  published: boolean;
}

// Custom sort and select ID functions
const postsAdapter = createEntityAdapter<Post>({
  // Custom ID selector (if not 'id')
  selectId: (post) => post.id,
  
  // Sort by creation date (newest first)
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = postsAdapter.getInitialState({
  loading: false,
  error: null,
  lastFetch: null,
  filter: {
    category: null,
    author: null,
    published: null,
  },
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Batch operations
    postsUpserted: (state, action) => {
      postsAdapter.upsertMany(state, action.payload);
      state.lastFetch = Date.now();
    },
    
    // Conditional updates
    togglePostPublished: (state, action) => {
      const postId = action.payload;
      const post = state.entities[postId];
      if (post) {
        postsAdapter.updateOne(state, {
          id: postId,
          changes: { 
            published: !post.published,
            updatedAt: new Date().toISOString()
          }
        });
      }
    },
    
    // Add tags to post
    addTagToPost: (state, action) => {
      const { postId, tag } = action.payload;
      const post = state.entities[postId];
      if (post && !post.tags.includes(tag)) {
        post.tags.push(tag);
        post.updatedAt = new Date().toISOString();
      }
    },
    
    // Remove posts by criteria
    removePostsByCategory: (state, action) => {
      const categoryId = action.payload;
      const postsToRemove = Object.values(state.entities)
        .filter(post => post?.categoryId === categoryId)
        .map(post => post!.id);
      
      postsAdapter.removeMany(state, postsToRemove);
    },
    
    // Update filter
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    
    // Clear old posts (keep last 100)
    pruneOldPosts: (state) => {
      const allPosts = Object.values(state.entities);
      if (allPosts.length > 100) {
        const postsToRemove = allPosts
          .slice(100) // Keep first 100 (newest due to sort)
          .map(post => post!.id);
        
        postsAdapter.removeMany(state, postsToRemove);
      }
    },
  },
});

export const {
  postsUpserted,
  togglePostPublished,
  addTagToPost,
  removePostsByCategory,
  setFilter,
  pruneOldPosts,
} = postsSlice.actions;

export default postsSlice.reducer;

// Base selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectEntities: selectPostEntities,
} = postsAdapter.getSelectors((state: RootState) => state.posts);

// Complex selectors
export const selectPublishedPosts = createSelector(
  selectAllPosts,
  (posts) => posts.filter(post => post.published)
);

export const selectPostsByAuthor = createSelector(
  [selectAllPosts, (state, authorId) => authorId],
  (posts, authorId) => posts.filter(post => post.authorId === authorId)
);

export const selectPostsByCategory = createSelector(
  [selectAllPosts, (state, categoryId) => categoryId],
  (posts, categoryId) => posts.filter(post => post.categoryId === categoryId)
);

export const selectFilteredPosts = createSelector(
  [selectAllPosts, (state) => state.posts.filter],
  (posts, filter) => {
    return posts.filter(post => {
      if (filter.category && post.categoryId !== filter.category) return false;
      if (filter.author && post.authorId !== filter.author) return false;
      if (filter.published !== null && post.published !== filter.published) return false;
      return true;
    });
  }
);

export const selectPostsStats = createSelector(
  selectAllPosts,
  (posts) => ({
    total: posts.length,
    published: posts.filter(p => p.published).length,
    drafts: posts.filter(p => !p.published).length,
    categories: [...new Set(posts.map(p => p.categoryId))].length,
    tags: [...new Set(posts.flatMap(p => p.tags))].length,
  })
);
```

---

## RTK Query

RTK Query is a data fetching and caching solution built on top of Redux Toolkit. It's designed to simplify common use cases for loading data from a server.

### Basic API Slice

```javascript
// api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tag