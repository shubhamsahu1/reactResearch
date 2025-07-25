# JavaScript Testing Interview Questions - Unit Testing & Testing Tools

## Part 1: Unit Testing - Testing Components and Functions in Isolation

### Question 1: What is unit testing and why is it important to test components/functions in isolation?

**Expected Answer:**

Unit testing is the practice of testing individual units of code (functions, methods, or components) in isolation from their dependencies. The key principles include:

**Why Test in Isolation:**
- **Faster execution** - No need to set up complex environments
- **Reliable results** - Tests don't fail due to external dependencies
- **Easier debugging** - When a test fails, you know exactly where the problem is
- **Better design** - Forces you to write more modular, decoupled code
- **Predictable outcomes** - Same input always produces same output

**Benefits:**
- Early bug detection
- Documentation of expected behavior
- Refactoring confidence
- Regression prevention
- Improved code quality

---

### Question 2: How do you test a pure function vs an impure function? Provide examples.

**Expected Answer:**

#### Pure Function Testing (Easier)
```javascript
// Pure function - same input, same output, no side effects
function calculateTax(price, taxRate) {
    return price * (1 + taxRate);
}

// Test
describe('calculateTax', () => {
    test('should calculate tax correctly', () => {
        expect(calculateTax(100, 0.1)).toBe(110);
        expect(calculateTax(0, 0.1)).toBe(0);
        expect(calculateTax(100, 0)).toBe(100);
    });
    
    test('should handle edge cases', () => {
        expect(calculateTax(-100, 0.1)).toBe(-90);
    });
});
```

#### Impure Function Testing (Requires Mocking)
```javascript
// Impure function - has side effects, depends on external state
function saveUserToDatabase(user) {
    const timestamp = new Date().toISOString();
    const userWithTimestamp = { ...user, createdAt: timestamp };
    
    // External dependency
    database.save(userWithTimestamp);
    
    // Side effect
    logger.info(`User ${user.name} saved`);
    
    return userWithTimestamp.id;
}

// Test with mocks
describe('saveUserToDatabase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('should save user with timestamp', () => {
        // Mock external dependencies
        const mockSave = jest.spyOn(database, 'save').mockReturnValue({ id: 123 });
        const mockLogger = jest.spyOn(logger, 'info').mockImplementation();
        const mockDate = jest.spyOn(Date.prototype, 'toISOString')
            .mockReturnValue('2023-01-01T00:00:00.000Z');
        
        const user = { name: 'John', email: 'john@example.com' };
        const result = saveUserToDatabase(user);
        
        // Verify interactions
        expect(mockSave).toHaveBeenCalledWith({
            name: 'John',
            email: 'john@example.com',
            createdAt: '2023-01-01T00:00:00.000Z'
        });
        expect(mockLogger).toHaveBeenCalledWith('User John saved');
        
        // Cleanup
        mockDate.mockRestore();
    });
});
```

---

### Question 3: How do you test React components in isolation? What are the key strategies?

**Expected Answer:**

#### Component Isolation Strategies:

1. **Mock External Dependencies**
2. **Use Shallow Rendering** (when appropriate)
3. **Mock Props and Callbacks**
4. **Mock API Calls**
5. **Mock Child Components**

