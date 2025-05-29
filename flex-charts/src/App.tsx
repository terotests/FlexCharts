import { useChartTheme } from "./lib";
import "./App.css";

import { TimeLineChart } from "./lib/components/TimeLineChart";
import { customBars } from "./lib/data/customBars";

function App() {
  const { theme, toggleTheme } = useChartTheme();

  // Custom bar data for the first TimeLineChart with colors

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
        <h1>FlexCharts Demo</h1>
        <div className="controls">
          <button onClick={toggleTheme}>
            Switch to {theme.mode === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>
      </header>

      <main>
        <div className="chart-container">
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
