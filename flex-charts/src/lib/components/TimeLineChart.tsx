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
      }}
      className="timeline-bar-container"
      onClick={handleRowClick}
    >
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
          marginLeft: prosStart,
          top: "0px",
          width: prosEnd,
          borderRadius: "10px",
          overflow: "hidden",
          display: "flex",
          justifyContent: textAlignment,
          alignItems: "center",
          backgroundColor: backgroundColor || "#3b82f6",
          color: textColor || "white",
          border: `1px solid ${color || backgroundColor || "#3b82f6"}`,
          cursor: onBarClick ? "pointer" : "default",
          pointerEvents: onBarClick ? "auto" : "none", // Enable pointer events only if onBarClick is provided
          paddingLeft: textAlignment === "flex-start" ? "8px" : "0px", // Add padding when left-aligned
        }}
      >
        <div
          ref={textRef}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {props.children}
        </div>
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
  // Use provided bars or empty array if no bars provided
  const barData = bars || [];

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
            overflow: "hidden",
            minWidth: "100%",
            height: "100%",
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
            {barData.map((bar) => (
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
              >
                {bar.label}
              </TimeLineBar>
            ))}{" "}
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