```javascript
// Component to test
import React, { useState, useEffect } from 'react';
import { fetchUserData } from '../api/userApi';
import UserProfile from './UserProfile';
import LoadingSpinner from './LoadingSpinner';

const UserContainer = ({ userId, onUserSelect }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchUserData(userId)
            .then(userData => {
                setUser(userData);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [userId]);
    
    const handleProfileClick = () => {
        onUserSelect(user);
    };
    
    if (loading) return <LoadingSpinner />;
    if (error) return <div data-testid="error">{error}</div>;
    
    return (
        <div data-testid="user-container">
            <UserProfile user={user} onClick={handleProfileClick} />
        </div>
    );
};

// Test in isolation
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserContainer from './UserContainer';

// Mock external dependencies
jest.mock('../api/userApi');
jest.mock('./UserProfile');
jest.mock('./LoadingSpinner');

describe('UserContainer', () => {
    const mockFetchUserData = fetchUserData as jest.MockedFunction<typeof fetchUserData>;
    const mockOnUserSelect = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('should show loading state initially', () => {
        mockFetchUserData.mockReturnValue(new Promise(() => {})); // Never resolves
        
        render(<UserContainer userId="123" onUserSelect={mockOnUserSelect} />);
        
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
    
    test('should display user data after successful fetch', async () => {
        const mockUser = { id: '123', name: 'John Doe', email: 'john@example.com' };
        mockFetchUserData.mockResolvedValue(mockUser);
        
        render(<UserContainer userId="123" onUserSelect={mockOnUserSelect} />);
        
        await waitFor(() => {
            expect(screen.getByTestId('user-container')).toBeInTheDocument();
        });
        
        // Verify UserProfile received correct props
        expect(UserProfile).toHaveBeenCalledWith(
            expect.objectContaining({
                user: mockUser,
                onClick: expect.any(Function)
            }),
            {}
        );
    });
    
    test('should handle fetch error', async () => {
        const errorMessage = 'Failed to fetch user';
        mockFetchUserData.mockRejectedValue(new Error(errorMessage));
        
        render(<UserContainer userId="123" onUserSelect={mockOnUserSelect} />);
        
        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
        });
    });
    
    test('should call onUserSelect when profile is clicked', async () => {
        const mockUser = { id: '123', name: 'John Doe' };
        mockFetchUserData.mockResolvedValue(mockUser);
        
        // Mock UserProfile to call onClick when rendered
        UserProfile.mockImplementation(({ onClick }) => (
            <button onClick={onClick} data-testid="profile-button">
                Profile
            </button>
        ));
        
        render(<UserContainer userId="123" onUserSelect={mockOnUserSelect} />);
        
        await waitFor(() => {
            expect(screen.getByTestId('profile-button')).toBeInTheDocument();
        });
        
        await userEvent.click(screen.getByTestId('profile-button'));
        
        expect(mockOnUserSelect).toHaveBeenCalledWith(mockUser);
    });
});
```

---

### Question 4: How do you test functions that have side effects or interact with external systems?

**Expected Answer:**

Use **mocking, spying, and dependency injection** to isolate the function:

```javascript
// Function with side effects
class EmailService {
    constructor(apiClient, logger) {
        this.apiClient = apiClient;
        this.logger = logger;
    }
    
    async sendWelcomeEmail(user) {
        try {
            // External API call
            const emailTemplate = await this.apiClient.getTemplate('welcome');
            
            // Another external call
            const result = await this.apiClient.sendEmail({
                to: user.email,
                subject: emailTemplate.subject,
                body: emailTemplate.body.replace('{{name}}', user.name)
            });
            
            // Side effect - logging
            this.logger.info(`Welcome email sent to ${user.email}`);
            
            // Side effect - analytics
            analytics.track('email_sent', { 
                type: 'welcome', 
                userId: user.id 
            });
            
            return { success: true, messageId: result.id };
            
        } catch (error) {
            this.logger.error(`Failed to send email to ${user.email}: ${error.message}`);
            throw error;
        }
    }
}

// Test with complete isolation
describe('EmailService', () => {
    let emailService;
    let mockApiClient;
    let mockLogger;
    let mockAnalytics;
    
    beforeEach(() => {
        // Create mocks for all dependencies
        mockApiClient = {
            getTemplate: jest.fn(),
            sendEmail: jest.fn()
        };
        
        mockLogger = {
            info: jest.fn(),
            error: jest.fn()
        };
        
        // Mock global analytics
        mockAnalytics = {
            track: jest.fn()
        };
        global.analytics = mockAnalytics;
        
        emailService = new EmailService(mockApiClient, mockLogger);
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('should send welcome email successfully', async () => {
        // Setup mocks
        const mockTemplate = {
            subject: 'Welcome!',
            body: 'Hello {{name}}, welcome!'
        };
        const mockSendResult = { id: 'msg-123' };
        
        mockApiClient.getTemplate.mockResolvedValue(mockTemplate);
        mockApiClient.sendEmail.mockResolvedValue(mockSendResult);
        
        const user = { id: '1', name: 'John', email: 'john@example.com' };
        
        // Execute
        const result = await emailService.sendWelcomeEmail(user);
        
        // Verify external calls
        expect(mockApiClient.getTemplate).toHaveBeenCalledWith('welcome');
        expect(mockApiClient.sendEmail).toHaveBeenCalledWith({
            to: 'john@example.com',
            subject: 'Welcome!',
            body: 'Hello John, welcome!'
        });
        
        // Verify side effects
        expect(mockLogger.info).toHaveBeenCalledWith('Welcome email sent to john@example.com');
        expect(mockAnalytics.track).toHaveBeenCalledWith('email_sent', {
            type: 'welcome',
            userId: '1'
        });
        
        // Verify return value
        expect(result).toEqual({ success: true, messageId: 'msg-123' });
    });
    
    test('should handle template fetch failure', async () => {
        const error = new Error('Template not found');
        mockApiClient.getTemplate.mockRejectedValue(error);
        
        const user = { id: '1', name: 'John', email: 'john@example.com' };
        
        await expect(emailService.sendWelcomeEmail(user))
            .rejects.toThrow('Template not found');
        
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Failed to send email to john@example.com: Template not found'
        );
        
        // Verify no email was sent
        expect(mockApiClient.sendEmail).not.toHaveBeenCalled();
        expect(mockAnalytics.track).not.toHaveBeenCalled();
    });
});
```

