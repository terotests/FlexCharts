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
    chartContainerRef,
    controller,
  } = props;

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

  return (
    <div
      style={{
        width: "100%",
        height: "20px",
        position: "relative",
        pointerEvents: "none", // Prevent pointer events on the container
      }}
    >
      {" "}
      <div
        className="bar"
        ref={(element) => {
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
          left: prosStart,
          top: "0px",
          width: prosEnd,
          height: "20px",
          borderRadius: "10px",
          overflow: "hidden",
          display: "flex",
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: backgroundColor || "#3b82f6",
          color: textColor || "white",
          border: `1px solid ${color || backgroundColor || "#3b82f6"}`,
          cursor: onBarClick ? "pointer" : "default",
          pointerEvents: onBarClick ? "auto" : "none", // Enable pointer events only if onBarClick is provided
        }}
      >
        {props.children}
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
    interval: TTimeIntervalType;
    bars?: TimeLineBarData[];
    onBarClick?: (clickData: BarClickData) => void;
  }
>((props, ref) => {
  const { startDate, endDate, interval, bars, onBarClick } = props;
  const start = useMemo(() => parseTimeString(startDate), [startDate]);
  const end = useMemo(() => parseTimeString(endDate), [endDate]);

  // Scroll state management
  const [scrollPosition, setScrollPosition] = useState(0);
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
  }, [scrollPosition, controllerRef]);

  // Expose controller to parent component via ref
  useImperativeHandle(ref, () => controllerRef.current, []);

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
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            gap: "6px",
            position: "relative",
            overflow: "hidden",
            minWidth: "100%",
          }}
        >
          {/* Grid lines container */}
          <div className="time-grid">
            {slots.map((_, index) => (
              <div
                key={`grid-${index}`}
                className="time-grid-line"
                data-test-id={`grid-line-${index}`}
              />
            ))}
          </div>{" "}
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
              chartContainerRef={chartElementRef}
              controller={controllerRef.current}
            >
              {bar.label}
            </TimeLineBar>
          ))}{" "}
          <div
            className="time-slots"
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "nowrap",
            }}
          >
            {" "}
            {slots.map((slot, index) => (
              <div
                className="time-slot"
                ref={(element) => handleTimeSlotElementRef(index, element)}
                data-test-id={`time-slot-${index}`}
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
