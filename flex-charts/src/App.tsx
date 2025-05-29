import { useChartTheme } from "./lib";
import "./App.css";
import { useRef, useEffect } from "react";

import { TimeLineChart } from "./lib/components/TimeLineChart";
import { TimeLineChartController } from "./lib/controllers/TimeLineChartController";
import { customBars } from "./lib/data/customBars";

function App() {
  const { theme, toggleTheme } = useChartTheme();
  const chartRef = useRef<TimeLineChartController>(null);

  // Custom bar data for the first TimeLineChart with colors

  useEffect(() => {
    // Demonstrate accessing chart controller after mount
    const timer = setTimeout(() => {
      if (chartRef.current) {
        console.log("Chart Controller Info:", chartRef.current.getChartInfo());
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  const handleShowChartInfo = () => {
    if (chartRef.current) {
      const info = chartRef.current.getChartInfo();
      alert(`Chart Controller Info:
ID: ${info.chartId}
Initialized: ${info.isInitialized}
Bars Count: ${info.barCount}
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
    <div
      className="app"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        height: "100%",
      }}
    >
      {" "}
      <header>
        <h1>FlexCharts Demo</h1>
        <div className="controls">
          <button onClick={toggleTheme}>
            Switch to {theme.mode === "light" ? "Dark" : "Light"} Mode
          </button>
          <button onClick={handleShowChartInfo} style={{ marginLeft: "10px" }}>
            Show Chart Info
          </button>
        </div>
      </header>
      <main>
        {" "}
        <div className="chart-container">
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
        <div className="code-example">
          <h2>Example Code</h2>
          <pre>
            <code>
              {`import { TimeLineChart, type TimeLineBarData } from 'flex-charts';

const timelineBars: TimeLineBarData[] = [
  {
    id: 1,
    start: "01/2020",
    end: "12/2022",
    label: "Project Alpha",
    backgroundColor: "#3b82f6",
    textColor: "white"
  },
  {
    id: 2,
    start: "06/2021",
    end: "03/2024",
    label: "Project Beta",
    backgroundColor: "#ef4444",
    textColor: "white"
  }
];

function Timeline() {
  return (
    <TimeLineChart
      startDate="2020"
      endDate="2025"
      interval="Y"
      width="800px"
      labelFontSize="12px"
      bars={timelineBars}
      renderTitle={(time) => \`'\${time.value.toString().slice(2, 4)}\`}
    />
  );
}`}
            </code>
          </pre>
        </div>
      </main>
    </div>
  );
}

export default App;