---

## Part 2: Testing Tools and Libraries

### Question 5: Compare Jest, Mocha, and Vitest. When would you use each?

**Expected Answer:**

| Feature | Jest | Mocha | Vitest |
|---------|------|-------|--------|
| **Setup** | Zero config | Requires setup | Minimal config |
| **Mocking** | Built-in | Requires Sinon | Built-in |
| **Assertions** | Built-in | Requires Chai | Built-in |
| **Snapshot Testing** | ✅ Built-in | ❌ Plugin needed | ✅ Built-in |
| **Code Coverage** | ✅ Built-in | ❌ Plugin needed | ✅ Built-in |
| **Speed** | Moderate | Fast | Very Fast |
| **ES Modules** | Limited support | Good | Excellent |
| **Watch Mode** | ✅ | ❌ (needs plugin) | ✅ |

**When to use:**

**Jest** - Best for:
- React applications
- Need zero configuration
- Snapshot testing
- Large existing codebase

**Mocha** - Best for:
- Maximum flexibility
- Custom test runners
- Legacy projects
- When you want to choose your own assertion library

**Vitest** - Best for:
- Vite-based projects
- Modern ES modules
- Fast test execution
- TypeScript projects

---

### Question 6: Explain Cypress for E2E testing. How does it differ from unit testing?

**Expected Answer:**

#### Cypress Overview:
Cypress is an end-to-end testing framework that runs tests in a real browser environment.

#### Key Differences from Unit Testing:

| Aspect | Unit Testing | Cypress E2E |
|--------|--------------|-------------|
| **Scope** | Individual functions/components | Complete user workflows |
| **Environment** | Isolated/mocked | Real browser |
| **Speed** | Very fast (milliseconds) | Slower (seconds/minutes) |
| **Reliability** | Highly reliable | Can be flaky |
| **Cost** | Low maintenance | Higher maintenance |
| **Feedback** | Immediate | Delayed |

#### Cypress Example:
```javascript
// cypress/integration/user-registration.spec.js
describe('User Registration Flow', () => {
    beforeEach(() => {
        cy.visit('/register');
    });
    
    it('should register a new user successfully', () => {
        // Fill out registration form
        cy.get('[data-testid="email-input"]').type('user@example.com');
        cy.get('[data-testid="password-input"]').type('SecurePassword123');
        cy.get('[data-testid="confirm-password-input"]').type('SecurePassword123');
        cy.get('[data-testid="terms-checkbox"]').check();
        
        // Submit form
        cy.get('[data-testid="register-button"]').click();
        
        // Verify success
        cy.url().should('include', '/welcome');
        cy.get('[data-testid="welcome-message"]')
            .should('contain', 'Welcome to our platform!');
        
        // Verify email was sent (mock API)
        cy.get('[data-testid="email-verification-notice"]')
            .should('be.visible');
    });
    
    it('should show validation errors for invalid input', () => {
        cy.get('[data-testid="register-button"]').click();
        
        cy.get('[data-testid="email-error"]')
            .should('contain', 'Email is required');
        cy.get('[data-testid="password-error"]')
            .should('contain', 'Password is required');
    });
    
    it('should handle server errors gracefully', () => {
        // Mock server error
        cy.intercept('POST', '/api/register', {
            statusCode: 500,
            body: { error: 'Internal server error' }
        });
        
        cy.get('[data-testid="email-input"]').type('user@example.com');
        cy.get('[data-testid="password-input"]').type('password123');
        cy.get('[data-testid="register-button"]').click();
        
        cy.get('[data-testid="error-message"]')
            .should('contain', 'Registration failed. Please try again.');
    });
});
```

