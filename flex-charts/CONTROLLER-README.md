# TimeLineChart Controller Implementation

## 🎯 Overview

The enhanced TimeLineChart now includes a comprehensive controller system that provides programmatic access to chart state, DOM elements, and real-time dimension tracking with automatic updates via ResizeObserver.

## ✨ Features Implemented

### 1. Chart Controller System

- **TimeLineChartController**: Main controller class for DOM management
- **React forwardRef**: Seamless integration with React components
- **Generic ChartController interface**: Extensible for future chart types

### 2. DOM Element Management

- **Bar Element Storage**: Automatic registration of bar DOM elements by ID
- **Time Slot Elements**: Collection and management of time slot elements
- **Element Reference Callbacks**: Handles component re-renders and cleanup

### 3. Dimension Tracking & Callbacks

- **ResizeObserver Integration**: Automatic dimension updates on resize
- **Categorized Dimensions**:
  - **Visible**: Dimensions from the main chart element (what user sees)
  - **Total**: Dimensions from the `data-testid="timeline-chart-container"` element
- **Precision**: 2-decimal precision for dimension values
- **Change Callbacks**: Subscribe to dimension changes with cleanup

### 4. Accessibility & Testing

- **Data-test-id Attributes**: Comprehensive test selectors for all elements
- **ARIA Attributes**: Proper accessibility labels and roles
- **Viewport Testing**: Separate test suites for mobile (480px) and desktop (1600px)

## 🚀 Usage

### Basic Controller Usage

```tsx
import { useRef, useEffect } from "react";
import { TimeLineChart, TimeLineChartController } from "@terotests/flex-charts";

function MyChart() {
  const chartRef = useRef<TimeLineChartController>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Get chart information
      const info = chartRef.current.getChartInfo();
      console.log("Chart ID:", info.chartId);
      console.log("Dimensions:", info.dimensions);

      // Subscribe to dimension changes
      const unsubscribe = chartRef.current.onDimensionChange((dimensions) => {
        console.log("Chart resized:", dimensions);
      });

      // Cleanup subscription
      return unsubscribe;
    }
  }, []);

  return (
    <TimeLineChart
      ref={chartRef}
      startDate="2020"
      endDate="2024"
      interval="Y"
      bars={myBars}
    />
  );
}
```

### Advanced Controller Features

```tsx
// Access individual bar elements
const barElements = chartRef.current.getAllBarElements();
barElements.forEach((element, id) => {
  console.log(`Bar ${id}:`, element.getBoundingClientRect());
});

// Get time slot elements
const timeSlots = chartRef.current.getTimeSlotElements();
console.log("Time slots count:", timeSlots.length);

// Force dimension recalculation
chartRef.current.recalculateDimensions();

// Scroll control functionality
chartRef.current.scrollTo(0.5); // Scroll to middle
chartRef.current.scrollToStart(); // Scroll to beginning
chartRef.current.scrollToEnd(); // Scroll to end
chartRef.current.scrollToCenter(); // Scroll to center (0.5)
```

## 🧪 Testing

### Viewport-Specific Testing

The implementation includes comprehensive Playwright tests for:

- **Mobile (480px)**: Tests responsive behavior and element visibility
- **Desktop (1600px)**: Tests full-width display and enhanced functionality

### Test Commands (PowerShell)

```powershell
# Run all Playwright tests
.\dev-helper.ps1 test-e2e

# Run tests with UI
.\dev-helper.ps1 test-ui

# Validate implementation
.\validate-implementation.ps1
```

### Test Selectors

All elements include `data-test-id` attributes:

- `timeline-chart`: Main chart container
- `bar-{id}`: Individual bars (e.g., `bar-1`, `bar-12`)
- `time-slot-{index}`: Time slot elements (e.g., `time-slot-0`)

## 📊 Controller API Reference

### Properties

```typescript
interface TimeLineChartController {
  chartId: string; // Unique chart identifier
  isInitialized: boolean; // Initialization status
  startDate: string; // Chart start date
  endDate: string; // Chart end date
  barCount: number; // Number of bars
  chartElement: HTMLElement | null; // Main chart DOM element
}
```

### Methods

