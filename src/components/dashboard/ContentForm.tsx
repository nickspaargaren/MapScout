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
import { SimpleEditor } from "./TextComponent/SimpleEditor";
import CalendarForm from "components/dashboard/calender-component/CalendarForm";

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
    // const [components, setComponents] = useState(section.components);
    // const [componentStates, setComponentStates] = useState({});
    /* 
        components = [{
            type: "Chart",
            data: {},
        }]
    */
    const { components } = section;

    const getDefaultData = (componentType) => {
        switch (componentType) {
            case "Calendar":
                return {
                    displayNumber: 5,
                    events: [{
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
                    }]
                };
            case "Chart":
                return {
                    type: "donut",
                    title: "",
                    data: {
                        showNumber: true,
                    },
                };
            case "Directory":
                return {
                    items: [
                        { name: "", description: "", details: "", image: "" },
                    ],
                };
            case "Embed":
                return {
                    embedLink: "",
                    title: "",
                };
            case "Gallery":
                return {
                    slidesArray: [
                        {
                            title: "",
                            description: "",
                            imgLink: "",
                        },
                    ],
                };
            case "Text":
                return {
                    title: "Text",
                    description: '<p>ex. "Changing lives one bit at a time..."</p>'
                }
            default:
                return {};
        }
    };

    const addComponent = (componentType) => {
        const componentObject = {
            type: componentType,
            data: getDefaultData(componentType),
        };
        updateComponents([...components, componentObject]);
    };
    const updateIthComponent = (newData, i) => {
        // console.log("here");
        // console.log(newData);
        const newComponents = components.map((component, iterator) => {
            return iterator === i
                ? { ...components[i], data: newData }
                : component;
        });
        updateComponents(newComponents);
    };
    const deleteIthComponent = (i) => {
        const newComponents = components.filter((_, iterator) => {
            return iterator !== i;
        });
        updateComponents(newComponents);
    };
    const updateComponents = (newComponents) => {
        const newSections = sections.map((sec, i) => {
            return i === index
                ? { ...section, components: newComponents }
                : sec;
        });
        // console.log(newSections);
        setSections(newSections);
        // console.log(sect)
        // console.log(sections);
    };

    const switchRender = (type, data, i) => {
        switch (type) {
            case "Calendar":
                return (
                    <CalendarForm
                        calendarData={data}
                        setCalendarData={(newData) => {
                            updateIthComponent(newData, i);
                        }}
                        deleteComponent={() => {
                            deleteIthComponent(i);
                        }}
                    ></CalendarForm>
                );
            case "Chart":
                return (
                    <ChartComponentForm
                        chartState={data}
                        setChartState={(newState) => {
                            updateIthComponent(newState, i);
                        }}
                        deleteComponent={() => {
                            deleteIthComponent(i);
                        }}
                    ></ChartComponentForm>
                );
            case "Directory":
                return (
                    <DirectoryForm
                        directoryState={data}
                        setDirectoryState={(newState) => {
                            updateIthComponent(newState, i);
                        }}
                        deleteComponent={() => {
                            deleteIthComponent(i);
                        }}
                    ></DirectoryForm>
                );
            case "Embed":
                return (
                    <EmbedForm
                        embedState={data}
                        setEmbedState={(newState) => {
                            updateIthComponent(newState, i);
                        }}
                        deleteComponent={() => {
                            deleteIthComponent(i);
                        }}
                    ></EmbedForm>
                );
            case "Gallery":
                return (
                    <ProviderGallery
                        galleryState={data}
                        setGalleryState={(newState) => {
                            updateIthComponent(newState, i);
                        }}
                        deleteComponent={() => {
                            deleteIthComponent(i);
                        }}
                    ></ProviderGallery>
                );
            case "Text":
                return (
                    <SimpleEditor
                        editorState={data}
                        setEditorState={(newState) => {
                            updateIthComponent(newState, i);
                        }}
                        deleteComponent={() => {
                            deleteIthComponent(i);
                        }}
                    ></SimpleEditor>
                );
            default:
                return <></>;
        }
    };
    return (
        <Container
            fluid
            className={`${styles.card} p-0 h-100 d-flex flex-column`}
            style={{ overflowY: "scroll" }}
        >
            <Row
                className=" w-100 d-inline-flex flex-row align-items-center justify-content-between"
                style={{
                    height: "40px",
                    margin: "0px 0px 16px 0px",
                    // whiteSpace: "nowrap",
                    // overflow: "hidden",
                    paddingLeft: "5px",
                    paddingTop: "5px",
                    paddingRight: "5px",
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
                        setSections(
                            sections.filter((_, i) => i !== index)
                        );
                    }}
                >
                    Delete Section
                </button>
            </Row>
            {components.map((v, i) => (
                <Row className="flex-fill m-0 w-100" key={i}>
                    <Collapsible
                        style={{ width: "100%" }}
                        titleStyle={{
                            background: "white",
                            color: "var(--chart-blue)",
                            fontSize: "1.25rem",
                            fontStyle: "normal",
                            lineHeight: "24px",
                        }}
                        label={v.type}
                    >
                        {switchRender(v.type, v.data, i)}
                    </Collapsible>
                </Row>
            ))}
            <Row className="flex-fill m-0 w-100">
                <Dropdown>
                    <Dropdown.Toggle
                        style={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "500",
                            fontFamily: "Inter, sans-serif",
                        }}
                        id="dropdown-basic"
                    >
                        + Add Filter
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => addComponent("Calendar")}
                        >
                            Calendar
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => addComponent("Chart")}
                        >
                            Chart
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => addComponent("Directory")}
                        >
                            Directory
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => addComponent("Embed")}>
                            Embed
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => addComponent("Gallery")}>
                            Gallery
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => addComponent("Text")}>
                            Text
                        </Dropdown.Item>
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
        console.log("Sections:", newSections);
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
                    width: "calc(100% - 264px)",
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
