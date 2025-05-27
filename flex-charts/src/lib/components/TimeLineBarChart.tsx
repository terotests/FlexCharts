import { useMemo } from "react";
import { parseTimeString } from "../time";

interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    interval: {
      start: string;
      end: string;
    };
    backgroundColor?: string;
  }[];
}

export const exampleDataSet: BarChartData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Dataset 1",
      interval: {
        start: "2024-01-01",
        end: "2024-01-31",
      },
      backgroundColor: "#FF6384",
    },
    {
      label: "Dataset 2",
      interval: {
        start: "2024-02-01",
        end: "2024-02-28",
      },
      backgroundColor: "#36A2EB",
    },
    {
      label: "Dataset 3",
      interval: {
        start: "2024-03-01",
        end: "2024-03-31",
      },
      backgroundColor: "#FFCE56",
    },
  ],
};

/**
 * BarChart component for rendering bar charts
 *
 * @param data - The data to render in the chart
 * @param options - Optional configuration for the chart
 * @returns A bar chart component
 */
export const TimeLineBarChart = (props: {
  data: BarChartData;
  options?: {
    width?: number;
    height?: number;
    title?: string;
  };
}) => {
  // We'll use chartData in the future implementation
  // For now we're just acknowledging it to prevent the unused variable warning

  return (
    <div className="flex-chart bar-chart">
      {props.data.datasets.map((dataset, index) => (
        <div
          key={index}
          className="bar"
          style={{
            backgroundColor: dataset.backgroundColor || "#ccc",
            width: "100%",
            height: "50px",
            marginBottom: "10px",
            position: "relative",
          }}
        >
          <div
            className="bar-label"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {dataset.label}
          </div>
          <div
            className="bar-interval"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {dataset.interval.start} - {dataset.interval.end}
          </div>
        </div>
      ))}
    </div>
  );
};
