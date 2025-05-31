import { useChartTheme } from "./lib";
import "./App.css";
import { useRef, useEffect, useState } from "react";

import {
  TimeLineChart,
  type BarClickData,
  type RowClickData,
  type ChartHoverData,
  type BarRenderContext,
} from "./lib/components/TimeLineChart";
import { TimeLineChartController } from "./lib/controllers/TimeLineChartController";
import { customBars } from "./lib/data/customBars";
import {
  britishMonarchs,
  britishMonarchsMetadata,
} from "./lib/data/britishMonarchs";
import {
  finnishPresidents,
  finnishPresidentsMetadata,
} from "./lib/data/finnishPresidents";
import {
  type TTimeInterval,
  type TTimeIntervalTypeWithDecades,
} from "./lib/time";

// Dataset options for the dropdown
const datasetOptions = [
  {
    id: "custom",
    name: "Custom Projects",
    data: customBars,
    startDate: "1992",
    endDate: "12/2025",
    interval: "Y" as const,
    renderTitle: (time: TTimeInterval) =>
      `${time.value.toString().slice(0, 4)}`,
  },
  {
    id: "monarchs",
    name: "British Monarchs (1558-2025)",
    data: britishMonarchs,
    startDate: britishMonarchsMetadata.startDate,
    endDate: britishMonarchsMetadata.endDate,
    interval: britishMonarchsMetadata.interval,
    renderTitle: (time: TTimeInterval) => `${time.value}`,
  },
  {
    id: "finnish-presidents",
    name: "Finnish Presidents (1919-2025)",
    data: finnishPresidents,
    startDate: finnishPresidentsMetadata.startDate,
    endDate: finnishPresidentsMetadata.endDate,
    interval: finnishPresidentsMetadata.interval,
    renderTitle: (time: TTimeInterval) => `${time.value}`,
  },
  {
    id: "monarchs-decades",
    name: "British Monarchs by Decades",
    data: britishMonarchs,
    startDate: "1550",
    endDate: "2050",
    interval: "10Y" as TTimeIntervalTypeWithDecades,
    renderTitle: (time: TTimeInterval) => `${time.value}s`,
  },
  {
    id: "monarchs-centuries",
    name: "British Monarchs by Half-Centuries",
    data: britishMonarchs,
    startDate: "1550",
    endDate: "2030",
    interval: "50Y" as TTimeIntervalTypeWithDecades,
    renderTitle: (time: TTimeInterval) => `${time.value}-${time.value + 49}`,
  },
];

// Interval options for the dropdown
const intervalOptions: {
  value: TTimeIntervalTypeWithDecades;
  label: string;
  description: string;
}[] = [
  { value: "Y", label: "Years", description: "Annual intervals" },
  { value: "Q", label: "Quarters", description: "Quarterly intervals" },
  { value: "M", label: "Months", description: "Monthly intervals" },
  { value: "5Y", label: "5 Years", description: "5-year intervals" },
  { value: "10Y", label: "Decades", description: "10-year intervals" },
  { value: "50Y", label: "Half-Centuries", description: "50-year intervals" },
  { value: "100Y", label: "Centuries", description: "100-year intervals" },
];

