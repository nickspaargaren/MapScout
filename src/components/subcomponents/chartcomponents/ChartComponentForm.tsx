import React, { useState, useEffect } from "react";
import "./styles/ChartComponentForm.css";

type ChartType = "donut" | "progress" | "line";

interface DonutData {
    label: string;
    number: number;
    percentage?: string;
}

interface LineData {
    x: string;
    y: number;
}

interface ChartData {
    current?: number;
    total?: number;
    units?: string;
    xLabel?: string;
    yLabel?: string;
    showNumber?: boolean;
    buttonLink?: string;
    buttonLabel?: string;
    donutData?: DonutData[];
    lineData?: LineData[];
}

interface ChartForm {
    type: ChartType;
    title: string;
    data: ChartData;
}

const ChartComponentForm = () => {
    const [chartState, setChartState] = useState<ChartForm>({
        type: "donut",
        title: "",
        data: {
            showNumber: true,
        },
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleTypeChange = (type: ChartType) => {
        setChartState({
            type,
            data: { ...chartState.data },
            title: chartState.title,
        });
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChartState({ ...chartState, title: e.target.value });
    };

    const handleDataChange = (key: string, value: string | number) => {
        setChartState((prev) => ({
            ...prev,
            data: { ...prev.data, [key]: value },
        }));
    };

    const handleDataViewChange = () => {
        setChartState({
            ...chartState,
            data: {
                ...chartState.data,
                showNumber: !chartState.data.showNumber,
            },
        });
    };

    const handleArrayDataChange = (
        index: number,
        key: string,
        value: string | number
    ) => {
        setChartState((prev) => {
            const newData =
                prev.type === "donut"
                    ? [...(prev.data.donutData || [])]
                    : [...(prev.data.lineData || [])];
            newData[index] = { ...newData[index], [key]: value };

            if (newData.length > 0 && chartState.type === "donut") {
                let sum = 0;
                newData.forEach((row) => {
                    sum += row.number;
                });
                newData.forEach((row) => {
                    row.percentage = ((row.number / sum) * 100).toFixed(1) + "%";
                });
            }
            return {
                ...prev,
                data: {
                    ...prev.data,
                    [prev.type === "donut" ? "donutData" : "lineData"]: newData,
                },
            };
        });
    };

    const addDataRow = () => {
        setChartState((prev) => {
            if (prev.type === "donut") {
                const donutData = [
                    ...(prev.data.donutData || []),
                    { label: "Item X", number: 0, percentage: "0%" },
                ];
                return { ...prev, data: { ...prev.data, donutData } };
            } else if (prev.type === "line") {
                const lineData = [
                    ...(prev.data.lineData || []),
                    { x: "Item X", y: 0 },
                ];
                return { ...prev, data: { ...prev.data, lineData } };
            }
            return prev;
        });
    };

    const renderDataTable = () => {
        switch (chartState.type) {
            case "donut":
                return (
                    <table className="data-table" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th>Label</th>
                                <th>Number</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartState.data.donutData?.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.label}
                                            onChange={(e) =>
                                                handleArrayDataChange(
                                                    index,
                                                    "label",
                                                    e.target.value
                                                )
                                            }
                                            style={{
                                                width: "100%",
                                                padding: isMobile ? "6px" : "8px",
                                                fontSize: isMobile ? "14px" : "16px",
                                            }}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.number}
                                            onChange={(e) =>
                                                handleArrayDataChange(
                                                    index,
                                                    "number",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            style={{
                                                width: "100%",
                                                padding: isMobile ? "6px" : "8px",
                                                fontSize: isMobile ? "14px" : "16px",
                                            }}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.percentage}
                                            onChange={(e) =>
                                                handleArrayDataChange(
                                                    index,
                                                    "percentage",
                                                    e.target.value
                                                )
                                            }
                                            disabled
                                            style={{
                                                width: "100%",
                                                padding: isMobile ? "6px" : "8px",
                                                fontSize: isMobile ? "14px" : "16px",
                                                backgroundColor: "#e9e9e9",
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case "line":
                return (
                    <table className="data-table" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th>X-axis</th>
                                <th>Y-axis</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartState.data.lineData?.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.x}
                                            onChange={(e) =>
                                                handleArrayDataChange(
                                                    index,
                                                    "x",
                                                    e.target.value
                                                )
                                            }
                                            style={{
                                                width: "100%",
                                                padding: isMobile ? "6px" : "8px",
                                                fontSize: isMobile ? "14px" : "16px",
                                            }}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.y}
                                            onChange={(e) =>
                                                handleArrayDataChange(
                                                    index,
                                                    "y",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            style={{
                                                width: "100%",
                                                padding: isMobile ? "6px" : "8px",
                                                fontSize: isMobile ? "14px" : "16px",
                                            }}
                                            required
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            default:
                return null;
        }
    };

    const renderFields = () => {
        switch (chartState.type) {
            case "donut":
            case "line":
                return (
                    <div>
                        {renderDataTable()}
                        <button
                            onClick={addDataRow}
                            style={{
                                backgroundColor: "#226DFF",
                                color: "#fff",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                marginTop: "16px",
                                // width: "100%",
                            }}
                        >
                            +
                        </button>
                    </div>
                );
            case "progress":
                return (
                    <div>
                        {/* Progress form fields go here */}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="chart-container">
            <div className="radio-group">
                <label>
                    <input
                        type="radio"
                        name="chartType"
                        value="donut"
                        checked={chartState.type === "donut"}
                        onChange={() => handleTypeChange("donut")}
                    />
                    Donut Chart
                </label>
                <label>
                    <input
                        type="radio"
                        name="chartType"
                        value="progress"
                        checked={chartState.type === "progress"}
                        onChange={() => handleTypeChange("progress")}
                    />
                    Progress Bar
                </label>
                <label>
                    <input
                        type="radio"
                        name="chartType"
                        value="line"
                        checked={chartState.type === "line"}
                        onChange={() => handleTypeChange("line")}
                    />
                    Line Graph
                </label>
            </div>
            <div className="field">
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={chartState.title}
                    onChange={handleTitleChange}
                    placeholder="Title"
                    style={{
                        width: "100%",
                        padding: isMobile ? "6px" : "8px",
                        fontSize: isMobile ? "14px" : "16px",
                    }}
                />
            </div>
            {renderFields()}
            <div className="footer">
                <button id="delete">Delete</button>
            </div>
            <div>
                <h4>Current Data:</h4>
                <pre>{JSON.stringify(chartState, null, 2)}</pre>
            </div>
        </div>
    );
};

export default ChartComponentForm;
