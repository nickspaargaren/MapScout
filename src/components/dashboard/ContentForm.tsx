import "@fontsource/inter";

import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { ReactComponent as GrabberIcon } from "../../assets/svg/grabber.svg";
import { ReactComponent as PencilIcon } from "../../assets/svg/pencil.svg";
import { ReactComponent as CheckmarkIcon } from "../../assets/svg/checkmark.svg";

import styles from "./ContentForm.module.css";
import DirectoryForm from "./DirectoryForm";
import ChartComponentForm from "components/subcomponents/chartcomponents/ChartComponentForm";
import Collapsible from "components/collapsible";
import ProviderGallery from "./ProviderGallery";
import EmbedForm from "./embed-component/EmbedForm";
import CalendarForm, { ICalendarData } from "components/dashboard/calender-component/CalendarForm";

const calenderData: ICalendarData = {
    displayNumber: 5,
    events: [
        //NON-CUSTOM, EXPIRED EVENT DATE CASE (SHOULD NOT BE SHOWN)
        {
            eventName: "Morning Yoga Class",
            fromDate: "2024-11-01", // Start date
            toDate: "2024-11-01", // End date (same as start date)
            fromTime: "07:00",
            toTime: "08:30",
            isAllDay: false,
            isCustom: false,
            address: "Community Center, Main Hall",
            description: "Start your day with a refreshing yoga class.",
            repeatDays: ["Monday", "Wednesday", "Friday"],
            customEndDate: "",
            customEndOccurrences: 1,
            isOn: true,
            isAfter: false,
            buttonLink: "https://yogaclass.com/register",
            buttonText: "Register",
        },
        //CUSTOM, ON, NON-EXPIRED CUSTOM DATE, NON-EXPIRED EVENT DATE, NON-CURRENT DAY CASE (may be subject to IRL day rn!!!!) (SHOULD ONLY BE SHOWN ON TUESDAY, THURSDAY)
        {
            eventName: "Tech Conference 2024",
            fromDate: "2024-11-10", // Start date
            toDate: "2024-11-29", // End date
            fromTime: "09:00",
            toTime: "17:00",
            isAllDay: false,
            isCustom: true,
            address: "Tech Park Auditorium",
            description:
                "A 3-day conference with keynotes and workshops on technology trends.",
            repeatDays: ["Tuesday", "Thursday"],
            customEndDate: "2024-11-12",
            customEndOccurrences: 1,
            isOn: true,
            isAfter: false,
            buttonLink: "https://techconf2024.com",
            buttonText: "Get Tickets",
        },
        //CUSTOM, ON, EXPIRED CUSTOM END DATE, NON-EXPIRED EVENT END DATE (SHOULD BE SHOWN ON ANY DAY SINCE THE CUSTOM END DATE IS PAST AND NOT EXPIRED EVENT DATE)
        {
            eventName: "Weekly Community Meetup",
            fromDate: "2024-10-15", // Start date
            toDate: "2024-12-15", // End date
            fromTime: "18:00",
            toTime: "20:00",
            isAllDay: false,
            isCustom: true,
            address: "Local Library, Meeting Room 2",
            description:
                "A weekly gathering for community discussions and activities.",
            repeatDays: ["Sunday", "Tuesday"],
            customEndDate: "2024-11-2",
            customEndOccurrences: 8,
            isOn: true,
            isAfter: false,
            buttonLink: "https://communitymeetup.org",
            buttonText: "Join Us",
        },
        //NON-CUSTOM, NON-EXPIRED EVENT DATE CASE (SHOULD BE SHOWN AND SHOULD SHOW ALL DAY IN EVENT TILE)
        {
            eventName: "Art Workshop for Beginners",
            fromDate: "2024-11-05", // Start date
            toDate: "2024-11-29", // End date (same as start date)
            fromTime: "00:00",
            toTime: "23:59",
            isAllDay: true,
            isCustom: false,
            address: "Downtown Art Studio",
            description:
                "Learn the basics of painting in a supportive group setting.",
            repeatDays: [],
            customEndDate: "",
            customEndOccurrences: 1,
            isOn: true,
            isAfter: false,
            buttonLink: "https://artworkshop.com/signup",
            buttonText: "Sign Up",
        },
        //CUSTOM, AFTER 2 OCCURRANCES, NON-EXPIRED EVENT CASE (SHOULD BE SHOWN ON SET WEEKDAY(S) UNTIL OCCURANCES HAVE BEEN ACCOUNTED FOR)
        {
            eventName: "Monthly Board Game Night",
            fromDate: "2024-10-26",
            toDate: "2024-11-29",
            fromTime: "19:00",
            toTime: "23:00",
            isAllDay: false,
            isCustom: true,
            address: "The Game Lounge",
            description: "Join us for an evening of board games and fun!",
            repeatDays: ["Saturday"],
            customEndDate: "2025-01-18",
            customEndOccurrences: 2,
            isOn: false,
            isAfter: true,
            buttonLink: "https://gamenight.com",
            buttonText: "Reserve Your Spot",
        },
    ],
};