#### Best Practices:
- Use data-testid attributes for stable selectors
- Mock external APIs when appropriate
- Keep tests independent
- Use Page Object Model for complex applications

---

### Question 7: What is Enzyme and how does it compare to React Testing Library?

**Expected Answer:**

#### Enzyme (Legacy Approach):
Enzyme is a JavaScript testing utility for React that makes it easier to test React Components' output and behavior.

```javascript
// Enzyme example (shallow rendering)
import { shallow, mount } from 'enzyme';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
    test('should render correctly', () => {
        const wrapper = shallow(<MyComponent name="John" />);
        
        expect(wrapper.find('.username').text()).toBe('John');
        expect(wrapper.find('button')).toHaveLength(1);
    });
    
    test('should call onClick when button is clicked', () => {
        const mockClick = jest.fn();
        const wrapper = shallow(<MyComponent onClick={mockClick} />);
        
        wrapper.find('button').simulate('click');
        expect(mockClick).toHaveBeenCalled();
    });
    
    test('should update state on input change', () => {
        const wrapper = mount(<MyComponent />);
        
        wrapper.find('input').simulate('change', { 
            target: { value: 'new value' } 
        });
        
        expect(wrapper.state('inputValue')).toBe('new value');
    });
});
```

#### React Testing Library (Modern Approach):
Focuses on testing behavior from user's perspective.

```javascript
// React Testing Library example
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
    test('should display username', () => {
        render(<MyComponent name="John" />);
        
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
    
    test('should call onClick when button is clicked', async () => {
        const mockClick = jest.fn();
        render(<MyComponent onClick={mockClick} />);
        
        await userEvent.click(screen.getByRole('button'));
        expect(mockClick).toHaveBeenCalled();
    });
    
    test('should update display on input change', async () => {
        render(<MyComponent />);
        const input = screen.getByRole('textbox');
        
        await userEvent.type(input, 'new value');
        
        expect(screen.getByDisplayValue('new value')).toBeInTheDocument();
    });
});
```

#### Comparison:

| Feature | Enzyme | React Testing Library |
|---------|--------|----------------------|
| **Philosophy** | Implementation details | User behavior |
| **Learning Curve** | Steeper | Gentler |
| **React Support** | Limited (React 17+) | Full support |
| **Shallow Rendering** | ✅ Yes | ❌ No |
| **State Testing** | ✅ Direct access | ❌ Through behavior |
| **Maintenance** | ⚠️ Legacy | ✅ Active |

**Recommendation:** Use React Testing Library for new projects.

---

### Question 8: Explain MSW (Mock Service Worker) and when you'd use it instead of traditional mocking.

**Expected Answer:**

#### MSW Overview:
MSW intercepts network requests at the network level, providing realistic API mocking for both testing and development.

#### Traditional Mocking vs MSW:

**Traditional Mocking:**
```javascript
// Traditional approach - mock the function
jest.mock('../api/userApi', () => ({
    fetchUsers: jest.fn().mockResolvedValue([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
    ])
}));
```

