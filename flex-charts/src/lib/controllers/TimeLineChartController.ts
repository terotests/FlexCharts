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

  constructor(chartId: string = "") {
    this._chartId =
      chartId ||
      `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
  getDimensions(): { width: number; height: number } | null {
    if (!this._chartElement) {
      return null;
    }
    const rect = this._chartElement.getBoundingClientRect();
    return {
      width: parseFloat(rect.width.toFixed(2)),
      height: parseFloat(rect.height.toFixed(2)),
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
    dimensions: { width: number; height: number } | null;
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
    this._isInitialized = false;
    this._startDate = "";
    this._endDate = "";
    this._barCount = 0;
    this._chartElement = null;
  }

  /**
   * Update chart element reference
   */
  updateElement(element: HTMLElement | null): void {
    this._chartElement = element;
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
