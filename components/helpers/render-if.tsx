import type { ReactNode } from 'react';

interface RenderIfProps {
  /** When true, children are rendered; when false, nothing is rendered */
  condition: boolean;
  children: ReactNode;
}

/**
 * Simple conditional rendering without state preservation.
 * Unlike `<If>`, this does NOT preserve state when hidden.
 * Use this when you don't need state preservation and want to completely unmount.
 * 
 * @example
 * ```tsx
 * <RenderIf condition={hasPermission}>
 *   <AdminPanel />
 * </RenderIf>
 * ```
 */
export function RenderIf({ children, condition }: RenderIfProps) {
  return condition ? children : null;
}
