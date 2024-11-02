import React, { useState, useEffect } from "react";
import CalendarEvent from "./CalendarEvent";

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

export default function CalendarForm({
    eventsArray = [],
}: {
    eventsArray: CalendarEvent[];
}) {
    const defaultEvent: CalendarEvent = {
        displayNumber: 5,
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
    };

    const [events, setEvents] = useState<CalendarEvent[]>(
        eventsArray.length > 0 ? eventsArray : [{ ...defaultEvent }]
    );

    const handleEventDataChange = (
        index: number,
        field: keyof CalendarEvent,
        value: string | number | boolean | string[],
        additionalUpdates: Partial<CalendarEvent> = {}
    ) => {
        setEvents((prevEvents) => {
            return prevEvents.map((event, i) =>
                i === index
                    ? { ...event, [field]: value, ...additionalUpdates }
                    : event
            );
        });
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

    const renderevents = () => {
        return events.map((event, i) => (
            <CalendarEvent
                eventData={{ ...event }}
                index={i}
                key={i}
                handleEventDataChange={handleEventDataChange}
                handleAllDayUpdate={handleAllDayUpdate}
                handleDelete={handleDelete}
                handleAdd={handleAdd}
            />
        ));
    };

    return (
        <div style={{ width: "100%", margin: "0px" }}>
            {renderevents()}
            <div>
                <h4>Current Data:</h4>
                <pre>{JSON.stringify(events, null, 2)}</pre>
            </div>
        </div>
    );
}
