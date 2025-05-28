/**
 * FlexCharts - A flexible chart library for React
 *
 * This is the main entry point for the library.
 * All components and utilities should be exported from here.
 */

// Components
export { LineChart } from "./components/LineChart";
export {
  TimeLineChart,
  type TimeLineBarData,
} from "./components/TimeLineChart";

// Utilities
export { useChartTheme } from "./hooks/useChartTheme";

// Types
export type { ChartData, ChartOptions } from "./types";
