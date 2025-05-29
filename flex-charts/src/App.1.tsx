import { useChartTheme, type TimeLineBarData, TimeLineChart } from "./lib";

export function App() {
  const { theme, toggleTheme } = useChartTheme();

  // Custom bar data for the first TimeLineChart with colors
  const customBars: TimeLineBarData[] = [
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
              {`import { TimeLineChart, type TimeLineBarData } from '@terotests/flex-charts';

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