**MSW Approach:**
```javascript
// MSW approach - mock the actual HTTP request
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
    rest.get('/api/users', (req, res, ctx) => {
        return res(
            ctx.json([
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' }
            ])
        );
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### Complete MSW Setup Example:

```javascript
// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
    // Get users
    rest.get('/api/users', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                { id: 1, name: 'John Doe', email: 'john@example.com' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
            ])
        );
    }),
    
    // Create user
    rest.post('/api/users', async (req, res, ctx) => {
        const newUser = await req.json();
        
        // Simulate validation
        if (!newUser.email) {
            return res(
                ctx.status(400),
                ctx.json({ error: 'Email is required' })
            );
        }
        
        return res(
            ctx.status(201),
            ctx.json({ 
                id: Date.now(), 
                ...newUser,
                createdAt: new Date().toISOString()
            })
        );
    }),
    
    // Dynamic responses based on request
    rest.get('/api/users/:id', (req, res, ctx) => {
        const { id } = req.params;
        
        if (id === '999') {
            return res(
                ctx.status(404),
                ctx.json({ error: 'User not found' })
            );
        }
        
        return res(
            ctx.json({ 
                id: parseInt(id), 
                name: `User ${id}`,
                email: `user${id}@example.com`
            })
        );
    })
];

// src/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// src/setupTests.js
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### Using MSW in Tests:

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import { rest } from 'msw';
import UserList from './UserList';

describe('UserList', () => {
    test('should display users from API', async () => {
        render(<UserList />);
        
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });
    });
    
    test('should handle API error', async () => {
        // Override handler for this test
        server.use(
            rest.get('/api/users', (req, res, ctx) => {
                return res(
                    ctx.status(500),
                    ctx.json({ error: 'Internal server error' })
                );
            })
        );
        
        render(<UserList />);
        
        await waitFor(() => {
            expect(screen.getByText('Failed to load users')).toBeInTheDocument();
        });
    });
    
    test('should create new user', async () => {
        render(<UserList />);
        
        const nameInput = screen.getByLabelText('Name');
        const emailInput = screen.getByLabelText('Email');
        const submitButton = screen.getByText('Add User');
        
        await userEvent.type(nameInput, 'New User');
        await userEvent.type(emailInput, 'new@example.com');
        await userEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText('New User')).toBeInTheDocument();
        });
    });
});
```

#### Benefits of MSW:

1. **Realistic Testing** - Tests actual HTTP requests
2. **Shared Mocks** - Same mocks for tests and development
3. **No Code Changes** - No need to modify application code
4. **Request/Response Details** - Full control over HTTP responses
5. **Better Debugging** - Network tab shows actual requests

#### When to Use MSW:
- Integration testing
- Testing network error handling
- Complex API interactions
- Shared development/testing environment
- When you want to test the actual HTTP layer

---

### Question 9: How would you test a custom React hook? Provide an example.

**Expected Answer:**

#### Testing Custom Hooks with React Testing Library:

```javascript
// Custom hook to test
import { useState, useEffect, useCallback } from 'react';

export const useCounter = (initialValue = 0, step = 1) => {
    const [count, setCount] = useState(initialValue);
    const [history, setHistory] = useState([initialValue]);
    
    const increment = useCallback(() => {
        setCount(prev => {
            const newValue = prev + step;
            setHistory(hist => [...hist, newValue]);
            return newValue;
        });
    }, [step]);
    
    const decrement = useCallback(() => {
        setCount(prev => {
            const newValue = prev - step;
            setHistory(hist => [...hist, newValue]);
            return newValue;
        });
    }, [step]);
    
    const reset = useCallback(() => {
        setCount(initialValue);
        setHistory([initialValue]);
    }, [initialValue]);
    
    return {
        count,
        history,
        increment,
        decrement,
        reset
    };
};

