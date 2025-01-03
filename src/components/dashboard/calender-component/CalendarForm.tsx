import React, { useState, useEffect } from "react";
import CalendarEvent from "./CalendarEvent";

export interface ICalendarEvent {
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

export interface ICalendarData {
    events: ICalendarEvent[];
    displayNumber: number;
}

export default function CalendarForm({
    calendarData,
}: {
    calendarData: ICalendarData;
}) {
    const defaultEvent: ICalendarEvent = {
        eventName: "",
        fromDate: "",
        toDate: "",
        fromTime: "",
        toTime: "",
        isAllDay: false,
        isCustom: false,
        address: "",
        description: "",
        repeatDays: [],
        customEndDate: "",
        customEndOccurrences: 1,
        isOn: true,
        isAfter: false,
        buttonLink: "",
        buttonText: "",
    };

    const [events, setEvents] = useState<ICalendarEvent[]>(
        calendarData.events.length > 0
            ? calendarData.events
            : [{ ...defaultEvent }]
    );

    const [displayNumber, setDisplayNumber] = useState<number>(
        calendarData.displayNumber
    );

    const handleEventDataChange = (
        index: number,
        field: keyof ICalendarEvent,
        value: string | number | boolean | string[],
        additionalUpdates: Partial<ICalendarEvent> = {}
    ) => {
        setEvents((prevEvents) => {
            return prevEvents.map((event, i) =>
                i === index
                    ? { ...event, [field]: value, ...additionalUpdates }
                    : event
            );
        });
    };

    const handleDisplayNumberChange = (value: number) => {
        setDisplayNumber(value);
    };

    const handleAllDayUpdate = (index: number, isAllDay: boolean) => {
        setEvents((prevEvents) => {
            return prevEvents.map((event, i) =>
                i === index
                    ? {
                        ...event,
                        isAllDay,
                        fromTime: isAllDay ? "00:00" : "",
                        toTime: isAllDay ? "23:59" : "",
                    }
                    : event
            );
        });
    };

    const handleDelete = (index: number) => {
        if (events.length > 1) {
            setEvents((prevEvents) => prevEvents.filter((_, i) => i !== index));
        }
    };

    const handleAdd = (index: number) => {
        setEvents((prevEvents) => {
            const newEvents = [...prevEvents];
            const newEvent = { ...defaultEvent };

            if (index === newEvents.length - 1) {
                newEvents.push(newEvent);
            } else {
                newEvents.splice(index + 1, 0, newEvent);
            }
            return newEvents;
        });
    };

    const renderEvents = () => {
        return events.map((event, i) => (
            <CalendarEvent
                displayNumber={displayNumber}
                eventData={{ ...event }}
                index={i}
                key={i}
                length={events.length}
                handleEventDataChange={handleEventDataChange}
                handleDisplayNumberChange={handleDisplayNumberChange}
                handleAllDayUpdate={handleAllDayUpdate}
                handleDelete={handleDelete}
                handleAdd={handleAdd}
            />
        ));
    };

    return (
        <div style={{ width: "100%", margin: "0px" }}>
            {renderEvents()}
            <div>
                <h4>Current Data:</h4>
                <pre>{JSON.stringify({ displayNumber, events }, null, 2)}</pre>
            </div>
        </div>
    );
}
