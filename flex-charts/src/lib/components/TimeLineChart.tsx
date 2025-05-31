import {
  useMemo,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  calculateTimeSlot,
  parseTimeString,
  splitTimeRangeIntoIntervals,
  type TTimeInterval,
  type TTimeIntervalType,
  type TTimeIntervalTypeWithDecades,
} from "../time";
import { TimeLineChartController } from "../controllers/TimeLineChartController";
import {
  processTimelineData,
  validateTimeSlots,
  type TimelineRow,
  type TimeSlot,
} from "../utils/timelineDataProcessor";

import "./TimeLineChart.css"; // Assuming you have a CSS file for styling

// Type definitions for bar click events
export interface BarClickData {
  // Bar data
  bar: TimeLineBarData;
  // Position within the chart (0-1, where 0 is start of chart, 1 is end)
  relativePosition: {
    start: number; // Position where bar starts (0-1)
    end: number; // Position where bar ends (0-1)
    center: number; // Center position of the bar (0-1)
  };
  // Dimensions and positioning
  dimensions: {
    // Bar's pixel dimensions
    width: number;
    height: number;
    // Bar's absolute position in viewport
    left: number;
    top: number;
    // Chart container dimensions for context
    chartWidth: number;
    chartHeight: number;
  };
  // Chart controller reference for programmatic chart control
  controller: TimeLineChartController;
  // Original mouse event
  event: React.MouseEvent<HTMLDivElement>;
}

// Type definitions for mouse hover events
export interface ChartHoverData {
  // Mouse position relative to chart (0-1, where 0 is start of chart, 1 is end)
  relativePosition: number;
  // Pixel position within the chart container
  pixelPosition: {
    x: number;
    y: number;
  };
  // Active time slot information at the hover position
  activeTimeSlot: {
    index: number; // Index of the time slot
    value: string; // Time slot value (e.g., "2020", "Jan", etc.)
    start: number; // Start position of time slot (0-1)
    end: number; // End position of time slot (0-1)
  } | null;
  // Chart controller reference
  controller: TimeLineChartController;
  // Original mouse event
  event: React.MouseEvent<HTMLDivElement>;
}

// Type definitions for row click events
export interface RowClickData {
  // Bar data that was clicked (same as BarClickData for consistency)
  bar: TimeLineBarData;
  // Position within the chart (0-1, where 0 is start of chart, 1 is end)
  relativePosition: {
    start: number; // Position where bar starts (0-1)
    end: number; // Position where bar ends (0-1)
    center: number; // Center position of the bar (0-1)
  };
  // Dimensions and positioning of the clicked row container
  dimensions: {
    // Row container's pixel dimensions
    width: number;
    height: number;
    // Row container's absolute position in viewport
    left: number;
    top: number;
    // Chart container dimensions for context
    chartWidth: number;
    chartHeight: number;
  };
  // Chart controller reference for programmatic chart control
  controller: TimeLineChartController;
  // Original mouse event
  event: React.MouseEvent<HTMLDivElement>;
}

// Type definitions for the bar data
export interface TimeLineBarData {
  id?: string | number;
  start: string;
  end: string;
  label: string;
  color?: string;
  backgroundColor?: string;
  textColor?: string;
}

