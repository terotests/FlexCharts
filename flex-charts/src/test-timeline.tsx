import React from "react";
import { createRoot } from "react-dom/client";
import { TimeLineChart } from "./lib/components/TimeLineChart";
import "./index.css";
import { customBars } from "./lib/data/customBars";

export const TestApp: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>TimeLineChart Test Page</h1>
      <div data-testid="timeline-chart-container">
        <TimeLineChart
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