function App() {
  const { theme, toggleTheme } = useChartTheme();
  const chartRef = useRef<TimeLineChartController>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(datasetOptions[0]);
  const [customInterval, setCustomInterval] =
    useState<TTimeIntervalTypeWithDecades>(datasetOptions[0].interval);
  const [dimensions, setDimensions] = useState<{
    visible: { width: number; height: number } | null;
    total: { width: number; height: number } | null;
  } | null>(null);
  const [_, setCurrentScrollPosition] = useState(0);
  const [hoverInfo, setHoverInfo] = useState<ChartHoverData | null>(null);

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
          setCurrentScrollPosition(position);
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

  const handleRowClick = (clickData: RowClickData) => {
    const { bar, relativePosition, dimensions } = clickData;

    // Create a comprehensive message about the row click
    const message = `🎯 Row Clicked!
Bar: ${bar.label}
ID: ${bar.id}
Time Range: ${bar.start} - ${bar.end}
Relative Position: ${(relativePosition.start * 100).toFixed(1)}% - ${(
      relativePosition.end * 100
    ).toFixed(1)}%
Center Position: ${(relativePosition.center * 100).toFixed(1)}%
Row Container Dimensions: ${dimensions.width.toFixed(
      0
    )}px × ${dimensions.height.toFixed(0)}px
Chart Dimensions: ${dimensions.chartWidth.toFixed(
      0
    )}px × ${dimensions.chartHeight.toFixed(0)}px
Screen Position: ${dimensions.left.toFixed(0)}, ${dimensions.top.toFixed(0)}

🎯 Row click detected - scrolling to start of chart!`;
    console.log(message);
    console.log("Row click data:", clickData);

    // Demonstrate different behavior from bar click - scroll to start

    const dims = clickData.controller.getDimensions();
    const visibleWidth =
      (dims.visible?.width || 100) / (dims.total?.width || 1) || 0;

    console.log("visibleWidth:", visibleWidth);

    if (relativePosition.center < visibleWidth * 0.5) {
      clickData.controller.scrollTo(0);
    } else {
      if (relativePosition.center > 1 - visibleWidth * 0.5) {
        clickData.controller.scrollTo(1);
      } else {
        clickData.controller.scrollTo(relativePosition.center);
      }
    }
  };

  const handleChartHover = (hoverData: ChartHoverData) => {
    setHoverInfo(hoverData);

    // Optional: Log hover information to console for debugging
    console.log(
      `Hovering at ${(hoverData.relativePosition * 100).toFixed(1)}% - ` +
        `Time Slot: ${hoverData.activeTimeSlot?.value || "None"} ` +
        `(Index: ${hoverData.activeTimeSlot?.index ?? "N/A"})`
    );
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
        )}{" "}
      </header>
      {/* Dataset Selector */}
      <div
        className="dataset-selector"
        style={{
          padding: "20px 0",
          borderBottom: "1px solid #eaeaea",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              minWidth: "120px",
            }}
          >
            📊 Select Dataset:
          </label>
          <select
            value={selectedDataset.id}
            onChange={(e) => {
              const newDataset = datasetOptions.find(
                (opt) => opt.id === e.target.value
              );
              if (newDataset) {
                setSelectedDataset(newDataset);
                setCustomInterval(newDataset.interval); // Update interval when dataset changes
              }
            }}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              borderRadius: "4px",
              border: `1px solid ${theme.mode === "light" ? "#ddd" : "#555"}`,
              backgroundColor: theme.mode === "light" ? "white" : "#2d3748",
              color: theme.mode === "light" ? "black" : "white",
              minWidth: "200px",
            }}
          >
            {datasetOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {/* Interval Selector */}
          <label
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              minWidth: "80px",
              marginLeft: "20px",
            }}
          >
            ⏱️ Interval:
          </label>
          <select
            value={customInterval}
            onChange={(e) => {
              setCustomInterval(e.target.value as TTimeIntervalTypeWithDecades);
            }}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              borderRadius: "4px",
              border: `1px solid ${theme.mode === "light" ? "#ddd" : "#555"}`,
              backgroundColor: theme.mode === "light" ? "white" : "#2d3748",
              color: theme.mode === "light" ? "black" : "white",
              minWidth: "120px",
            }}
          >
            {intervalOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                title={option.description}
              >
                {option.label}
              </option>
            ))}
          </select>{" "}
          {/* Show color legend for British Monarchs */}
          {selectedDataset.id === "monarchs" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "12px",
                fontSize: "12px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontWeight: "bold" }}>Houses:</span>
              {Object.entries(britishMonarchsMetadata.colorLegend).map(
                ([color, house]) => (
                  <div
                    key={color}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: color,
                        borderRadius: "2px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <span style={{ fontSize: "11px" }}>{house}</span>
                  </div>
                )
              )}
            </div>
          )}
          {/* Show color legend for Finnish Presidents */}
          {selectedDataset.id === "finnish-presidents" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "12px",
                fontSize: "12px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontWeight: "bold" }}>Presidents:</span>
              {Object.entries(finnishPresidentsMetadata.colorLegend).map(
                ([color, president]) => (
                  <div
                    key={color}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: color,
                        borderRadius: "2px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <span style={{ fontSize: "11px" }}>{president}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <main>
        {" "}
        <div className={`chart-container ${selectedDataset.id}`}>
          {" "}
          <TimeLineChart
            ref={chartRef}
            startDate={selectedDataset.startDate}
            endDate={selectedDataset.endDate}
            interval={customInterval}
            width="80%"
            labelFontSize="10px"
            key={selectedDataset.id} // Force re-render when dataset changes
            bars={selectedDataset.data}
            onBarClick={handleBarClick}
            onRowClick={handleRowClick}
            onChartHover={handleChartHover}
            renderTitle={selectedDataset.renderTitle} // Custom render functions
            renderRowPrefix={(context: BarRenderContext) => (
              <div
                style={{
                  fontSize: "10px",
                  color: theme.mode === "light" ? "#666" : "#aaa",
                  minWidth: "50px",
                  textAlign: "left",
                  paddingRight: "8px",
                  fontWeight: "bold",
                  pointerEvents: "auto", // Enable interactions since it's positioned absolutely
                }}
                title={`Bar ${context.bar.id} - Duration: ${context.bar.start} to ${context.bar.end}`}
              >
                {context.bar.label}
              </div>
            )}
            renderBarSuffix={(context: BarRenderContext) => (
              <div
                style={{
                  fontSize: "9px",
                  color: theme.mode === "light" ? "#888" : "#ccc",
                  marginLeft: "8px",
                  padding: "2px 6px",
                  backgroundColor:
                    theme.mode === "light" ? "#f0f0f0" : "#404040",
                  borderRadius: "3px",
                  whiteSpace: "nowrap",
                }}
                title={`Duration: ${context.bar.start} to ${context.bar.end}`}
              >
                {(() => {
                  // Calculate duration in years
                  const startYear = parseInt(
                    context.bar.start.toString().slice(0, 4)
                  );
                  const endYear = parseInt(
                    context.bar.end.toString().slice(0, 4)
                  );
                  const duration = endYear - startYear + 1;
                  return `${duration}yr${duration !== 1 ? "s" : ""}`;
                })()}
              </div>
            )}
            renderBarContent={(context: BarRenderContext) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0 8px",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              >
                <span style={{ flexShrink: 0 }}>{context.bar.label}</span>
                {context.dimensions.width > 100 && (
                  <span
                    style={{
                      fontSize: "9px",
                      opacity: 0.8,
                      marginLeft: "8px",
                      flexShrink: 0,
                    }}
                  >
                    ({context.bar.start.toString().slice(0, 4)}-
                    {context.bar.end.toString().slice(0, 4)})
                  </span>
                )}
              </div>
            )}
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
            {" "}
            📊 Chart Info
          </button>
        </div>
        {/* Hover Information Display */}
        {hoverInfo && (
          <div
            className="hover-info"
            style={{
              padding: "10px",
              backgroundColor: theme.mode === "light" ? "#f8f9fa" : "#2d3748",
              border: `1px solid ${
                theme.mode === "light" ? "#dee2e6" : "#4a5568"
              }`,
              borderRadius: "4px",
              marginBottom: "20px",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
              🎯 Chart Hover Info
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "4px 12px",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "bold" }}>Position:</span>
              <span>{(hoverInfo.relativePosition * 100).toFixed(1)}%</span>

              <span style={{ fontWeight: "bold" }}>Pixel Position:</span>
              <span>
                ({hoverInfo.pixelPosition.x.toFixed(0)},{" "}
                {hoverInfo.pixelPosition.y.toFixed(0)})
              </span>

              {hoverInfo.activeTimeSlot && (
                <>
                  <span style={{ fontWeight: "bold" }}>Time Slot:</span>
                  <span>{hoverInfo.activeTimeSlot.value}</span>

                  <span style={{ fontWeight: "bold" }}>Slot Index:</span>
                  <span>{hoverInfo.activeTimeSlot.index}</span>

                  <span style={{ fontWeight: "bold" }}>Slot Range:</span>
                  <span>
                    {(hoverInfo.activeTimeSlot.start * 100).toFixed(1)}% -{" "}
                    {(hoverInfo.activeTimeSlot.end * 100).toFixed(1)}%
                  </span>
                </>
              )}
            </div>
          </div>
        )}
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

export default App;
