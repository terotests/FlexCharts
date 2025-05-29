/**
 * Controller class for TimeLineChart component
 * Provides programmatic access to chart state and operations
 */
export class TimeLineChartController {
  private _chartId: string;
  private _isInitialized: boolean = false;
  private _startDate: string = "";
  private _endDate: string = "";
  private _barCount: number = 0;
  private _chartElement: HTMLElement | null = null;
  private _containerElement: HTMLElement | null = null;
  private _barElements: Map<string | number, HTMLElement> = new Map();
  private _timeSlotElements: HTMLElement[] = [];
  private _resizeObserver: ResizeObserver | null = null;
  private _dimensionChangeCallbacks: ((dimensions: {
    visible: { width: number; height: number } | null;
    total: { width: number; height: number } | null;
  }) => void)[] = [];
  private _lastDimensions: {
    visible: { width: number; height: number } | null;
    total: { width: number; height: number } | null;
  } = { visible: null, total: null };
  private _scrollToCallback: ((position: number) => void) | null = null;
  private _scrollPositionChangeCallbacks: ((position: number) => void)[] = [];

  constructor(chartId: string = "") {
    this._chartId =
      chartId ||
      `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Initialize ResizeObserver if available
    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(this._handleResize.bind(this));
    }
  }

  /**
   * Initialize the controller with chart data
   */
  initialize(
    startDate: string,
    endDate: string,
    barCount: number,
    element: HTMLElement | null = null
  ): void {
    this._startDate = startDate;
    this._endDate = endDate;
    this._barCount = barCount;
    this._chartElement = element;
    this._isInitialized = true;
  }

  /**
   * Get the unique chart identifier
   */
  get chartId(): string {
    return this._chartId;
  }

  /**
   * Check if the chart is initialized
   */
  get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * Get the chart's start date
   */
  get startDate(): string {
    return this._startDate;
  }

  /**
   * Get the chart's end date
   */
  get endDate(): string {
    return this._endDate;
  }

  /**
   * Get the number of bars in the chart
   */
  get barCount(): number {
    return this._barCount;
  }

  /**
   * Get the chart's DOM element
   */
  get chartElement(): HTMLElement | null {
    return this._chartElement;
  }
  /**
   * Get chart dimensions if element is available
   */
  getDimensions(): {
    visible: { width: number; height: number } | null;
    total: { width: number; height: number } | null;
  } {
    if (!this._chartElement) {
      return {
        visible: null,
        total: null,
      };
    }

    const rect = this._chartElement.getBoundingClientRect();

    // Visible area (what user can actually see - excludes hidden overflow)
    const visibleWidth = parseFloat(rect.width.toFixed(2));
    const visibleHeight = parseFloat(rect.height.toFixed(2));

    // Total area should be derived from the container element if available
    let totalWidth: number;
    let totalHeight: number;

    if (this._containerElement) {
      const containerRect = this._containerElement.getBoundingClientRect();
      totalWidth = parseFloat(
        (this._containerElement.scrollWidth || containerRect.width).toFixed(2)
      );
      totalHeight = parseFloat(
        (this._containerElement.scrollHeight || containerRect.height).toFixed(2)
      );
    } else {
      // Fallback to chart element if container not available
      totalWidth = parseFloat(
        (this._chartElement.scrollWidth || rect.width).toFixed(2)
      );
      totalHeight = parseFloat(
        (this._chartElement.scrollHeight || rect.height).toFixed(2)
      );
    }

    return {
      visible: {
        width: visibleWidth,
        height: visibleHeight,
      },
      total: {
        width: totalWidth,
        height: totalHeight,
      },
    };
  }
  /**
   * Get basic chart information
   */
  getChartInfo(): {
    chartId: string;
    isInitialized: boolean;
    startDate: string;
    endDate: string;
    barCount: number;
    dimensions: {
      visible: { width: number; height: number } | null;
      total: { width: number; height: number } | null;
    };
  } {
    return {
      chartId: this._chartId,
      isInitialized: this._isInitialized,
      startDate: this._startDate,
      endDate: this._endDate,
      barCount: this._barCount,
      dimensions: this.getDimensions(),
    };
  }
  /**
   * Reset the controller
   */
  reset(): void {
    // Clean up resize observer
    if (this._resizeObserver && this._chartElement) {
      this._resizeObserver.unobserve(this._chartElement);
    }
    if (this._resizeObserver && this._containerElement) {
      this._resizeObserver.unobserve(this._containerElement);
    }

    this._isInitialized = false;
    this._startDate = "";
    this._endDate = "";
    this._barCount = 0;
    this._chartElement = null;
    this._containerElement = null;
    this._barElements.clear();
    this._timeSlotElements = [];
    this._dimensionChangeCallbacks = [];
    this._lastDimensions = { visible: null, total: null };
  }
  /**
   * Update chart element reference
   */
  updateElement(element: HTMLElement | null): void {
    // Remove old observer if exists
    if (this._resizeObserver && this._chartElement) {
      this._resizeObserver.unobserve(this._chartElement);
    }

    this._chartElement = element;

    // Add new observer if element exists
    if (this._resizeObserver && this._chartElement) {
      this._resizeObserver.observe(this._chartElement);
    }

    // Trigger dimension update
    this._updateDimensions();
  }

  /**
   * Update container element reference (for total dimensions)
   */
  updateContainerElement(element: HTMLElement | null): void {
    // Remove old observer if exists
    if (this._resizeObserver && this._containerElement) {
      this._resizeObserver.unobserve(this._containerElement);
    }

    this._containerElement = element;

    // Add new observer if element exists
    if (this._resizeObserver && this._containerElement) {
      this._resizeObserver.observe(this._containerElement);
    }

    // Trigger dimension update
    this._updateDimensions();
  }

  /**
   * Add or update a bar element reference
   */
  addBarElement(barId: string | number, element: HTMLElement): void {
    this._barElements.set(barId, element);
  }

  /**
   * Remove a bar element reference
   */
  removeBarElement(barId: string | number): void {
    this._barElements.delete(barId);
  }

  /**
   * Get a specific bar element
   */
  getBarElement(barId: string | number): HTMLElement | undefined {
    return this._barElements.get(barId);
  }

  /**
   * Get all bar elements
   */
  getAllBarElements(): Map<string | number, HTMLElement> {
    return new Map(this._barElements);
  }

  /**
   * Update time slot elements
   */
  updateTimeSlotElements(elements: HTMLElement[]): void {
    this._timeSlotElements = [...elements];
  }

  /**
   * Get all time slot elements
   */
  getTimeSlotElements(): HTMLElement[] {
    return [...this._timeSlotElements];
  }
  /**
   * Add a callback for dimension changes
   */
  onDimensionChange(
    callback: (dimensions: {
      visible: { width: number; height: number } | null;
      total: { width: number; height: number } | null;
    }) => void
  ): () => void {
    this._dimensionChangeCallbacks.push(callback);

    // Immediately fire the callback with current dimensions
    try {
      const currentDimensions = this.getDimensions();
      callback(currentDimensions);
    } catch (error) {
      console.warn("Error in initial dimension change callback:", error);
    }

    // Return unsubscribe function
    return () => {
      const index = this._dimensionChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this._dimensionChangeCallbacks.splice(index, 1);
      }
    };
  }
  /**
   * Handle resize events
   */
  private _handleResize(entries: ResizeObserverEntry[]): void {
    for (const entry of entries) {
      if (
        entry.target === this._chartElement ||
        entry.target === this._containerElement
      ) {
        this._updateDimensions();
        break;
      }
    }
  }

  /**
   * Update dimensions and notify callbacks
   */
  private _updateDimensions(): void {
    const newDimensions = this.getDimensions();

    // Check if dimensions actually changed
    const hasChanged = !this._dimensionsEqual(
      this._lastDimensions,
      newDimensions
    );

    if (hasChanged) {
      this._lastDimensions = newDimensions;

      // Notify all callbacks
      this._dimensionChangeCallbacks.forEach((callback) => {
        try {
          callback(newDimensions);
        } catch (error) {
          console.warn("Error in dimension change callback:", error);
        }
      });
    }
  }

  /**
   * Compare two dimension objects for equality
   */
  private _dimensionsEqual(
    a: {
      visible: { width: number; height: number } | null;
      total: { width: number; height: number } | null;
    },
    b: {
      visible: { width: number; height: number } | null;
      total: { width: number; height: number } | null;
    }
  ): boolean {
    if (
      a.visible === null &&
      b.visible === null &&
      a.total === null &&
      b.total === null
    ) {
      return true;
    }

    if (
      a.visible === null ||
      b.visible === null ||
      a.total === null ||
      b.total === null
    ) {
      return false;
    }

    return (
      a.visible.width === b.visible.width &&
      a.visible.height === b.visible.height &&
      a.total.width === b.total.width &&
      a.total.height === b.total.height
    );
  }
  /**
   * Force recalculation of dimensions
   */
  recalculateDimensions(): void {
    this._updateDimensions();
  }
  /**
   * Set callback for scroll position changes from controller
   */
  setScrollToCallback(callback: (position: number) => void): void {
    this._scrollToCallback = callback;
  }

  /**
   * Subscribe to scroll position changes
   */
  onScrollPositionChange(callback: (position: number) => void): () => void {
    this._scrollPositionChangeCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this._scrollPositionChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this._scrollPositionChangeCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify scroll position change (called from React component)
   */
  notifyScrollPositionChange(position: number): void {
    this._scrollPositionChangeCallbacks.forEach((callback) => {
      try {
        callback(position);
      } catch (error) {
        console.error("Error in scroll position change callback:", error);
      }
    });
  }

  /**
   * Scroll to a specific position (0-1, where 0 is start, 1 is end)
   * This calls the React component's scroll handler
   */
  scrollTo(position: number): void {
    if (position < 0 || position > 1) {
      throw new Error("Scroll position must be between 0 and 1");
    }

    if (this._scrollToCallback) {
      this._scrollToCallback(position);
    } else {
      console.warn(
        "ScrollTo callback not set. Make sure the component is mounted and initialized."
      );
    }
  }

  /**
   * Scroll to the beginning of the chart (position 0)
   */
  scrollToStart(): void {
    this.scrollTo(0);
  }

  /**
   * Scroll to the end of the chart (position 1)
   */
  scrollToEnd(): void {
    this.scrollTo(1);
  }

  /**
   * Scroll to the middle of the chart (position 0.5)
   */
  scrollToCenter(): void {
    this.scrollTo(0.5);
  }
}

/**
 * Generic Chart interface for future chart types
 */
export interface ChartController {
  chartId: string;
  isInitialized: boolean;
  getChartInfo(): {
    chartId: string;
    isInitialized: boolean;
    [key: string]: unknown;
  };
  reset(): void;
}

/**
 * Factory function to create chart controllers
 */
export function createChartController(
  type: "timeline"
): TimeLineChartController {
  switch (type) {
    case "timeline":
      return new TimeLineChartController();
    default:
      throw new Error(`Unknown chart type: ${type}`);
  }
}
