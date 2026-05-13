import { Activity, Children, type ReactElement, type ReactNode } from 'react';

interface ShowProps {
  /** When provided, shows/hides all children together based on this condition */
  when?: boolean;
  children: ReactNode | ReactElement<ShowWhenProps> | ReactElement<ShowWhenProps>[];
}

interface ShowWhenProps {
  /** Condition for this branch to be visible */
  condition: boolean;
  children: ReactNode;
}

interface ShowElseProps {
  /** Optional render prop for lazy evaluation */
  render?: () => ReactNode;
  children?: ReactNode;
}

/**
 * Flexible conditional rendering with state preservation using React 19's Activity.
 * 
 * Two usage patterns:
 * 
 * 1. Simple when prop:
 * ```tsx
 * <Show when={isOpen}>
 *   <Modal />
 * </Show>
 * ```
 * 
 * 2. Multiple conditions with When/Else:
 * ```tsx
 * <Show>
 *   <Show.When condition={status === 'loading'}>
 *     <Spinner />
 *   </Show.When>
 *   <Show.When condition={status === 'error'}>
 *     <ErrorMessage />
 *   </Show.When>
 *   <Show.Else>
 *     <Content />
 *   </Show.Else>
 * </Show>
 * ```
 */
export function Show({ when, children }: ShowProps) {
  // Simple mode: just toggle visibility based on `when` prop
  if (when !== undefined) {
    return <Activity mode={when ? 'visible' : 'hidden'}>{children}</Activity>;
  }

  // Multi-branch mode: find first matching When or fallback to Else
  let matchedChild: ReactElement<ShowWhenProps> | null = null;
  let elseChild: ReactElement<ShowWhenProps> | null = null;
  const allChildren: ReactElement<ShowWhenProps>[] = [];

  Children.forEach(children, (child) => {
    if (!child || typeof child !== 'object' || !('props' in child)) return;

    const reactChild = child as ReactElement<ShowWhenProps>;
    allChildren.push(reactChild);

    if (reactChild.props.condition === undefined) {
      elseChild = reactChild;
    } else if (!matchedChild && reactChild.props.condition === true) {
      matchedChild = reactChild;
    }
  });

  const activeChild = matchedChild || elseChild;

  return (
    <>
      {allChildren.map((child, index) => (
        <Activity key={child.key || index} mode={child === activeChild ? 'visible' : 'hidden'}>
          {child}
        </Activity>
      ))}
    </>
  );
}

function ShowWhen({ condition, children }: ShowWhenProps) {
  return <Activity mode={condition ? 'visible' : 'hidden'}>{children}</Activity>;
}

function ShowElse({ render, children }: ShowElseProps) {
  return <>{render ? render() : children}</>;
}

Show.When = ShowWhen;
Show.Else = ShowElse;
