import { Activity, type ReactNode } from 'react';

interface IfProps {
  /** When true, children are visible; when false, children are hidden but state is preserved */
  condition: boolean;
  children: ReactNode;
}

/**
 * Conditionally renders content using React 19's Activity boundary.
 * When condition is false, the component is hidden but its state is preserved.
 * 
 * @example
 * ```tsx
 * <If condition={isSidebarOpen}>
 *   <Sidebar />
 * </If>
 * ```
 */
export function If({ condition, children }: IfProps) {
  return <Activity mode={condition ? 'visible' : 'hidden'}>{children}</Activity>;
}
