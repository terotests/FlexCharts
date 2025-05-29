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

        // Subscribe to dimension changes
        const unsubscribe = chartRef.current.onDimensionChange((dimensions) => {
          console.log("Dimensions changed:", dimensions);
        });

        // Cleanup subscription after 10 seconds
        setTimeout(() => {
          unsubscribe();
          console.log("Dimension change subscription cleaned up");
        }, 10000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  const handleGetChartInfo = () => {
    if (chartRef.current) {
      const info = chartRef.current.getChartInfo();
      const barElements = chartRef.current.getAllBarElements();
      const timeSlotElements = chartRef.current.getTimeSlotElements();

      const dimensionsText =
        info.dimensions.visible && info.dimensions.total
          ? `Visible: ${info.dimensions.visible.width}px × ${info.dimensions.visible.height}px
Total: ${info.dimensions.total.width}px × ${info.dimensions.total.height}px`
          : "Not available";

      alert(`Chart Info:
ID: ${info.chartId}
Bars: ${info.barCount} (DOM Elements: ${barElements.size})
Time Slots: ${timeSlotElements.length} DOM elements
Date Range: ${info.startDate} - ${info.endDate}
Dimensions:
${dimensionsText}`);
    }
  };
  const handleTestControllerFeatures = () => {
    if (chartRef.current) {
      console.log("=== Controller Feature Test ===");

      // Test dimension tracking
      const dimensions = chartRef.current.getDimensions();
      console.log("Current Dimensions:", dimensions);

      // Test bar element access
      const barElements = chartRef.current.getAllBarElements();
      console.log("Bar Elements Count:", barElements.size);
      barElements.forEach((element, id) => {
        console.log(`Bar ${id}:`, element.getBoundingClientRect());
      });

      // Test time slot elements
      const timeSlots = chartRef.current.getTimeSlotElements();
      console.log("Time Slot Elements:", timeSlots.length);

      // Force dimension recalculation
      chartRef.current.recalculateDimensions();
      console.log("Dimensions recalculated");
    }
  };

  const _handleTestContainerDimensions = () => {
    if (chartRef.current) {
      console.log("=== Container Dimensions Test ===");

      // Get chart dimensions from controller
      const controllerDimensions = chartRef.current.getDimensions();
      console.log("Controller Dimensions:", controllerDimensions);

      // Get actual DOM element dimensions for comparison
      const chartElement = chartRef.current.chartElement;
      const containerElement = document.querySelector(
        '[data-testid="timeline-chart-container"]'
      ) as HTMLElement;

      if (chartElement && containerElement) {
        const chartRect = chartElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();

        console.log("Chart Element (visible) - Direct DOM:", {
          width: parseFloat(chartRect.width.toFixed(2)),
          height: parseFloat(chartRect.height.toFixed(2)),
        });

        console.log("Container Element (total) - Direct DOM:", {
          width: parseFloat(
            (containerElement.scrollWidth || containerRect.width).toFixed(2)
          ),
          height: parseFloat(
            (containerElement.scrollHeight || containerRect.height).toFixed(2)
          ),
        });

        // Validate that total dimensions come from container element
        const expectedTotal = {
          width: parseFloat(
            (containerElement.scrollWidth || containerRect.width).toFixed(2)
          ),
          height: parseFloat(
            (containerElement.scrollHeight || containerRect.height).toFixed(2)
          ),
        };

        const actualTotal = controllerDimensions.total;

        if (
          actualTotal &&
          Math.abs(actualTotal.width - expectedTotal.width) < 0.01 &&
          Math.abs(actualTotal.height - expectedTotal.height) < 0.01
        ) {
          console.log(
            "✅ PASS: Total dimensions correctly derived from container element"
          );
        } else {
          console.log("❌ FAIL: Total dimensions mismatch");
          console.log("Expected:", expectedTotal);
          console.log("Actual:", actualTotal);
        }
      } else {
        console.log("❌ FAIL: Could not find chart or container elements");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>TimeLineChart Test Page</h1>{" "}
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
          marginRight: "10px",
        }}
      >
        Get Chart Info
      </button>
      <button
        onClick={handleTestControllerFeatures}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Test Controller Features
      </button>
      {/* Scroll Control Buttons */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => chartRef.current?.scrollToStart()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Scroll to Start
        </button>
        <button
          onClick={() => chartRef.current?.scrollToCenter()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Scroll to Center
        </button>
        <button
          onClick={() => chartRef.current?.scrollToEnd()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Scroll to End
        </button>
        <button
          onClick={() => chartRef.current?.scrollTo(0.25)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ffc107",
            color: "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Scroll to 25%
        </button>
        <button
          onClick={() => chartRef.current?.scrollTo(0.75)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#fd7e14",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Scroll to 75%
        </button>
      </div>
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
