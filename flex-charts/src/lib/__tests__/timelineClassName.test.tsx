import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TimeLineChart } from "../components/TimeLineChart";
import type { TimeLineBarData } from "../components/TimeLineChart";

describe("TimeLineChart className functionality", () => {
  const testData: TimeLineBarData[] = [
    {
      id: "test1",
      start: "2020-01-01",
      end: "2020-06-01",
      label: "Test Bar 1",
      backgroundColor: "#3b82f6",
      className: "custom-class-1",
    },
    {
      id: "test2",
      start: "2020-07-01",
      end: "2020-12-01",
      label: "Test Bar 2",
      backgroundColor: "#ef4444",
      className: "custom-class-2 multiple-classes",
    },
    {
      id: "test3",
      start: "2021-01-01",
      end: "2021-06-01",
      label: "Test Bar 3",
      backgroundColor: "#10b981",
      // No className to test optional behavior
    },
  ];

  it("should apply className to timeline bars in single-slot rendering", () => {
    render(
      <TimeLineChart
        startDate="2020-01-01"
        endDate="2021-12-31"
        interval="M"
        bars={testData}
        width="800px"
      />
    );

    // Check that bars with className have the custom classes applied
    const bar1 = screen.getByText("Test Bar 1").closest(".bar");
    expect(bar1).toHaveClass("custom-class-1");

    const bar2 = screen.getByText("Test Bar 2").closest(".bar");
    expect(bar2).toHaveClass("custom-class-2");
    expect(bar2).toHaveClass("multiple-classes");

    // Check that bar without className doesn't have undefined class
    const bar3 = screen.getByText("Test Bar 3").closest(".bar");
    expect(bar3?.className).not.toContain("undefined");
  });

  it("should apply className to timeline rows in multi-slot rendering", () => {
    const multiSlotData: TimeLineBarData[] = [
      {
        id: "project1",
        start: "2020-01-01",
        end: "2020-06-01",
        label: "Phase 1",
        backgroundColor: "#3b82f6",
        className: "project-phase",
      },
      {
        id: "project1", // Same ID for multi-slot rendering
        start: "2020-07-01",
        end: "2020-12-01",
        label: "Phase 2",
        backgroundColor: "#ef4444",
        className: "project-phase final-phase",
      },
    ];

    render(
      <TimeLineChart
        startDate="2020-01-01"
        endDate="2020-12-31"
        interval="M"
        bars={multiSlotData}
        width="800px"
      />
    );

    // In multi-slot rendering, check for row-level classes
    const rowContainer = document.querySelector(".timeline-row-container");
    expect(rowContainer).toHaveClass("project1"); // rowId class
    expect(rowContainer).toHaveClass("project-phase"); // className from first bar

    // Check individual slots
    const phase1Bar = screen.getByText("Phase 1").closest(".bar");
    expect(phase1Bar).toHaveClass("project-phase");

    const phase2Bar = screen.getByText("Phase 2").closest(".bar");
    expect(phase2Bar).toHaveClass("project-phase");
    expect(phase2Bar).toHaveClass("final-phase");
  });

  it("should handle undefined className gracefully", () => {
    const dataWithoutClassName: TimeLineBarData[] = [
      {
        id: "no-class",
        start: "2020-01-01",
        end: "2020-06-01",
        label: "No Class Bar",
        backgroundColor: "#6b7280",
      },
    ];

    render(
      <TimeLineChart
        startDate="2020-01-01"
        endDate="2020-12-31"
        interval="M"
        bars={dataWithoutClassName}
        width="800px"
      />
    );

    const bar = screen.getByText("No Class Bar").closest(".bar");
    expect(bar?.className).not.toContain("undefined");
    expect(bar?.className).not.toContain("null");
  });
});