// Custom render context data passed to render functions
export interface BarRenderContext {
  bar: TimeLineBarData;
  controller: TimeLineChartController;
  relativePosition: {
    start: number;
    end: number;
    center: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  slots?: TimeSlot[]; // Optional slots for multi-slot rendering
}

// Component for rendering a timeline row with multiple slots
const TimeLineRowComponent = (props: {
  row: TimelineRow;
  range: { start: string; end: string };
  onBarElementRef?: (id: string | number, element: HTMLElement | null) => void;
  onBarClick?: (clickData: BarClickData) => void;
  onRowClick?: (clickData: RowClickData) => void;
  chartContainerRef?: React.RefObject<HTMLDivElement | null>;
  controller?: TimeLineChartController;
  renderRowPrefix?: (context: BarRenderContext) => React.ReactNode;
  renderBarSuffix?: (context: BarRenderContext) => React.ReactNode;
  renderBarContent?: (context: BarRenderContext) => React.ReactNode;
}) => {
  const {
    row,
    range,
    onBarElementRef,
    onBarClick,
    onRowClick,
    chartContainerRef,
    controller,
    renderRowPrefix,
    renderBarSuffix,
    renderBarContent,
  } = props;

  // Calculate position of the entire row within the chart timeline
  const rowStartTime = useMemo(
    () => parseTimeString(row.fullTimeRange.start),
    [row.fullTimeRange.start]
  );
  const rowEndTime = useMemo(
    () => parseTimeString(row.fullTimeRange.end),
    [row.fullTimeRange.end]
  );

  const rowSlotStart = calculateTimeSlot(
    {
      start: parseTimeString(range.start),
      end: parseTimeString(range.end),
    },
    rowStartTime
  );
  const rowSlotEnd = calculateTimeSlot(
    {
      start: parseTimeString(range.start),
      end: parseTimeString(range.end),
    },
    rowEndTime
  );

  // Validate slots to check for overlaps
  const validationErrors = validateTimeSlots(row.slots);
  if (validationErrors.length > 0) {
    console.warn("Timeline row validation errors:", validationErrors);
  }

  // Create render context for the row (using first slot as representative)
  const renderContext: BarRenderContext = useMemo(() => {
    const firstSlot = row.slots[0];
    if (!firstSlot) {
      throw new Error(`Row ${row.rowId} has no slots`);
    }

    const barData: TimeLineBarData = {
      id: row.rowId,
      start: row.fullTimeRange.start,
      end: row.fullTimeRange.end,
      label: row.label,
      color: firstSlot.color,
      backgroundColor: firstSlot.backgroundColor,
      textColor: firstSlot.textColor,
    };

    return {
      slots: row.slots,
      bar: barData,
      controller: controller!,
      relativePosition: {
        start: rowSlotStart,
        end: rowSlotEnd,
        center: (rowSlotStart + rowSlotEnd) / 2,
      },
      dimensions: {
        width: 0, // Will be updated when elements are available
        height: 0,
      },
    };
  }, [row, rowSlotStart, rowSlotEnd, controller]);

  // Handle row click
  const handleRowClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onRowClick || !controller) return;

    const containerRect = event.currentTarget.getBoundingClientRect();
    const chartWidth =
      chartContainerRef?.current?.getBoundingClientRect().width ||
      containerRect.width;
    const chartHeight =
      chartContainerRef?.current?.getBoundingClientRect().height ||
      containerRect.height;

    const barData: TimeLineBarData = {
      id: row.rowId,
      start: row.fullTimeRange.start,
      end: row.fullTimeRange.end,
      label: row.label,
    };

    const relativePosition = {
      start: rowSlotStart,
      end: rowSlotEnd,
      center: (rowSlotStart + rowSlotEnd) / 2,
    };

    const dimensions = {
      width: containerRect.width,
      height: containerRect.height,
      left: containerRect.left,
      top: containerRect.top,
      chartWidth,
      chartHeight,
    };

