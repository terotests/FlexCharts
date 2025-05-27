import { useMemo } from "react";
import {
  calculateTimeSlot,
  flattenResults,
  parseTimeString,
  splitTimeRangeIntoIntervals,
  type TTimeIntervalType,
} from "../time";

import "./DateRange.css"; // Assuming you have a CSS file for styling
import { useSwipe } from "../hooks/useSwipe";

const Bar = (props: {
  start: string;
  end: string;
  children?: React.ReactNode;
  range: {
    start: string;
    end: string;
  };
}) => {
  const { start, end, range } = props;

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
      <div
        className="bar"
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
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export const DateRange = (props: {
  startDate: string;
  endDate: string;
  interval: TTimeIntervalType;
}) => {
  const { startDate, endDate, interval } = props;

  const start = useMemo(() => parseTimeString(startDate), [startDate]);
  const end = useMemo(() => parseTimeString(endDate), [endDate]);

  const slots = useMemo(() => {
    return flattenResults(
      splitTimeRangeIntoIntervals(
        {
          start,
          end,
        },
        interval
      ),
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
        width: "100%",
      }}
      key={`${startDate}-${endDate}-${interval}`}
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
          <Bar
            start="05/1992"
            end="05/1995"
            range={{ start: props.startDate, end: props.endDate }}
          >
            Turbo C
          </Bar>

          <Bar
            start="05/1992"
            end="05/1998"
            range={{ start: props.startDate, end: props.endDate }}
          >
            Pascal
          </Bar>
          <Bar
            start="05/1994"
            end="05/1999"
            range={{ start: props.startDate, end: props.endDate }}
          >
            x86 Asm (TASM)
          </Bar>

          <Bar
            start="05/1996"
            end="05/1998"
            range={{ start: props.startDate, end: props.endDate }}
          >
            Perl
          </Bar>

          <Bar
            start="05/1996"
            end="05/1998"
            range={{ start: props.startDate, end: props.endDate }}
          >
            Watcom C
          </Bar>

          <Bar
            start="05/1998"
            end="05/2003"
            range={{ start: props.startDate, end: props.endDate }}
          >
            Visual Studio
          </Bar>

          <Bar
            start="05/2001"
            end="08/2005"
            range={{ start: props.startDate, end: props.endDate }}
          >
            Pascal To C
          </Bar>

          <Bar
            start="05/2002"
            end="08/2012"
            range={{ start: props.startDate, end: props.endDate }}
          >
            Apache HTTP Server
          </Bar>

          <Bar
            start="05/2002"
            end="08/2012"
            range={{ start: props.startDate, end: props.endDate }}
          >
            MySQL
          </Bar>

          <Bar
            start="03/2002"
            end="06/2014"
            range={{ start: props.startDate, end: props.endDate }}
          >
            PHP
          </Bar>

          <Bar
            start="03/2006"
            end="06/2025"
            range={{ start: props.startDate, end: props.endDate }}
          >
            JavaScript
          </Bar>

          <Bar
            start="01/2018"
            end="12/2022"
            range={{ start: props.startDate, end: props.endDate }}
          >
            Nginx
          </Bar>

          <Bar
            start="01/2018"
            end="12/2025"
            range={{ start: props.startDate, end: props.endDate }}
          >
            React
          </Bar>

          <Bar
            start="08/2018"
            end="06/2025"
            range={{ start: props.startDate, end: props.endDate }}
          >
            TypeScript
          </Bar>

          <Bar
            start="03/2021"
            end="06/2025"
            range={{ start: props.startDate, end: props.endDate }}
          />
          <div
            className="time-slots"
            style={{ width: "100%", display: "flex" }}
          >
            {slots.map((slot, index) => (
              <div className="time-slot" key={index}>
                {slot.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
