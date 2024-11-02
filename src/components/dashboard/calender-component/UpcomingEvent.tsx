import React from "react";
import { Button } from "react-bootstrap";

export default function UpcomingEvent({ eventData }) {
    const {
        displayNumber,
        eventName,
        fromDate,
        toDate,
        fromTime,
        toTime,
        isAllDay,
        isCustom,
        address,
        description,
        buttonText,
        buttonLink,
        repeatDays,
        customEndDate,
        customEndOccurrences,
        isOn,
        isAfter,
    } = eventData;

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            month: "long",
            day: "numeric",
        };
        return date.toLocaleDateString("en-US", options);
    }

    function formatTime(timeStr) {
        let [hours, minutes] = timeStr.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    }

    return (
        <div
            style={{
                display: "flex",
                paddingBottom: "10px",
                paddingTop: "10px",
                width: "100%",
                gap: "12px",
                borderBottom: "solid",
                borderColor: "#DFDFDF",
                borderWidth: "1px",
                justifyContent: "space-between",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    maxWidth: "20%",
                }}
            >
                <p
                    style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                >{`${formatDate(fromDate)} to ${formatDate(toDate)}`}</p>
                <p style={{ color: "rgba(148, 142, 142,0.9)" }}>{`${formatTime(
                    fromTime
                )} - ${formatTime(toTime)}`}</p>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    width: buttonLink && buttonText ? "33%" : "66%",
                }}
            >
                <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    {eventName}
                </p>
                <p
                    style={{
                        overflow: "auto",
                        maxHeight: "150px",
                        color: "rgba(148, 142, 142,0.9)",
                    }}
                >
                    {description}
                </p>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                    }}
                >
                    <p style={{ margin: "0px" }}>
                        {
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 13 13"
                                fill="none"
                                style={{ marginRight: "4px" }}
                            >
                                <path
                                    d="M6.29168 0.30249C6.86375 0.30249 7.4128 0.375992 7.93793 0.52388C8.46838 0.671768 8.96253 0.881644 9.4186 1.15351C9.87997 1.42095 10.2971 1.74417 10.6708 2.12231C11.0489 2.49601 11.3721 2.91311 11.6396 3.37449C11.9114 3.83055 12.1213 4.32469 12.2692 4.85514C12.4171 5.38028 12.4906 5.92933 12.4906 6.5014C12.4906 7.07347 12.4171 7.62429 12.2692 8.15474C12.1213 8.68076 11.9114 9.17402 11.6396 9.63539C11.3721 10.0923 11.0489 10.5094 10.6708 10.8876C10.2971 11.2613 9.87997 11.5845 9.4186 11.8564C8.96253 12.1238 8.46838 12.331 7.93793 12.4789C7.4128 12.6268 6.86375 12.7003 6.29168 12.7003C5.71961 12.7003 5.16879 12.6268 4.63834 12.4789C4.11232 12.331 3.61907 12.1238 3.15769 11.8564C2.70074 11.5845 2.28364 11.2613 1.90551 10.8876C1.5318 10.5094 1.20858 10.0923 0.936713 9.63539C0.669275 9.17402 0.462051 8.68076 0.314163 8.15474C0.166275 7.62429 0.0927734 7.07347 0.0927734 6.5014C0.0927734 5.92933 0.166275 5.38028 0.314163 4.85514C0.462051 4.32469 0.669275 3.83055 0.936713 3.37449C1.20858 2.91311 1.5318 2.49601 1.90551 2.12231C2.28364 1.74417 2.70074 1.42095 3.15769 1.15351C3.61907 0.881644 4.11232 0.671768 4.63834 0.52388C5.16879 0.375992 5.71961 0.30249 6.29168 0.30249ZM6.29168 11.8148C6.78051 11.8148 7.25074 11.7528 7.70326 11.6279C8.15489 11.4986 8.57731 11.3188 8.96872 11.0886C9.36545 10.8575 9.72588 10.5812 10.0482 10.2579C10.3715 9.9356 10.6477 9.57784 10.8789 9.18553C11.1091 8.7888 11.2871 8.36461 11.4111 7.91298C11.5404 7.46046 11.605 6.99023 11.605 6.5014C11.605 6.01257 11.5404 5.54235 11.4111 5.08983C11.2871 4.63819 11.1091 4.21576 10.8789 3.82435C10.6477 3.42762 10.3715 3.0672 10.0482 2.74486C9.72588 2.42163 9.36545 2.14534 8.96872 1.91421C8.57731 1.68397 8.15489 1.50596 7.70326 1.38198C7.25074 1.25269 6.78051 1.18805 6.29168 1.18805C5.80286 1.18805 5.33263 1.25269 4.88011 1.38198C4.42847 1.50596 4.00428 1.68397 3.60755 1.91421C3.21525 2.14534 2.85748 2.42163 2.53514 2.74486C2.21191 3.0672 1.93563 3.42762 1.7045 3.82435C1.47425 4.21576 1.29448 4.63819 1.16518 5.08983C1.04032 5.54235 0.978332 6.01257 0.978332 6.5014C0.978332 6.99023 1.04032 7.46046 1.16518 7.91298C1.29448 8.36461 1.47425 8.7888 1.7045 9.18553C1.93563 9.57784 2.21191 9.9356 2.53514 10.2579C2.85748 10.5812 3.21525 10.8575 3.60755 11.0886C4.00428 11.3188 4.42847 11.4986 4.88011 11.6279C5.33263 11.7528 5.80286 11.8148 6.29168 11.8148ZM6.29168 3.84472C6.65565 3.84472 6.99925 3.91381 7.32247 4.05195C7.6457 4.19099 7.92643 4.38226 8.16642 4.62667C8.41083 4.86666 8.60211 5.14738 8.74114 5.47061C8.87929 5.79384 8.94836 6.13744 8.94836 6.5014C8.94836 6.87068 8.87929 7.21604 8.74114 7.53927C8.60211 7.85719 8.41083 8.1388 8.16642 8.38321C7.92643 8.6232 7.6457 8.81182 7.32247 8.95085C6.99925 9.08899 6.65565 9.15808 6.29168 9.15808C5.92241 9.15808 5.57704 9.08899 5.25381 8.95085C4.9359 8.81182 4.65429 8.6232 4.40987 8.38321C4.16989 8.1388 3.98126 7.85719 3.84222 7.53927C3.70408 7.21604 3.63501 6.87068 3.63501 6.5014C3.63501 6.13744 3.70408 5.79384 3.84222 5.47061C3.98126 5.14738 4.16989 4.86666 4.40987 4.62667C4.65429 4.38226 4.9359 4.19099 5.25381 4.05195C5.57704 3.91381 5.92241 3.84472 6.29168 3.84472ZM6.29168 8.27252C6.5361 8.27252 6.76457 8.22646 6.97622 8.13437C7.19318 8.04227 7.38269 7.91475 7.54386 7.75358C7.70504 7.59241 7.83255 7.40556 7.92465 7.19303C8.01675 6.97607 8.0628 6.74581 8.0628 6.5014C8.0628 6.25699 8.01675 6.0285 7.92465 5.81685C7.83255 5.59989 7.70504 5.41039 7.54386 5.24922C7.38269 5.08805 7.19318 4.96053 6.97622 4.86844C6.76457 4.77634 6.5361 4.73028 6.29168 4.73028C6.04727 4.73028 5.81702 4.77634 5.60006 4.86844C5.38752 4.96053 5.20067 5.08805 5.0395 5.24922C4.87833 5.41039 4.75082 5.59989 4.65872 5.81685C4.56662 6.0285 4.52057 6.25699 4.52057 6.5014C4.52057 6.74581 4.56662 6.97607 4.65872 7.19303C4.75082 7.40556 4.87833 7.59241 5.0395 7.75358C5.20067 7.91475 5.38752 8.04227 5.60006 8.13437C5.81702 8.22646 6.04727 8.27252 6.29168 8.27252Z"
                                    fill="#226DFF"
                                />
                            </svg>
                        }
                        {address}
                    </p>
                </div>
            </div>
            {buttonLink && buttonText && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        width: "20%",
                        justifyContent: "center",
                    }}
                >
                    <Button href={buttonLink}>{buttonText}</Button>
                </div>
            )}
        </div>
    );
}
