# React 19 Activity Helpers

Conditional rendering components that leverage React 19's `<Activity>` API for state preservation.

## Why Activity?

Unlike traditional conditional rendering (`condition && <Component />`), Activity preserves:
- Component state (useState, useReducer)
- DOM state (scroll position, form inputs, video timecode)
- Effects are cleaned up when hidden, restored when visible
- Pre-rendering capability for faster perceived performance

## Components

### `<If>` - Simple Toggle with State Preservation

```tsx
import { If } from '@/components/helpers';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      <If condition={isOpen}>
        <Sidebar />
      </If>
    </>
  );
}
```

### `<RenderIf>` - Simple Toggle without State Preservation

Use when you don't need state preservation (completely unmounts when false):

```tsx
import { RenderIf } from '@/components/helpers';

<RenderIf condition={user.isAdmin}>
  <AdminPanel />
</RenderIf>
```

### `<Show>` - Multiple Conditions

```tsx
import { Show } from '@/components/helpers';

// Simple mode
<Show when={isLoading}>
  <Spinner />
</Show>

// Multi-branch mode (like if/else if/else)
<Show>
  <Show.When condition={status === 'loading'}>
    <Spinner />
  </Show.When>
  <Show.When condition={status === 'error'}>
    <ErrorMessage />
  </Show.When>
  <Show.Else>
    <Content data={data} />
  </Show.Else>
</Show>
```

### `<Switch>` - Value-based Switching

```tsx
import { Switch } from '@/components/helpers';

<Switch
  value={status}
  cases={{
    idle: <IdleView />,
    loading: <LoadingView />,
    success: <SuccessView />,
    error: <ErrorView />
  }}
  defaultCase={<NotFound />}
/>
```

## Common Patterns

### Tabs with State Preservation

```tsx
import { useState } from 'react';
import { Activity } from 'react';
import { If } from '@/components/helpers';

function Tabs() {
  const [activeTab, setActiveTab] = useState('home');
  
  return (
    <>
      <nav>
        <button onClick={() => setActiveTab('home')}>Home</button>
        <button onClick={() => setActiveTab('profile')}>Profile</button>
        <button onClick={() => setActiveTab('settings')}>Settings</button>
      </nav>
      
      <If condition={activeTab === 'home'}>
        <HomeTab />
      </If>
      <If condition={activeTab === 'profile'}>
        <ProfileTab />
      </If>
      <If condition={activeTab === 'settings'}>
        <SettingsTab />
      </If>
    </>
  );
}
```

### Pre-rendering for Faster Interactions

```tsx
import { Activity } from 'react';
import { Suspense } from 'react';

function App() {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowDetails(true)}>Show Details</button>
      
      <Suspense fallback={<Skeleton />}>
        {/* Pre-render hidden, shows instantly when toggled */}
        <Activity mode={showDetails ? 'visible' : 'hidden'}>
          <HeavyComponent />
        </Activity>
      </Suspense>
    </>
  );
}
```

## When to Use Each

| Component | State Preserved | Use Case |
|-----------|----------------|----------|
| `<If>` | ✅ Yes | Toggles, modals, sidebars |
| `<RenderIf>` | ❌ No | Permission checks, feature flags |
| `<Show>` | ✅ Yes | Complex conditionals |
| `<Switch>` | ✅ Yes (configurable) | State machines, status enums |

## Cleanup for Hidden Content

When using Activity, hidden components' Effects are cleaned up. If your component has side effects that need special handling:

```tsx
function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      // Cleanup runs when hidden by Activity
      video?.pause();
    };
  }, []);
  
  return <video ref={videoRef} src="..." />;
}
```
