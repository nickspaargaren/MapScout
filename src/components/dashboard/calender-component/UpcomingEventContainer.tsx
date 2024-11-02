import React from "react";
import UpcomingEvent from "./UpcomingEvent";

interface CalendarEvent {
    displayNumber: number;
    eventName: string;
    fromDate: string;
    toDate: string;
    fromTime: string;
    toTime: string;
    isAllDay: boolean;
    isCustom: boolean;
    repeatDays?: (
        | "Sunday"
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
    )[];
    isOn?: boolean;
    customEndDate?: string;
    isAfter?: boolean;
    customEndOccurrences?: number;
    address: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
}

const dateComparison = (firstDate, secondDate) => {
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);
    const difference = date2.getTime() - date1.getTime();

    //larger the number the further secondDate is from the firstDate
    return difference;
};

export default function UpcomingEventsContainer(events) {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0
    const yyyy = date.getFullYear();

    const currentDate = `${yyyy}-${mm}-${dd}`;

    let eventsArr = events.events;
    const shownEvents = eventsArr.slice(0, events.events[0].displayNumber);

    ///filters out events that are past the current date
    eventsArr = eventsArr.filter((event) => {
        const eventFromDate = event.fromDate;
        const timeDifference = dateComparison(currentDate, eventFromDate);

        /// add if >= 0, since that means the starting date for the event is today or in the future
        if (timeDifference >= 0) {
            return true;
        } else {
            return false;
        }
    });

    return (
        <div style={{ width: "100%" }}>
            {shownEvents.map((event) => {
                return <UpcomingEvent eventData={event} />;
            })}
        </div>
    );
}