    onRowClick({
      bar: barData,
      relativePosition,
      dimensions,
      controller: controller!,
      event,
    });
  };

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
      }}
      className="timeline-row-container"
      onClick={handleRowClick}
    >
      {/* Row prefix */}
      <TimeLineRowPrefix
        renderRowPrefix={renderRowPrefix}
        renderContext={renderContext}
      />

      {/* Row container positioned within the chart timeline */}
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        {/* Render each slot within the row */}
        {row.slots.map((slot, slotIndex) => {
          const slotProsStart = `${(slot.relativeStart * 100).toFixed(2)}%`;
          const slotProsWidth = `${(slot.relativeWidth * 100).toFixed(2)}%`;

          // Handle slot click
          const handleSlotClick = (event: React.MouseEvent<HTMLDivElement>) => {
            if (!onBarClick) return;
            event.stopPropagation(); // Prevent row click

            const slotElement = event.currentTarget;
            const slotRect = slotElement.getBoundingClientRect();
            const chartWidth =
              chartContainerRef?.current?.getBoundingClientRect().width || 0;
            const chartHeight =
              chartContainerRef?.current?.getBoundingClientRect().height || 0;

            const barData: TimeLineBarData = {
              id: slot.id,
              start: slot.start,
              end: slot.end,
              label: slot.label,
              color: slot.color,
              backgroundColor: slot.backgroundColor,
              textColor: slot.textColor,
            };

            // Calculate absolute position of slot within entire chart
            const absoluteSlotStart =
              rowSlotStart + (rowSlotEnd - rowSlotStart) * slot.relativeStart;
            const absoluteSlotEnd =
              rowSlotStart + (rowSlotEnd - rowSlotStart) * slot.relativeEnd;

            const relativePosition = {
              start: absoluteSlotStart,
              end: absoluteSlotEnd,
              center: (absoluteSlotStart + absoluteSlotEnd) / 2,
            };

            const dimensions = {
              width: slotRect.width,
              height: slotRect.height,
              left: slotRect.left,
              top: slotRect.top,
              chartWidth,
              chartHeight,
            };

            onBarClick({
              bar: barData,
              relativePosition,
              dimensions,
              controller: controller!,
              event,
            });
          };

          return (
            <div
              key={`${slot.id}-${slotIndex}`}
              className="bar"
              ref={(element) => {
                if (onBarElementRef) {
                  onBarElementRef(slot.id, element);
                }
              }}
              onClick={handleSlotClick}
              style={{
                ...getBarStyles({
                  backgroundColor: slot.backgroundColor,
                  color: slot.color,
                  textColor: slot.textColor,
                  isClickable: !!onBarClick,
                }),
                marginLeft: slotProsStart,
                width: slotProsWidth,
                alignItems: "left",
                overflow: "unset",
                justifyContent: "flex-start",
                position: slotIndex > 0 ? "absolute" : undefined,
                top: "0px",
                left: "0px",
                height: "1.9em",
              }}
              title={`${slot.label}: ${slot.start} - ${slot.end}`}
            >
              {/* Slot content */}
              <TimeLineBarContent
                label={slot.label}
                renderBarContent={renderBarContent}
                renderContext={renderContext}
              />
            </div>
          );
        })}

        {/* Row suffix */}
        <TimeLineRowSuffix
          renderBarSuffix={renderBarSuffix}
          renderContext={renderContext}
        />
      </div>
    </div>
  );
};

