// filepath: c:\Users\terok\proj\FlexCharts\flex-charts\src\lib\components\TimeLineBarChart.tsx

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

/**
 * BarChart component for rendering bar charts
 *
 * @param data - The data to render in the chart
 * @param options - Optional configuration for the chart
 * @returns A bar chart component
 */
const TimeLineBarChart = (props: {
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

export { TimeLineBarChart };
