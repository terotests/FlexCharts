/**
 * Common types used throughout the chart library
 */

/**
 * Data structure for chart data
 */
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

/**
 * Common chart options shared across different chart types
 */
export interface ChartOptions {
  width?: number;
  height?: number;
  title?: string;
  legend?: {
    show: boolean;
    position: "top" | "bottom" | "left" | "right";
  };
  animation?: {
    enabled: boolean;
    duration: number;
  };
  responsive?: boolean;
}
