import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { BundleProvider, useBundle } from '@/context/BundleContext';
import type { Product } from '@/types';

// Mock product list
const mockProducts: Product[] = [
  {
    id: 'camera-1',
    stepId: 1,
    name: 'Wyze Cam Test',
    description: 'A mock camera for testing',
    compareAtPrice: 39.99,
    price: 29.99,
    category: 'cameras',
    imageUrl: '/mock-camera.png',
    variants: [
      { id: 'white', label: 'White', colorHex: '#fff', imageUrl: '/white.png' },
      { id: 'black', label: 'Black', colorHex: '#000', imageUrl: '/black.png' },
    ],
  },
  {
    id: 'sensor-1',
    stepId: 3,
    name: 'Wyze Sensor Test',
    description: 'A mock sensor for testing',
    compareAtPrice: 19.99,
    price: 14.99,
    category: 'sensors',
    imageUrl: '/mock-sensor.png',
  },
];

// Helper consumer component to test state and dispatch
function TestConsumer() {
  const { state, dispatch } = useBundle();
  return (
    <div>
      <div data-testid="current-step">{state.currentStep}</div>
      
      {/* Camera-1 details */}
      <div data-testid="active-variant-camera-1">
        {state.activeVariants['camera-1']}
      </div>
      <div data-testid="qty-camera-1-white">
        {state.quantities['camera-1']?.['white'] ?? 0}
      </div>
      <div data-testid="qty-camera-1-black">
        {state.quantities['camera-1']?.['black'] ?? 0}
      </div>

      {/* Sensor-1 details */}
      <div data-testid="qty-sensor-1-default">
        {state.quantities['sensor-1']?.['default'] ?? 0}
      </div>

      {/* Dispatch control buttons */}
      <button
        onClick={() =>
          dispatch({
            type: 'SET_QUANTITY',
            productId: 'camera-1',
            variantId: 'white',
            quantity: 3,
          })
        }
      >
        Set White Qty 3
      </button>

      <button
        onClick={() =>
          dispatch({
            type: 'SET_QUANTITY',
            productId: 'camera-1',
            variantId: 'black',
            quantity: 2,
          })
        }
      >
        Set Black Qty 2
      </button>

      <button
        onClick={() =>
          dispatch({
            type: 'SET_ACTIVE_VARIANT',
            productId: 'camera-1',
            variantId: 'black',
          })
        }
      >
        Set Active Black
      </button>

      <button
        onClick={() =>
          dispatch({
            type: 'SET_STEP',
            step: 3,
          })
        }
      >
        Go to Step 3
      </button>
    </div>
  );
}

describe('BundleContext & Reducer integration', () => {
  it('initializes layout and state correctly', () => {
    render(
      <BundleProvider products={mockProducts}>
        <TestConsumer />
      </BundleProvider>
    );

    // Initial state check
    expect(screen.getByTestId('current-step').textContent).toBe('1');
    expect(screen.getByTestId('active-variant-camera-1').textContent).toBe('white');
    expect(screen.getByTestId('qty-camera-1-white').textContent).toBe('0');
    expect(screen.getByTestId('qty-sensor-1-default').textContent).toBe('0');
  });

  it('updates state correctly on dispatch actions', () => {
    render(
      <BundleProvider products={mockProducts}>
        <TestConsumer />
      </BundleProvider>
    );

    // 1. Change White Quantity
    act(() => {
      screen.getByText('Set White Qty 3').click();
    });
    expect(screen.getByTestId('qty-camera-1-white').textContent).toBe('3');

    // 2. Change Active Variant (should not reset other variant's quantity)
    act(() => {
      screen.getByText('Set Active Black').click();
    });
    expect(screen.getByTestId('active-variant-camera-1').textContent).toBe('black');
    expect(screen.getByTestId('qty-camera-1-white').textContent).toBe('3'); // Stays 3!

    // 3. Set Black Quantity
    act(() => {
      screen.getByText('Set Black Qty 2').click();
    });
    expect(screen.getByTestId('qty-camera-1-black').textContent).toBe('2');

    // 4. Change current step
    act(() => {
      screen.getByText('Go to Step 3').click();
    });
    expect(screen.getByTestId('current-step').textContent).toBe('3');
  });
});
