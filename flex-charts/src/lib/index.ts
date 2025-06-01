/**
 * FlexCharts - A flexible chart library for React
 *
 * This is the main entry point for the library.
 * All components and utilities should be exported from here.
 */

// Styles - Import the CSS file so users can access it
import "./components/TimeLineChart.css";

// Components
export { LineChart } from "./components/LineChart";
export {
  TimeLineChart,
  type TimeLineBarData,
  type BarClickData,
  type RowClickData,
  type ChartHoverData,
  type BarRenderContext,
} from "./components/TimeLineChart";

// Controllers
export {
  TimeLineChartController,
  createChartController,
  type ChartController,
} from "./controllers/TimeLineChartController";

// Utilities
export { useChartTheme } from "./hooks/useChartTheme";
export { TimeInterval, TimeSpan, Time } from "./TimeInterval";
export { toString as timeToString } from "./time";

// Types
export type { ChartData, ChartOptions } from "./types";
export type {
  TTimeInterval,
  TTimeIntervalType,
  TTimeIntervalTypeWithDecades,
  TTimeParserKernel,
  TDelimiter,
} from "./time";
