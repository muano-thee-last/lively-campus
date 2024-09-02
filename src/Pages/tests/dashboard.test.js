import { renderHook, act } from '@testing-library/react-hooks';
import { useState } from 'react'; 

test('initializes with correct state', () => {
  const { result } = renderHook(() => useState());
  expect(result.current[0]).toBe(undefined);
});

test('updates state correctly', () => {
  const { result } = renderHook(() => useState(0));  // Initialize state with 0

  // Update state within act to ensure it's reflected immediately
  act(() => {
    const [state, setState] = result.current;
    setState(1);  // Update state to 1
  });

  // Check if the state has been updated to 1
  expect(result.current[0]).toBe(1);
});

test('handles multiple state updates', () => {
  const { result } = renderHook(() => useState('initial'));

  act(() => {
    result.current[1]('updated');
    result.current[1]('final');
  });

  expect(result.current[0]).toBe('final');
});