// Testing the hook
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
    test('should initialize with default values', () => {
        const { result } = renderHook(() => useCounter());
        
        expect(result.current.count).toBe(0);
        expect(result.current.history).toEqual([0]);
    });
    
    test('should initialize with custom values', () => {
        const { result } = renderHook(() => useCounter(5, 2));
        
        expect(result.current.count).toBe(5);
        expect(result.current.history).toEqual([5]);
    });
    
    test('should increment count', () => {
        const { result } = renderHook(() => useCounter(0, 1));
        
        act(() => {
            result.current.increment();
        });
        
        expect(result.current.count).toBe(1);
        expect(result.current.history).toEqual([0, 1]);
    });
    
    test('should decrement count', () => {
        const { result } = renderHook(() => useCounter(5, 1));
        
        act(() => {
            result.current.decrement();
        });
        
        expect(result.current.count).toBe(4);
        expect(result.current.history).toEqual([5, 4]);
    });
    
    test('should reset count', () => {
        const { result } = renderHook(() => useCounter(0, 1));
        
        act(() => {
            result.current.increment();
            result.current.increment();
        });
        
        expect(result.current.count).toBe(2);
        
        act(() => {
            result.current.reset();
        });
        
        expect(result.current.count).toBe(0);
        expect(result.current.history).toEqual([0]);
    });
    
    test('should work with custom step', () => {
        const { result } = renderHook(() => useCounter(0, 5));
        
        act(() => {
            result.current.increment();
        });
        
        expect(result.current.count).toBe(5);
        
        act(() => {
            result.current.decrement();
        });
        
        expect(result.current.count).toBe(0);
    });
});
```

#### Testing Hook with Dependencies (API calls):

```javascript
// Hook with API dependency
import { useState, useEffect } from 'react';
import { fetchUserData } from '../api/userApi';

export const useUser = (userId) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        
        let cancelled = false;
        
        fetchUserData(userId)
            .then(userData => {
                if (!cancelled) {
                    setUser(userData);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (!cancelled) {
                    setError(err.message);
                    setLoading(false);
                }
            });
        
        return () => {
            cancelled = true;
        };
    }, [userId]);
    
    return { user, loading, error };
};

// Test with mocked API
jest.mock('../api/userApi');

describe('useUser', () => {
    const mockFetchUserData = fetchUserData as jest.MockedFunction<typeof fetchUserData>;
    
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('should return loading state initially', () => {
        mockFetchUserData.mockReturnValue(new Promise(() => {})); // Never resolves
        
        const { result } = renderHook(() => useUser('123'));
        
        expect(result.current.loading).toBe(true);
        expect(result.current.user).toBe(null);
        expect(result.current.error).toBe(null);
    });
    
    test('should fetch and return user data', async () => {
        const mockUser = { id: '123', name: 'John Doe' };
        mockFetchUserData.mockResolvedValue(mockUser);
        
        const { result } = renderHook(() => useUser('123'));
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.error).toBe(null);
    });
    
    test('should handle API error', async () => {
        const errorMessage = 'User not found';
        mockFetchUserData.mockRejectedValue(new Error(errorMessage));
        
        const { result } = renderHook(() => useUser('123'));
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        
        expect(result.current.user).toBe(null);
        expect(result.current.error).toBe(errorMessage);
    });
    
    test('should refetch when userId changes', async () => {
        const mockUser1 = { id: '123', name: 'John' };
        const mockUser2 = { id: '456', name: 'Jane' };
        
        mockFetchUserData
            .mockResolvedValueOnce(mockUser1)
            .mockResolvedValueOnce(mockUser2);
        
        const { result, rerender } = renderHook(
            ({ userId }) => useUser(userId),
            { initialProps: { userId: '123' } }
        );
        
        await waitFor(() => {
            expect(result.current.user).toEqual(mockUser1);
        });
        
        rerender({ userId: '456' });
        
        await waitFor(() => {
            expect(result.current.user).toEqual(mockUser2);
        });
        
        expect(mockFetchUserData).toHaveBeenCalledTimes(2);
    });
});
```

---

### Question 10: How do you test asynchronous code? Provide examples for promises, async/await, and callbacks.

**Expected Answer:**

#### Testing Promises:

```javascript
// Function returning promise
function fetchData() {
    return fetch('/api/data').then(response => response.json());
}

// Test using async/await
test('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockData)
    });
    
    const result = await fetchData();
    expect(result).toEqual(mockData);
});

// Test using .resolves
test('should fetch data successfully with resolves', () => {
    const mockData = { id: 1, name: 'Test' };
    global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockData)
    });
    
    return expect(fetchData()).resolves.toEqual(mockData);
});

// Test promise rejection
test('should handle fetch error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    
    await expect(fetchData()).rejects.toThrow('Network error');
});
```

#### Testing Async/Await:

```javascript
// Async function
async function processUserData(userId) {
    try {
        const user = await fetchUser(userId);
        const preferences = await fetchUserPreferences(userId);
        
        return {
            ...user,
            preferences
        };
    } catch (error) {
        throw new Error(`Failed to process user data: ${error.message}`);
    }
}