const TimeLineBar = (props: {
  id?: string | number;
  start: string;
  end: string;
  label: string;
  renderTitle?: (time: TTimeIntervalType) => string;
  children?: React.ReactNode;
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  range: {
    start: string;
    end: string;
  };
  onBarElementRef?: (id: string | number, element: HTMLElement | null) => void;
  onBarClick?: (clickData: BarClickData) => void;
  onRowClick?: (clickData: RowClickData) => void;
  chartContainerRef?: React.RefObject<HTMLDivElement | null>;
  controller?: TimeLineChartController;
  // Custom render functions
  renderRowPrefix?: (context: BarRenderContext) => React.ReactNode;
  renderBarSuffix?: (context: BarRenderContext) => React.ReactNode;
  renderBarContent?: (context: BarRenderContext) => React.ReactNode;
}) => {
  const {
    id,
    start,
    end,
    label,
    range,
    color,
    backgroundColor,
    textColor,
    onBarElementRef,
    onBarClick,
    onRowClick,
    chartContainerRef,
    controller,
    renderRowPrefix,
    renderBarSuffix,
    renderBarContent,
  } = props;

  const [textAlignment, setTextAlignment] = useState<"center" | "flex-start">(
    "center"
  );
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const startTime = useMemo(() => parseTimeString(start), [start]);
  const endTime = useMemo(() => parseTimeString(end), [end]);

  const slotStart = calculateTimeSlot(
    {
      start: parseTimeString(range.start),
      end: parseTimeString(range.end),
    },
    startTime
  );
  const slotEnd = calculateTimeSlot(
    {
      start: parseTimeString(range.start),
      end: parseTimeString(range.end),
    },
    endTime
  );
  const prosStart = `${(slotStart * 100).toFixed(1)}%`;
  const prosEnd = `${((slotEnd - slotStart) * 100).toFixed(1)}%`;

  // Create render context for custom render functions
  const renderContext: BarRenderContext = useMemo(() => {
    const barData: TimeLineBarData = {
      id,
      start,
      end,
      label,
      color,
      backgroundColor,
      textColor,
    };

    return {
      bar: barData,
      controller: controller!,
      relativePosition: {
        start: slotStart,
        end: slotEnd,
        center: (slotStart + slotEnd) / 2,
      },
      dimensions: {
        width: barRef.current?.offsetWidth || 0,
        height: barRef.current?.offsetHeight || 0,
      },
    };
  }, [
    id,
    start,
    end,
    label,
    color,
    backgroundColor,
    textColor,
    controller,
    slotStart,
    slotEnd,
  ]);

  // Check if text fits and adjust alignment accordingly
  useEffect(() => {
    if (barRef.current && textRef.current) {
      const barWidth = barRef.current.offsetWidth;
      const textWidth = textRef.current.scrollWidth;

      // Add some padding tolerance (10px) to account for padding/margins
      if (textWidth > barWidth - 10) {
        setTextAlignment("flex-start");
      } else {
        setTextAlignment("center");
      }
    }
  }, [label, prosEnd]); // Re-run when label or bar width changes

  // Handle bar click
  const handleBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onBarClick) return;

    const barElement = event.currentTarget;
    const barRect = barElement.getBoundingClientRect();

    // Get chart container dimensions for context
    let chartWidth = 0;
    let chartHeight = 0;

    if (chartContainerRef?.current) {
      const containerRect = chartContainerRef.current.getBoundingClientRect();
      chartWidth = containerRect.width;
      chartHeight = containerRect.height;
    }

    // Create bar data object
    const barData: TimeLineBarData = {
      id,
      start,
      end,
      label,
      color,
      backgroundColor,
      textColor,
    };

    // Calculate relative positions (0-1)
    const relativePosition = {
      start: slotStart,
      end: slotEnd,
      center: (slotStart + slotEnd) / 2,
    };

    // Get bar dimensions and position
    const dimensions = {
      width: barRect.width,
      height: barRect.height,
      left: barRect.left,
      top: barRect.top,
      chartWidth,
      chartHeight,
    }; // Call the click handler with comprehensive data
    onBarClick({
      bar: barData,
      relativePosition,
      dimensions,
      controller: controller!,
      event,
    });
  };

  // Handle row container click
  const handleRowClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onRowClick || !controller) return;

    // Get container dimensions and chart dimensions
    const containerRect = event.currentTarget.getBoundingClientRect();
    const chartWidth =
      chartContainerRef?.current?.getBoundingClientRect().width ||
      containerRect.width;
    const chartHeight =
      chartContainerRef?.current?.getBoundingClientRect().height ||
      containerRect.height;

    // Create bar data object
    const barData: TimeLineBarData = {
      id,
      start,
      end,
      label,
      color,
      backgroundColor,
      textColor,
    };

    // Calculate relative positions (0-1) - same as bar click for consistency
    const relativePosition = {
      start: slotStart,
      end: slotEnd,
      center: (slotStart + slotEnd) / 2,
    };

    // Get row container dimensions and position
    const dimensions = {
      width: containerRect.width,
      height: containerRect.height,
      left: containerRect.left,
      top: containerRect.top,
      chartWidth,
      chartHeight,
    };

    // Call the row click handler with comprehensive data
    onRowClick({
      bar: barData,
      relativePosition,
      dimensions,
      controller: controller!,
      event,
    });
  };
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
      }}
      className="timeline-bar-container"
      onClick={handleRowClick}
    >
      {/* Row prefix - positioned absolutely to not affect timeline alignment */}
      <TimeLineRowPrefix
        renderRowPrefix={renderRowPrefix}
        renderContext={renderContext}
      />

      {/* Bar container - full width to maintain timeline alignment */}
      <div style={{ width: "100%", position: "relative" }}>
        {" "}
        <div
          className="bar"
          ref={(element) => {
            barRef.current = element;
            if (onBarElementRef && id !== undefined) {
              onBarElementRef(id, element);
            }
          }}
          onClick={handleBarClick}
          data-test-id={`bar-${id}`}
          tabIndex={0}
          title={label}
          aria-label={label}
          role="img"
          aria-description={`${label}: ${start} - ${end}`}
          style={{
            ...getBarStyles({
              backgroundColor,
              color,
              textColor,
              isClickable: !!onBarClick,
            }),
            marginLeft: prosStart,
            top: "0px",
            width: prosEnd,
            justifyContent: textAlignment,
            paddingLeft: textAlignment === "flex-start" ? "8px" : "0px", // Add padding when left-aligned
          }}
        >
          {/* Bar content - using shared component */}
          <div ref={textRef}>
            <TimeLineBarContent
              label={label}
              renderBarContent={renderBarContent}
              renderContext={
                renderBarContent && controller ? renderContext : undefined
              }
            >
              {props.children}
            </TimeLineBarContent>
          </div>
        </div>
        {/* Bar suffix - using shared component */}
        <TimeLineRowSuffix
          renderBarSuffix={renderBarSuffix}
          renderContext={renderContext}
        />
      </div>
    </div>
  );
};

