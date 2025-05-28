import { useState } from "react";
import { LineChart, useChartTheme, type ChartData } from "./lib";
import "./App.css";

import { DateRange, type BarData } from "./lib/components/DateRange";

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

  // Custom bar data for the first DateRange with colors
  const customBars: BarData[] = [
    {
      id: 1,
      start: "05/1992",
      end: "05/1995",
      label: "Turbo C",
      backgroundColor: "#ff6b6b",
    },
    {
      id: 2,
      start: "05/1992",
      end: "05/1998",
      label: "Pascal",
      backgroundColor: "#4ecdc4",
    },
    {
      id: 3,
      start: "05/1994",
      end: "05/1999",
      label: "x86 Asm (TASM)",
      backgroundColor: "#45b7d1",
    },
    {
      id: 4,
      start: "05/1996",
      end: "05/1998",
      label: "Perl",
      backgroundColor: "#f9ca24",
    },
    {
      id: 5,
      start: "05/1996",
      end: "05/1998",
      label: "Watcom C",
      backgroundColor: "#6c5ce7",
    },
    {
      id: 6,
      start: "05/1998",
      end: "05/2003",
      label: "Visual Studio",
      backgroundColor: "#a29bfe",
    },
    {
      id: 7,
      start: "05/2001",
      end: "08/2005",
      label: "Pascal To C",
      backgroundColor: "#fd79a8",
    },
    {
      id: 8,
      start: "05/2002",
      end: "08/2012",
      label: "Apache HTTP Server",
      backgroundColor: "#e17055",
    },
    {
      id: 9,
      start: "05/2002",
      end: "08/2012",
      label: "MySQL",
      backgroundColor: "#00b894",
    },
    {
      id: 10,
      start: "03/2002",
      end: "06/2014",
      label: "PHP",
      backgroundColor: "#0984e3",
    },
    {
      id: 11,
      start: "03/2006",
      end: "06/2025",
      label: "JavaScript",
      backgroundColor: "#fdcb6e",
    },
    {
      id: 12,
      start: "01/2018",
      end: "12/2022",
      label: "Nginx",
      backgroundColor: "#e84393",
    },
    {
      id: 13,
      start: "01/2018",
      end: "12/2025",
      label: "React",
      backgroundColor: "#00cec9",
    },
    {
      id: 14,
      start: "08/2018",
      end: "06/2025",
      label: "TypeScript",
      backgroundColor: "#6c5ce7",
      textColor: "#ffffff",
    },
    {
      id: 15,
      start: "03/2021",
      end: "06/2025",
      label: "GraphQL",
      backgroundColor: "#fd79a8",
    },
  ];

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
            bars={customBars}
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
