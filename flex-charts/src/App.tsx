import { useChartTheme } from "./lib";
import "./App.css";
import { useRef, useEffect, useState } from "react";

import {
  TimeLineChart,
  type BarClickData,
} from "./lib/components/TimeLineChart";
import { TimeLineChartController } from "./lib/controllers/TimeLineChartController";
import { customBars } from "./lib/data/customBars";

function App() {
  const { theme, toggleTheme } = useChartTheme();
  const chartRef = useRef<TimeLineChartController>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [dimensions, setDimensions] = useState<{
    visible: { width: number; height: number } | null;
    total: { width: number; height: number } | null;
  } | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Custom bar data for the first TimeLineChart with colors

  useEffect(() => {
    // Demonstrate accessing chart controller after mount
    const timer = setTimeout(() => {
      if (chartRef.current) {
        console.log("Chart Controller Info:", chartRef.current.getChartInfo());
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // Bind to chart ref
  useEffect(() => {
    if (chartRef.current) {
      // Example of subscribing to dimension changes
      const unsubscribeDimensions = chartRef.current.onDimensionChange(
        (newDimensions) => {
          console.log("Dimensions changed:", newDimensions);
          setDimensions(newDimensions);

          // Show scroll buttons if total width is larger than visible width
          const shouldShowButtons =
            newDimensions.visible &&
            newDimensions.total &&
            newDimensions.total.width > newDimensions.visible.width;

          setShowScrollButtons(!!shouldShowButtons);
        }
      );

      // Subscribe to scroll position changes
      const unsubscribeScroll = chartRef.current.onScrollPositionChange(
        (position) => {
          setScrollPosition(position);
        }
      );

      // Cleanup subscriptions on unmount
      return () => {
        unsubscribeDimensions();
        unsubscribeScroll();
        console.log("Chart subscriptions cleaned up");
      };
    }
  }, []);
  const handleShowChartInfo = () => {
    if (chartRef.current) {
      const info = chartRef.current.getChartInfo();
      const dimensionsText =
        info.dimensions.visible && info.dimensions.total
          ? `Visible: ${info.dimensions.visible.width.toFixed(
              2
            )}px × ${info.dimensions.visible.height.toFixed(2)}px
Total: ${info.dimensions.total.width.toFixed(
              2
            )}px × ${info.dimensions.total.height.toFixed(2)}px`
          : "Not available";

      alert(`Chart Controller Info:
ID: ${info.chartId}
Initialized: ${info.isInitialized}
Bars Count: ${info.barCount}
Date Range: ${info.startDate} - ${info.endDate}
Dimensions:
${dimensionsText}`);
    }
  };

  const handleScrollToStart = () => {
    if (chartRef.current) {
      chartRef.current.scrollToStart();
    }
  };

  const handleScrollToEnd = () => {
    if (chartRef.current) {
      chartRef.current.scrollToEnd();
    }
  };
  const handleScrollToCenter = () => {
    if (chartRef.current) {
      chartRef.current.scrollToCenter();
    }
  };

  const handleBarClick = (clickData: BarClickData) => {
    const { bar, relativePosition, dimensions, controller } = clickData;

    // Scroll to center the clicked bar using the controller from click data
    controller.scrollTo(relativePosition.center);
    console.log(
      `Scrolling to center bar "${bar.label}" at position ${(
        relativePosition.center * 100
      ).toFixed(1)}%`
    );

    const message = `Bar Clicked: ${bar.label}
ID: ${bar.id}
Time Range: ${bar.start} - ${bar.end}
Relative Position: ${(relativePosition.start * 100).toFixed(1)}% - ${(
      relativePosition.end * 100
    ).toFixed(1)}%
Center Position: ${(relativePosition.center * 100).toFixed(1)}%
Bar Dimensions: ${dimensions.width.toFixed(0)}px × ${dimensions.height.toFixed(
      0
    )}px
Chart Dimensions: ${dimensions.chartWidth.toFixed(
      0
    )}px × ${dimensions.chartHeight.toFixed(0)}px
Screen Position: ${dimensions.left.toFixed(0)}, ${dimensions.top.toFixed(0)}

🎯 Chart scrolled to center this bar using controller from click data!`;

    console.log(message);
    console.log("Bar click data:", clickData);
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
        {showScrollButtons && dimensions && (
          <div
            className="scroll-controls"
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <button
              onClick={handleScrollToStart}
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ← Start
            </button>
            <button
              onClick={handleScrollToCenter}
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ↔ Center
            </button>
            <button
              onClick={handleScrollToEnd}
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              End →
            </button>
          </div>
        )}
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
            onBarClick={handleBarClick}
            renderTitle={(time) => `${time.value.toString().slice(2, 4)}`}
          />
        </div>
        {/* Chart Controls - moved below chart for better UX */}
        <div
          className="chart-controls"
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid #eaeaea",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: "bold" }}>
            Chart Controls:
          </span>
          <button
            onClick={toggleTheme}
            style={{
              padding: "8px 12px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: theme.mode === "light" ? "#6c757d" : "#f8f9fa",
              color: theme.mode === "light" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {theme.mode === "light" ? "🌙" : "☀️"}{" "}
            {theme.mode === "light" ? "Dark" : "Light"} Theme
          </button>
          <button
            onClick={handleShowChartInfo}
            style={{
              padding: "8px 12px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            📊 Chart Info
          </button>
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
