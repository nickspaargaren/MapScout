import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Button } from "./Button";

const ProgressBar = ({ value, goal, units = "dollars" }) => {
    const svgRef = useRef();
    const percentage = Math.min((value / goal) * 100, 100);

    useEffect(() => {
        const svg = d3.select(svgRef.current).attr("viewBox", `0 0 100 1`);
        svg.selectAll("*").remove();
        const xScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);
        const progressWidth = xScale(percentage);
        const barRadius = Math.min(progressWidth, 0.25);
        svg.selectAll("rect").remove();

        //Whole Bar rectangle
        svg.append("rect").attr("width", 100).attr("opacity", 0.3);
        //Progress rectangle
        svg.append("rect").attr("width", progressWidth);

        //Shared styling
        svg.selectAll("rect")
            .attr("height", 0.3)
            .attr("y", 0)
            .attr("x", 0)
            .attr("fill", "#226DFF")
            .attr("rx", barRadius);
    }, []);

    return (
        <div style={{ width: "100%", display: "block" }}>
            <div
                className=""
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <p
                    style={{
                        fontWeight: "600",
                        margin: "0",
                        fontSize: "1.15rem",
                    }}
                >
                    {`${value} ${units}`}
                    <span
                        style={{
                            color: "#333333",
                            opacity: "80%",
                            fontSize: ".95rem",
                            fontWeight: "normal",
                        }}
                    >
                        {` out of ${goal} ${units} goal`}
                    </span>
                </p>
                <p
                    style={{
                        margin: "0",
                        fontSize: "1rem",
                        position: "relative",
                        top: "8px",
                    }}
                >
                    {String(percentage) + "%"}
                </p>
            </div>
            <svg ref={svgRef} style={{ width: "100%" }}></svg>
            <Button link={"https://youtube.com"} label={"Donate Now"} />
        </div>
    );
};

export default ProgressBar;