```typescript
// Initialization
initialize(startDate: string, endDate: string, barCount: number, element?: HTMLElement): void

// Chart Information
getChartInfo(): ChartInfo
getDimensions(): { visible: Dimensions | null; total: Dimensions | null }

// Element Management
updateElement(element: HTMLElement | null): void
updateContainerElement(element: HTMLElement | null): void
addBarElement(barId: string | number, element: HTMLElement): void
removeBarElement(barId: string | number): void
getBarElement(barId: string | number): HTMLElement | undefined
getAllBarElements(): Map<string | number, HTMLElement>
updateTimeSlotElements(elements: HTMLElement[]): void
getTimeSlotElements(): HTMLElement[]

// Dimension Callbacks
onDimensionChange(callback: DimensionChangeCallback): () => void
recalculateDimensions(): void

// Scroll Control
setScrollToCallback(callback: (position: number) => void): void
scrollTo(position: number): void              // Scroll to position (0-1)
scrollToStart(): void                        // Scroll to beginning (0)
scrollToEnd(): void                          // Scroll to end (1)
scrollToCenter(): void                       // Scroll to center (0.5)

// Lifecycle
reset(): void
```

### Types

```typescript
interface Dimensions {
  width: number; // 2-decimal precision
  height: number; // 2-decimal precision
}

type DimensionChangeCallback = (dimensions: {
  visible: Dimensions | null;
  total: Dimensions | null;
}) => void;
```

## 🎨 Accessibility Features

### ARIA Attributes

Every bar element includes:

- `title`: Bar label for tooltips
- `aria-label`: Screen reader label
- `role="img"`: Semantic role
- `aria-description`: Detailed description with time range
- `tabIndex={0}`: Keyboard navigation support

### Example Bar Output

```html
<div
  class="bar"
  data-test-id="bar-1"
  title="Turbo C"
  aria-label="Turbo C"
  role="img"
  aria-description="Turbo C: 1990 - 1995"
  tabindex="0"
  style="..."
>
  Turbo C
</div>
```

## 🔧 Development Tools

### PowerShell Helper Scripts

```powershell
# Development server
.\dev-helper.ps1 dev

# Build library
.\dev-helper.ps1 build

# Run tests
.\dev-helper.ps1 test-e2e

# Open controller test page
.\dev-helper.ps1 controller

# Validate implementation
.\validate-implementation.ps1
```

### Test Page

Open `timeline-controller-test.html` for a standalone test environment that demonstrates all controller features.

## 📈 Dimension Tracking

### Categories

- **Visible**: Dimensions from the main chart element (what user can actually see)
- **Total**: Dimensions from the `data-testid="timeline-chart-container"` element (chart content area)

### Precision

All dimensions are rounded to 2 decimal places for consistency.

### ResizeObserver

Automatic updates trigger dimension change callbacks when:

- Chart container is resized
- Timeline chart container is resized
- Viewport changes
- CSS layout modifications occur

## 🏄 Scroll Control

### Overview

The controller provides programmatic scroll control that's managed at the React component level to survive re-renders. The scroll position is maintained in component state and applied via DOM manipulation.

### Features

- **Position-based scrolling**: Use values from 0 (start) to 1 (end)
- **Convenience methods**: Quick access to common positions
- **State persistence**: Scroll position survives component re-renders
- **Smooth integration**: Works with existing ResizeObserver and dimension tracking

### Usage Examples

```tsx
// Scroll to specific positions
chartRef.current.scrollTo(0); // Beginning
chartRef.current.scrollTo(0.25); // 25% from start
chartRef.current.scrollTo(0.5); // Middle
chartRef.current.scrollTo(0.75); // 75% from start
chartRef.current.scrollTo(1); // End

// Convenience methods
chartRef.current.scrollToStart(); // Same as scrollTo(0)
chartRef.current.scrollToCenter(); // Same as scrollTo(0.5)
chartRef.current.scrollToEnd(); // Same as scrollTo(1)
```

### How It Works

1. **Controller Interface**: Exposes scroll methods that accept 0-1 position values
2. **React State Management**: Scroll position stored in component state
3. **Callback System**: Controller calls React component to update scroll state
4. **DOM Application**: useEffect applies scroll position to container element
5. **Persistence**: Scroll position survives re-renders and component updates

## 🔮 Future Enhancements

The controller system is designed to be extensible:

- Additional chart types can implement the `ChartController` interface
- Factory pattern supports creating different controller types
- Event system can be expanded for more chart interactions

## 🐛 Troubleshooting

### Common Issues

1. **Controller not initialized**: Ensure the component has mounted before accessing
2. **Dimension callbacks not firing**: Check that ResizeObserver is supported
3. **Element references missing**: Verify component re-render handling

### Debug Tips

```typescript
// Enable debug logging
console.log("Controller state:", chartRef.current.getChartInfo());
console.log("Bar elements:", chartRef.current.getAllBarElements().size);
console.log("Dimensions:", chartRef.current.getDimensions());
```

---

**Built for Windows with PowerShell** 🪟
**Tested on Mobile (480px) and Desktop (1600px)** 📱💻
**Accessibility-First Design** ♿
