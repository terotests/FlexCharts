import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LineChart } from "../components/LineChart";

describe("LineChart", () => {
  const mockData = {
    labels: ["January", "February", "March"],
    datasets: [
      {
        label: "Dataset 1",
        data: [10, 20, 30],
        color: "#ff0000",
      },
    ],
  };

  it("respects the size options", () => {
    const options = { width: 500, height: 300 };
    render(<LineChart data={mockData} options={options} />);

    const svg = document.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("500");
    expect(svg?.getAttribute("height")).toBe("300");
  });
});
