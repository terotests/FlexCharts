import React, { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { TimeLineChart } from "./lib/components/TimeLineChart";
import { TimeLineChartController } from "./lib/controllers/TimeLineChartController";
import "./index.css";
import { customBars } from "./lib/data/customBars";

export const TestApp: React.FC = () => {
  const chartRef = useRef<TimeLineChartController>(null);

  useEffect(() => {
    // Example of accessing chart controller after component mounts
    const timer = setTimeout(() => {
      if (chartRef.current) {
        const chartInfo = chartRef.current.getChartInfo();
        console.log("Chart Info:", chartInfo);
        console.log("Chart Dimensions:", chartRef.current.getDimensions());
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  const handleGetChartInfo = () => {
    if (chartRef.current) {
      const info = chartRef.current.getChartInfo();
      alert(`Chart Info:
ID: ${info.chartId}
Bars: ${info.barCount}
Date Range: ${info.startDate} - ${info.endDate}
Dimensions: ${
        info.dimensions
          ? `${info.dimensions.width.toFixed(
              2
            )}px × ${info.dimensions.height.toFixed(2)}px`
          : "Not available"
      }`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>TimeLineChart Test Page</h1>
      <button
        onClick={handleGetChartInfo}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Get Chart Info
      </button>
      <div data-testid="timeline-chart-container">
        <TimeLineChart
          ref={chartRef}
          startDate="1992"
          endDate="12/2025"
          interval="Y"
          width="100%"
          labelFontSize="10px"
          key="1"
          bars={customBars}
          renderTitle={(time) => `${time.value.toString().slice(2, 4)}`}
        />
      </div>
    </div>
  );
};

const container = document.getElementById("timeline-test-root");
if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
}
