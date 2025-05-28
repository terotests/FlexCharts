import { useState } from "react";
import { LineChart, useChartTheme, type ChartData } from "./lib";
import "./App.css";

import { DateRange } from "./lib/components/DateRange";

function App() {
  const { theme, toggleTheme } = useChartTheme();
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // Example data
  const data: ChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Dataset 1",
        data: [65, 59, 80, 81, 56, 55],
        color: theme.colors.primary[0],
      },
      {
        label: "Dataset 2",
        data: [28, 48, 40, 19, 86, 27],
        color: theme.colors.primary[1],
      },
    ],
  };

  const chartOptions = {
    width: 600,
    height: 400,
    title: "FlexCharts Example",
    legend: {
      show: true,
      position: "top" as const,
    },
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
      <header>
        <h1>FlexCharts Playground</h1>
        <div className="controls">
          <button onClick={toggleTheme}>
            Switch to {theme.mode === "light" ? "Dark" : "Light"} Mode
          </button>
          <div className="chart-type-selector">
            <button
              onClick={() => setChartType("line")}
              className={chartType === "line" ? "active" : ""}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={chartType === "bar" ? "active" : ""}
            >
              Bar Chart
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="chart-container">
          <DateRange
            startDate="1992"
            endDate="12/2025"
            interval="Y"
            width="1000px"
            labelFontSize="10px"
            key="1"
            renderTitle={(time) => `${time.value.toString().slice(2, 4)}`}
          />

          <DateRange startDate="2010" endDate="12/2025" interval="Y" key="2" />
        </div>

        <div className="code-example">
          <h2>Example Code</h2>
          <pre>
            <code>
              {`import { ${
                chartType === "line" ? "LineChart" : "BarChart"
              } } from 'flex-charts';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [65, 59, 80, 81, 56, 55],
    },
    {
      label: 'Dataset 2',
      data: [28, 48, 40, 19, 86, 27],
    },
  ],
};

function MyChart() {
  return (
    <${chartType === "line" ? "LineChart" : "BarChart"} 
      data={data}
      options={{
        width: 600,
        height: 400,
        title: 'My Chart',
      }}
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
