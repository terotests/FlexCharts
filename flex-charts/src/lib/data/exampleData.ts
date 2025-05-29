// Example data for FlexCharts components

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