export const TimeLineChart = forwardRef<
  TimeLineChartController,
  {
    startDate: string;
    endDate: string;
    width?: string;
    labelFontSize?: string;
    renderTitle?: (time: TTimeInterval) => string;
    interval: TTimeIntervalTypeWithDecades;
    bars?: TimeLineBarData[];
    onBarClick?: (clickData: BarClickData) => void;
    onRowClick?: (clickData: RowClickData) => void;
    onChartHover?: (hoverData: ChartHoverData) => void;
    // Custom render functions
    renderRowPrefix?: (context: BarRenderContext) => React.ReactNode;
    renderBarSuffix?: (context: BarRenderContext) => React.ReactNode;
    renderBarContent?: (context: BarRenderContext) => React.ReactNode;
    // Layout options
    leftMargin?: string | number; // Margin for prefix elements that overflow to the left
  }
>((props, ref) => {
  const {
    startDate,
    endDate,
    interval,
    bars,
    onBarClick,
    onRowClick,
    onChartHover,
    renderRowPrefix,
    renderBarSuffix,
    renderBarContent,
    leftMargin = 0, // Default to no margin
  } = props;
  const start = useMemo(() => parseTimeString(startDate), [startDate]);
  const end = useMemo(() => parseTimeString(endDate), [endDate]);
  // Scroll state management
  const [scrollPosition, setScrollPosition] = useState(0);
  // Time slots visibility state
  const [chartBottomY, setChartBottomY] = useState(0);
  const [windowScrollY, setWindowScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Create controller instance
  const controllerRef = useRef<TimeLineChartController>(
    new TimeLineChartController()
  );
  const chartElementRef = useRef<HTMLDivElement>(null);

  const containerElementRef = useRef<HTMLDivElement>(null);
  const timeSlotElementsRef = useRef<HTMLElement[]>([]);

  // Use provided bars or empty array if no bars provided - wrapped in useMemo
  const barData = useMemo(() => bars || [], [bars]);

  // Process timeline data to group bars by ID for multi-slot rendering
  const timelineRows = useMemo(() => {
    return processTimelineData(barData, {
      start: startDate,
      end: endDate,
    });
  }, [barData]);

  // Determine if we should use multi-slot rendering (when there are rows with multiple slots)
  const useMultiSlotRendering = useMemo(() => {
    return timelineRows.some((row) => row.slots.length > 1);
  }, [timelineRows]);

  const slots = useMemo(() => {
    return splitTimeRangeIntoIntervals(
      {
        start,
        end,
      },
      interval
    );
  }, [start, end, interval]);

  // Handle bar element references
  const handleBarElementRef = (
    id: string | number,
    element: HTMLElement | null
  ) => {
    const controller = controllerRef.current;
    if (element) {
      controller.addBarElement(id, element);
    } else {
      controller.removeBarElement(id);
    }
  };

  // Handle time slot element references
  const handleTimeSlotElementRef = (
    index: number,
    element: HTMLElement | null
  ) => {
    if (element) {
      timeSlotElementsRef.current[index] = element;
      // Update controller with current time slot elements
      controllerRef.current.updateTimeSlotElements(
        timeSlotElementsRef.current.filter(Boolean)
      );
    }
  };
  // Initialize controller when component mounts or data changes
  useEffect(() => {
    const controller = controllerRef.current;
    controller.initialize(
      startDate,
      endDate,
      barData.length,
      chartElementRef.current
    );

    // Register scroll callback
    controller.setScrollToCallback((position: number) => {
      setScrollPosition(position);
    });
  }, [startDate, endDate, barData.length]);
  // Update element reference when DOM changes
  useEffect(() => {
    if (chartElementRef.current) {
      controllerRef.current.updateElement(chartElementRef.current);
    }
  });

  // Update container element reference when DOM changes
  useEffect(() => {
    if (containerElementRef.current) {
      controllerRef.current.updateContainerElement(containerElementRef.current);
    }
  });
  // Apply scroll position effect
  useEffect(() => {
    if (containerElementRef.current && scrollPosition !== null) {
      /*
      const container = containerElementRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const targetScrollLeft = maxScrollLeft * scrollPosition;
      container.scrollLeft = targetScrollLeft;
      */

      const dimensions = controllerRef.current.getDimensions();

      if (!dimensions.total?.width || !dimensions.visible?.width) {
        return;
      }

      const scrollableArea =
        (dimensions.total?.width || 0) - (dimensions.visible?.width || 0);
      containerElementRef.current.scrollLeft = scrollableArea * scrollPosition;

      console.log(
        "Scroll ",
        dimensions,
        scrollableArea,
        scrollPosition,
        scrollableArea * scrollPosition
      );

      // Notify controller of scroll position change
      controllerRef.current.notifyScrollPositionChange(scrollPosition);
    }
  }, [scrollPosition, controllerRef]); // Track chart position and window scroll for time slots visibility
  useEffect(() => {
    const updateChartPosition = () => {
      if (chartElementRef.current) {
        const rect = chartElementRef.current.getBoundingClientRect();
        setChartBottomY(rect.bottom);
      }
    };
    const updateWindowScroll = () => {
      setWindowScrollY(window.scrollY);
      setWindowHeight(window.innerHeight);
      // Detect zoom level using visual viewport and device pixel ratio
      const zoomFactor = window.visualViewport
        ? window.visualViewport.scale
        : window.devicePixelRatio || 1;
      setZoomLevel(zoomFactor);
    }; // Initial measurements
    updateChartPosition();
    updateWindowScroll();

    // Add event listeners
    window.addEventListener("scroll", updateWindowScroll);
    window.addEventListener("resize", updateWindowScroll);

    // Listen for zoom changes via visual viewport API
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateWindowScroll);
    }

    // Use ResizeObserver to track chart position changes
    const resizeObserver = new ResizeObserver(updateChartPosition);
    if (chartElementRef.current) {
      resizeObserver.observe(chartElementRef.current);
    }
    return () => {
      window.removeEventListener("scroll", updateWindowScroll);
      window.removeEventListener("resize", updateWindowScroll);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateWindowScroll);
      }
      resizeObserver.disconnect();
    };
  }, []); // Calculate translateY for time slots to keep them visible
  const calculateTimeSlotsTransform = () => {
    // If chart bottom is below the viewport, move time slots up to keep them visible
    // Account for browser zoom level in calculations
    const effectiveWindowHeight = windowHeight / zoomLevel;
    const effectiveScrollY = windowScrollY / zoomLevel;
    const effectiveChartBottomY = chartBottomY / zoomLevel;

    const viewportBottom = effectiveScrollY + effectiveWindowHeight;
    const chartOverflowBelow = effectiveChartBottomY - viewportBottom;

    if (chartOverflowBelow > 0) {
      // Chart extends below viewport, move time slots up by the overflow amount
      // Apply zoom factor to the transform as well
      const transformAmount = (chartOverflowBelow + 20) * zoomLevel;
      return `translateY(-${transformAmount}px)`; // Add 20px padding
    }

    return "translateY(0px)";
  };

  // Check if time slots need to be transformed (moved up)
  const isTimeSlotsTransformed = () => {
    // Account for browser zoom level in calculations
    const effectiveWindowHeight = windowHeight / zoomLevel;
    const effectiveScrollY = windowScrollY / zoomLevel;
    const effectiveChartBottomY = chartBottomY / zoomLevel;

    const viewportBottom = effectiveScrollY + effectiveWindowHeight;
    const chartOverflowBelow = effectiveChartBottomY - viewportBottom;
    return chartOverflowBelow > 0;
  };

  // Expose controller to parent component via ref
  useImperativeHandle(ref, () => controllerRef.current, []);

  // Handle mouse hover over chart
  const handleChartHover = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onChartHover || !containerElementRef.current) return;
    const containerRect = containerElementRef.current.getBoundingClientRect();
    const relativeX = event.clientX - containerRect.left;
    const relativeY = event.clientY - containerRect.top;

    // Get dimensions from controller to account for total chart width
    const dimensions = controllerRef.current.getDimensions();
    const scrollLeft = containerElementRef.current.scrollLeft;

    // Calculate relative position based on total chart width, not just visible width
    let relativePosition = 0;
    if (dimensions.total?.width && dimensions.visible?.width) {
      // Account for scroll position and total width
      const totalWidth = dimensions.total.width;
      const absoluteX = scrollLeft + relativeX;
      relativePosition = absoluteX / totalWidth;
    } else {
      // Fallback to basic calculation if dimensions not available
      relativePosition = relativeX / containerRect.width;
    }
    // Find active time slot at this position
    const activeTimeSlotIndex = Math.floor(relativePosition * slots.length);
    const activeTimeSlot =
      activeTimeSlotIndex >= 0 && activeTimeSlotIndex < slots.length
        ? {
            index: activeTimeSlotIndex,
            value: slots[activeTimeSlotIndex].value.toString(),
            start: activeTimeSlotIndex / slots.length,
            end: (activeTimeSlotIndex + 1) / slots.length,
          }
        : null;

    // Create hover data
    const hoverData: ChartHoverData = {
      relativePosition: Math.max(0, Math.min(1, relativePosition)),
      pixelPosition: {
        x: relativeX,
        y: relativeY,
      },
      activeTimeSlot,
      controller: controllerRef.current,
      event,
    };

    onChartHover(hoverData);
  };

  // Here you can implement the logic to display the date range
  // based on the provided startDate, endDate, and interval.
  return (
    <div
      ref={chartElementRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: props.width ? props.width : "100%",
      }}
      key={`${startDate}-${endDate}-${interval}`}
      className="timeline-chart"
      data-test-id="timeline-chart"
    >
      {" "}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0px",
          flexDirection: "column",
          overflow: "auto",
          width: "100%",
          height: "100%",
          scrollBehavior: "smooth",
        }}
        className="timeline-chart-scroll-container"
        ref={(el) => {
          containerElementRef.current = el;
        }}
      >
        {" "}
        <div
          data-testid="timeline-chart-container"
          onMouseMove={handleChartHover}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            gap: "6px",
            position: "relative",
            minWidth: "100%",
            height: "100%",
            marginLeft:
              typeof leftMargin === "number" ? `${leftMargin}px` : leftMargin,
          }}
        >
          {/* Vertical grid lines container */}
          <div className="time-grid">
            {slots.map((_, index) => (
              <div
                key={`grid-${index}`}
                className="time-grid-line"
                data-test-id={`grid-line-${index}`}
              />
            ))}
          </div>{" "}
          <div className="time-bars">
            {useMultiSlotRendering
              ? // Multi-slot rendering for rows with multiple slots
                timelineRows.map((row) => (
                  <TimeLineRowComponent
                    key={row.rowId}
                    row={row}
                    range={{ start: props.startDate, end: props.endDate }}
                    onBarElementRef={handleBarElementRef}
                    onBarClick={onBarClick}
                    onRowClick={onRowClick}
                    chartContainerRef={chartElementRef}
                    controller={controllerRef.current}
                    renderRowPrefix={renderRowPrefix}
                    renderBarSuffix={renderBarSuffix}
                    renderBarContent={renderBarContent}
                  />
                ))
              : // Single slot rendering for simple timeline bars
                barData.map((bar) => (
                  <TimeLineBar
                    key={bar.id || `${bar.start}-${bar.end}-${bar.label}`}
                    id={bar.id}
                    start={bar.start}
                    end={bar.end}
                    label={bar.label}
                    color={bar.color}
                    backgroundColor={bar.backgroundColor}
                    textColor={bar.textColor}
                    range={{ start: props.startDate, end: props.endDate }}
                    onBarElementRef={handleBarElementRef}
                    onBarClick={onBarClick}
                    onRowClick={onRowClick}
                    chartContainerRef={chartElementRef}
                    controller={controllerRef.current}
                    renderRowPrefix={renderRowPrefix}
                    renderBarSuffix={renderBarSuffix}
                    renderBarContent={renderBarContent}
                  >
                    {bar.label}
                  </TimeLineBar>
                ))}
          </div>
          <div
            className={`time-slots ${
              isTimeSlotsTransformed() ? "time-slots-transformed" : ""
            }`}
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "nowrap",
              transform: calculateTimeSlotsTransform(),
              zIndex: isTimeSlotsTransformed() ? 1000 : "auto",
              pointerEvents: isTimeSlotsTransformed() ? "none" : "auto",
              position: "relative",
            }}
          >
            {" "}
            {slots.map((slot, index) => (
              <div
                className={`time-slot time-slot-${interval}`}
                ref={(element) => handleTimeSlotElementRef(index, element)}
                data-test-id={`time-slot-${index}`}
                data-timeslot={
                  props.renderTitle ? props.renderTitle(slot) : slot.value
                }
                key={index}
                style={{
                  whiteSpace: "nowrap",
                  fontSize: props.labelFontSize || "12px",
                }}
              >
                {props.renderTitle ? props.renderTitle(slot) : slot.value}
              </div>
            ))}
          </div>{" "}
        </div>
      </div>
    </div>
  );
});