// Test async function
describe('processUserData', () => {
    test('should combine user and preferences data', async () => {
        const mockUser = { id: '123', name: 'John' };
        const mockPreferences = { theme: 'dark', language: 'en' };
        
        fetchUser.mockResolvedValue(mockUser);
        fetchUserPreferences.mockResolvedValue(mockPreferences);
        
        const result = await processUserData('123');
        
        expect(result).toEqual({
            id: '123',
            name: 'John',
            preferences: { theme: 'dark', language: 'en' }
        });
    });
    
    test('should handle user fetch error', async () => {
        fetchUser.mockRejectedValue(new Error('User not found'));
        
        await expect(processUserData('123'))
            .rejects.toThrow('Failed to process user data: User not found');
    });
});
```

#### Testing Callbacks:

```javascript
// Function with callback
function processDataWithCallback(data, callback) {
    setTimeout(() => {
        try {
            const processed = data.map(item => item.toUpperCase());
            callback(null, processed);
        } catch (error) {
            callback(error);
        }
    }, 100);
}

// Test callback function
test('should process data and call callback', (done) => {
    const testData = ['hello', 'world'];
    const expectedResult = ['HELLO', 'WORLD'];
    
    processDataWithCallback(testData, (error, result) => {
        expect(error).toBeNull();
        expect(result).toEqual(expectedResult);
        done(); // Signal test completion
    });
});

// Test callback with error
test('should call callback with error', (done) => {
    const invalidData = [null]; // Will cause error
    
    processDataWithCallback(invalidData, (error, result) => {
        expect(error).toBeInstanceOf(Error);
        expect(result).toBeUndefined();
        done();
    });
});

// Using promise wrapper for cleaner testing
function promisifyCallback(data) {
    return new Promise((resolve, reject) => {
        processDataWithCallback(data, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

test('should process data using promise wrapper', async () => {
    const testData = ['hello', 'world'];
    const result = await promisifyCallback(testData);
    expect(result).toEqual(['HELLO', 'WORLD']);
});
```

#### Testing with Timers:

```javascript
// Function using setTimeout
function delayedGreeting(name, delay = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`Hello, ${name}!`);
        }, delay);
    });
}

// Test with fake timers
describe('delayedGreeting', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    
    afterEach(() => {
        jest.useRealTimers();
    });
    
    test('should resolve after specified delay', async () => {
        const promise = delayedGreeting('John', 1000);
        
        // Fast-forward time
        jest.advanceTimersByTime(1000);
        
        const result = await promise;
        expect(result).toBe('Hello, John!');
    });
    
    test('should not resolve before delay', () => {
        const promise = delayedGreeting('John', 1000);
        
        // Don't advance time enough
        jest.advanceTimersByTime(500);
        
        // Promise should still be pending
        expect(jest.getTimerCount()).toBe(1);
    });
});
```

---

## Evaluation Criteria

### Scoring Guide:

#### **Junior Level (0-4 correct answers):**
- Basic understanding of unit testing concepts
- Knows about Jest or similar testing framework
- Can write simple tests for pure functions
- Limited knowledge of testing tools ecosystem

#### **Mid Level (5-7 correct answers):**
- Good understanding of testing isolation principles
- Can test components and hooks effectively
- Familiar with mocking strategies
- Knows difference between unit, integration, and E2E testing
- Experience with React Testing Library or Enzyme

#### **Senior Level (8-10 correct answers):**
- Deep understanding of testing strategies and trade-offs
- Experience with multiple testing tools and when to use each
- Can design comprehensive testing approaches
- Understands advanced concepts like MSW, custom test utilities
- Can mentor others on testing best practices

### Key Areas to Evaluate:

1. **Testing Philosophy** - Understanding of testing pyramid, isolation principles
2. **Tool Knowledge** - Familiarity with various testing tools and their use cases
3. **Practical Skills** - Ability to write effective tests for different scenarios
4. **Debugging Skills** - Can identify and fix test-related issues
5. **Best Practices** - Knows testing conventions and anti-patterns