const EditableText = ({ text, setText, isEditing, setIsEditing }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleChange = (e) => {
        setText(e.target.value);
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ minWidth: "250px", marginRight: "8px" }}>
                {isEditing ? (
                    <Form.Control
                        type="text"
                        value={text}
                        placeholder="Section Title"
                        // className={styles.text}
                        ref={inputRef}
                        onChange={handleChange}
                        style={{
                            display: "inline-block",
                            paddingLeft: "5px",
                            maxHeight: "36px",
                            width: "250px",
                            lineHeight: "24px",
                            background: "transparent",
                            border: "none",
                            color: "black",
                            fontSize: "20px",
                            fontWeight: "400",
                            fontFamily: "Inter, sans-serif",
                        }}
                    ></Form.Control>
                ) : (
                    <div className={styles.editableLabel}>
                        <span
                            className={styles.text}
                            style={{
                                lineHeight: "24px",
                                color: `${text === "" ? "#6C757D" : "black"}`,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {text || "Section Title"}
                        </span>
                    </div>
                )}
            </div>

            <button
                type="button"
                style={{
                    border: "none",
                    background: "transparent",
                    padding: "0px",
                    margin: "0px",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                }}
                onClick={() => {
                    setIsEditing(!isEditing);
                }}
            >
                {isEditing ? (
                    <CheckmarkIcon height={20} width={20} />
                ) : (
                    <PencilIcon height={20} width={20} />
                )}
            </button>
        </div>
    );
};

const SectionCard = ({
    index,
    section,
    sections,
    setSections,
    setSelectedSection,
    isEditing,
    setIsEditing,
}) => {
    const [components, setComponents] = useState([]);
    return (
        <Container fluid className="p-0 h-100 d-flex flex-column" style={{ overflowY: "scroll" }}>
            <Row
                className=" w-100 d-inline-flex flex-row align-items-center justify-content-between"
                style={{
                    height: "40px",
                    margin: "0px 0px 16px 0px",
                    // whiteSpace: "nowrap",
                    // overflow: "hidden",
                }}
            >
                <EditableText
                    text={section.name}
                    setText={(text) => {
                        setSections([
                            ...sections.slice(0, index),
                            { ...sections[index], name: text },
                            ...sections.slice(index + 1),
                        ]);
                    }}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                />
                <button
                    className={styles.deleteButton}
                    type="button"
                    style={{
                        color: "#4f4f4f",
                        fontSize: "16px",
                        fontWeight: "500",
                        fontFamily: "Inter, sans-serif",
                    }}
                    onClick={() => {
                        setSelectedSection(null);
                        setSections((sections) =>
                            sections.filter((_, i) => i !== index)
                        );
                    }}
                >
                    Delete Section
                </button>
            </Row>
            {components.map((v, i) =>
                <Row className="flex-fill m-0 w-100" key={i}>
                    {v}
                </Row>
            )}
            <Row
                className="flex-fill m-0 w-100"
            >
                <Dropdown>
                    <Dropdown.Toggle
                        style={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "500",
                            fontFamily: "Inter, sans-serif",
                        }} id="dropdown-basic">
                        + Add Filter
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() =>
                            setComponents([...components,
                                <Collapsible
                                    titleStyle={{
                                        background: "white",
                                        color: "var(--chart-blue)",
                                        fontSize: "1.25rem",
                                        fontStyle: "normal",
                                        lineHeight: "24px"
                                    }}
                                    label={"Chart"}>
                                    <ChartComponentForm />
                                </Collapsible>
                        ])}>Chart</Dropdown.Item>
                        <Dropdown.Item onClick={() =>
                            setComponents([...components,
                            <Collapsible
                                style={{width: "100%"}}
                                titleStyle={{
                                    background: "white",
                                    color: "var(--chart-blue)",
                                    fontSize: "1.25rem",
                                    fontStyle: "normal",
                                    lineHeight: "24px"
                                }}
                                label={"Gallery"}>
                                <ProviderGallery />
                            </Collapsible>
                            ])}>Gallery</Dropdown.Item>
                        <Dropdown.Item onClick={() =>
                            setComponents([...components,
                            <Collapsible
                                style={{ width: "100%" }}
                                titleStyle={{
                                    background: "white",
                                    color: "var(--chart-blue)",
                                    fontSize: "1.25rem",
                                    fontStyle: "normal",
                                    lineHeight: "24px"
                                }}
                                label={"Directory"}>
                                <DirectoryForm items={[]} />
                            </Collapsible>
                            ])}>Directory</Dropdown.Item>
                        <Dropdown.Item onClick={() =>
                            setComponents([...components,
                            <Collapsible
                                style={{ width: "100%" }}
                                titleStyle={{
                                    background: "white",
                                    color: "var(--chart-blue)",
                                    fontSize: "1.25rem",
                                    fontStyle: "normal",
                                    lineHeight: "24px"
                                }}
                                label={"Embed"}>
                                <EmbedForm/>
                            </Collapsible>
                            ])}>Embed</Dropdown.Item>
                        <Dropdown.Item onClick={() =>
                            setComponents([...components,
                            <Collapsible
                                style={{ width: "100%" }}
                                titleStyle={{
                                    background: "white",
                                    color: "var(--chart-blue)",
                                    fontSize: "1.25rem",
                                    fontStyle: "normal",
                                    lineHeight: "24px"
                                }}
                                label={"Calendar"}>
                                <CalendarForm calendarData={calenderData} />
                            </Collapsible>
                            ])}>Calendar</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Row>
        </Container>
    );
};

