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
  type ChartHoverData,
} from "./components/TimeLineChart";

// Controllers
export {
  TimeLineChartController,
  createChartController,
  type ChartController,
} from "./controllers/TimeLineChartController";

// Utilities
export { useChartTheme } from "./hooks/useChartTheme";

// Types
export type { ChartData, ChartOptions } from "./types";
