import { Activity, type ComponentType, type ReactNode } from 'react';

type CaseComponent = ReactNode | ComponentType;

export interface SwitchProps {
  /** Value to match against case keys */
  value: string | number;
  /** Map of case values to components */
  cases: Record<string | number, CaseComponent>;
  /** Default component when no case matches */
  defaultCase: CaseComponent;
  /** Whether to preserve state of inactive cases (default: true) */
  preserveState?: boolean;
}

function renderCase(component: CaseComponent): ReactNode {
  if (typeof component === 'function') {
    const Component = component as ComponentType;
    return <Component />;
  }
  return <>{component}</>;
}

/**
 * Switch component for rendering different content based on a value.
 * Uses React 19's Activity to preserve state of all cases.
 * 
 * @example
 * ```tsx
 * <Switch
 *   value={status}
 *   cases={{
 *     loading: <Spinner />,
 *     success: <SuccessMessage />,
 *     error: <ErrorMessage />
 *   }}
 *   defaultCase={<NotFound />}
 * />
 * ```
 */
export function Switch({ value, cases, defaultCase, preserveState = true }: SwitchProps) {
  const caseKeys = Object.keys(cases);
  const activeKey = caseKeys.find((key) => key === String(value));

  // If not preserving state, only render the active case
  if (!preserveState) {
    return <>{renderCase(activeKey ? cases[activeKey] : defaultCase)}</>;
  }

  return (
    <>
      {caseKeys.map((key) => (
        <Activity key={key} mode={key === activeKey ? 'visible' : 'hidden'}>
          {renderCase(cases[key])}
        </Activity>
      ))}
      <Activity mode={activeKey === undefined ? 'visible' : 'hidden'}>
        {renderCase(defaultCase)}
      </Activity>
    </>
  );
}