// Shared row prefix component
const TimeLineRowPrefix = ({
  renderRowPrefix,
  renderContext,
}: {
  renderRowPrefix?: (context: BarRenderContext) => React.ReactNode;
  renderContext: BarRenderContext;
}) => {
  if (!renderRowPrefix) return null;

  return (
    <div
      className="timeline-row-prefix"
      style={{
        position: "absolute",
        left: "0px",
        top: "0px",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {renderRowPrefix(renderContext)}
    </div>
  );
};

// Shared row suffix component
const TimeLineRowSuffix = ({
  renderBarSuffix,
  renderContext,
}: {
  renderBarSuffix?: (context: BarRenderContext) => React.ReactNode;
  renderContext: BarRenderContext;
}) => {
  if (!renderBarSuffix) return null;

  return (
    <div
      className="timeline-row-suffix"
      style={{
        position: "absolute",
        right: "0px",
        top: "0px",
        height: "100%",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "0px",
          top: "0px",
          height: "100%",
        }}
      >
        {renderBarSuffix(renderContext)}
      </div>
    </div>
  );
};

// Shared slot/bar styling function
const getBarStyles = (options: {
  backgroundColor?: string;
  color?: string;
  textColor?: string;
  isClickable?: boolean;
}): React.CSSProperties => {
  const { backgroundColor, color, textColor, isClickable } = options;

  return {
    backgroundColor: backgroundColor || "#3b82f6",
    color: textColor || "white",
    border: `1px solid ${color || backgroundColor || "#3b82f6"}`,
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: isClickable ? "pointer" : "default",
    pointerEvents: (isClickable ? "auto" : "none") as "auto" | "none",
    padding: "0 4px",
    boxSizing: "border-box",
    height: "100%",
  };
};

// Shared text content component for slots/bars
const TimeLineBarContent = ({
  label,
  renderBarContent,
  renderContext,
  children,
}: {
  label: string;
  renderBarContent?: (context: BarRenderContext) => React.ReactNode;
  renderContext?: BarRenderContext;
  children?: React.ReactNode;
}) => {
  return (
    <div
      style={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        fontSize: "11px",
        fontWeight: "500",
      }}
    >
      {renderBarContent && renderContext
        ? renderBarContent(renderContext)
        : children || label}
    </div>
  );
};