const SectionButton = ({
    selectedSection,
    setSelectedSection,
    sectionInfo,
    index,
    setIsEditing,
}) => {
    // const [selected, setSelected] = useState()
    // const fillColor =
    const isSelected = selectedSection === index;
    const fillColor = isSelected ? "#226DFF" : "#828282";

    return (
        <button
            type="button"
            className={styles.sectionButton}
            onClick={() => {
                if (index !== selectedSection) {
                    setIsEditing(false);
                }
                setSelectedSection(index);
            }}
        >
            <Row noGutters className="h-100">
                <Col
                    className="h-100"
                    style={{
                        maxWidth: "12px",
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                        backgroundColor: `${isSelected ? "#226DFF" : "transparent"
                            }`,
                    }}
                ></Col>
                <Col
                    style={{
                        maxWidth: "32px",
                        margin: "12px 4px 12px 4px",
                    }}
                >
                    <GrabberIcon fill={fillColor}></GrabberIcon>
                </Col>
                <Col
                    className={`h-100 d-flex align-items-center text-truncate ${styles.text}`}
                    style={{
                        textAlign: "left",
                        lineHeight: "30px",
                        color: fillColor,
                    }}
                >
                    {sectionInfo.name || "Section Title"}
                </Col>
            </Row>
        </button>
    );
};

const ContentForm = ({ content, onChange }) => {
    const [selectedSection, setSelectedSection] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [sections, setSections] = useState(content);
    /*
      [
        {
          name: "Section 1",
          components: [],
        },
        {
          name: "Section 2",
          components: [],
        },
      ]
    */

    const updateSections = (newSections) => {
        setSections(newSections);
        onChange(newSections);
    };

    /*
    section objct
    {
      "name": "Section 1",
      "components": []
    }
    */

    return (
        <Row className="pl-3 pr-3" style={{ height: "700px" }}>
            <Col
                className="col-auto h-100"
                style={{
                    padding: "16px",
                    width: "264px",
                    backgroundColor: "#F1F4FA",
                    overflowY: "auto",
                }}
            >
                <h3
                    className={styles.text}
                    style={{
                        marginBottom: "12px",
                        lineHeight: "30px",
                    }}
                >
                    Sections
                </h3>
                {sections.map((section, index) => (
                    <SectionButton
                        key={index}
                        selectedSection={selectedSection}
                        setSelectedSection={setSelectedSection}
                        sectionInfo={section}
                        index={index}
                        setIsEditing={setIsEditing}
                    ></SectionButton>
                ))}
                <Button
                    style={{
                        width: "232px",
                        height: "44px",
                        lineHeight: "24px",
                    }}
                    className={styles.text}
                    onClick={() => {
                        updateSections([
                            ...sections,
                            { name: "", components: [] },
                        ]);
                    }}
                >
                    Add Section
                </Button>
            </Col>
            <Col
                className="h-100"
                style={{
                    backgroundColor: "#E3E9F5",
                    padding: "16px 16px 28px 16px",
                    width: "calc(100% - 264px)"
                }}
            >
                {selectedSection === null ? null : (
                    <SectionCard
                        index={selectedSection}
                        section={sections[selectedSection]}
                        sections={sections}
                        setSections={updateSections}
                        setSelectedSection={setSelectedSection}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                    ></SectionCard>
                )}
            </Col>
        </Row>
    );
};

export default ContentForm;
