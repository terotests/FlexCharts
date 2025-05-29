import { useMemo } from "react";
import {
  calculateTimeSlot,
  parseTimeString,
  splitTimeRangeIntoIntervals,
  type TTimeInterval,
  type TTimeIntervalType,
} from "../time";

import "./TimeLineChart.css"; // Assuming you have a CSS file for styling

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
}) => {
  const { id, start, end, label, range, color, backgroundColor, textColor } =
    props;

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

  return (
    <div
      style={{
        width: "100%",
        height: "20px",
        position: "relative",
      }}
    >
      {" "}
      <div
        className="bar"
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
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export const TimeLineChart = (props: {
  startDate: string;
  endDate: string;
  width?: string;
  labelFontSize?: string;
  renderTitle?: (time: TTimeInterval) => string;
  interval: TTimeIntervalType;
  bars?: TimeLineBarData[];
}) => {
  const { startDate, endDate, interval, bars } = props;
  const start = useMemo(() => parseTimeString(startDate), [startDate]);
  const end = useMemo(() => parseTimeString(endDate), [endDate]);

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

  // Here you can implement the logic to display the date range
  // based on the provided startDate, endDate, and interval.

  return (
    <div
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
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0px",
          flexDirection: "column",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {" "}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            gap: "6px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {" "}
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
            >
              {bar.label}
            </TimeLineBar>
          ))}
          <div
            className="time-slots"
            style={{ width: "100%", display: "flex", flexWrap: "nowrap" }}
          >
            {" "}
            {slots.map((slot, index) => (
              <div
                className="time-slot"
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
          </div>
        </div>
      </div>
    </div>
  );
};
