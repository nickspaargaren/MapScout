import React, { useState, useEffect, useMemo } from "react";
import { FaMapMarkerAlt, FaRegClock, FaPhone, FaGlobe } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { withFirestore } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import LazyLoad from "react-lazy-load";
import { GOOGLE_API_KEY } from "../../config/keys";
import Linkify from "react-linkify";
import ProviderGalleryCarousel from "components/dashboard/ProviderGalleryCarousel";
import Collapsible from "components/collapsible";
import Directory from "components/dashboard/Directory";
import EmbedComponent from "components/dashboard/embed-component/EmbedComponent";
import DonutChart from "./chartcomponents/DonutChart";
import ProgressBar from "./chartcomponents/ProgressBar";
import LineChart from "./chartcomponents/LineChart";
import GeneralInfo from "components/dashboard/GeneralInfo";
import ReadMoreAndLess from "react-read-more-less";

// const eventInfo = {
//     title: "Tour Our Station",
//     videoUrl:
//         "https://www.youtube.com/watch?v=oZcKTf4RLQ8&ab_channel=HorizonsHealth",
//     // thumbnail: "https://picsum.photos/200",
// };

const ProviderInfo = (props) => {
    const [image, setImage] = useState("bog");
    const [streetView, setStreetView] = useState("bog");
    const [isLoading, setIsLoading] = useState(true);
    const sections = props.item.content?.sections ?? [];

    const components = useMemo(() => {
        return sections.flatMap((section) => section.components);
    }, [sections]);

    const renderComponent = (component) => {
        const { type, data } = component;
        // console.log(data);
        switch (type) {
            case "Chart":
                switch (data.type) {
                    case "donut":
                        return (
                            <DonutChart
                                data={data.data.donutData}
                                buttonLink={data.data.buttonLink}
                                buttonLabel={data.data.buttonLabel}
                            ></DonutChart>
                        );
                    case "progress":
                        return (
                            <ProgressBar
                                current={data.data.current}
                                total={data.data.total}
                                units={data.data.units}
                                buttonLink={data.data.buttonLink}
                                buttonLabel={data.data.buttonLabel}
                            ></ProgressBar>
                        );
                    case "line":
                        return (
                            <LineChart
                                title={data.title}
                                data={data.data.lineData}
                            ></LineChart>
                        );
                    default:
                        return <></>;
                }
            case "Gallery":
                return (
                    <ProviderGalleryCarousel
                        slidesArray={data.slidesArray}
                    ></ProviderGalleryCarousel>
                );
            case "Directory":
                return <Directory directoryItems={data.items}></Directory>;
            case "Embed":
                const eventInfo = {
                    title: data.title,
                    videoUrl: data.embedLink,
                }
                return <EmbedComponent eventInfo={eventInfo}></EmbedComponent>;
            default:
                return <></>;
        }
    };

    useEffect(() => {
        // console.log(props.item.content);
        async function fetchData() {
            setIsLoading(true);
            try {
                const res2 = await fetch(
                    `https://maps.googleapis.com/maps/api/staticmap?center=${props.item.latitude},${props.item.longitude}&zoom=16&scale=2&size=335x250&maptype=roadmap&key=${GOOGLE_API_KEY}&format=png&visual_refresh=true` +
                        `&markers=${props.item.latitude},${props.item.longitude}`
                );
                setStreetView(res2.url);
                setImage(props.item.imageURL);
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [props.item]);

    if (isLoading) {
        return (
            <div className="spinner-wrap">
                <div className="spinner"></div>
            </div>
        );
    }

    const categoriesToUse = props.categories || [];

    

    return (
        <Container fluid className="provider-info-container">
            <Row className="mb-3">
                <Col md={5} className="modal-image-col">
                    <Card>
                        <LazyLoad debounce={false} offsetVertical={500}>
                            <Card.Img src={image} />
                        </LazyLoad>
                    </Card>
                </Col>
                <Col md={7}>
                    <div className="description-box">
                        <h3>{props.item.facilityName}</h3>
                        {props.item.description !== undefined && (
                            <ReadMoreAndLess
                                charLimit={250}
                                readMoreText="Read more"
                                readLessText="Read less"
                            >
                                {`${props.item.description} `}
                            </ReadMoreAndLess>
                        )}
                    </div>
                </Col>
            </Row>
            <Row className="info-rows">
                <Col md={12}>
                    <Collapsible
                        label={"General Info"}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                        containerStyle={{ placeItems: "flex-start", }}
                    >
                        <GeneralInfo item={props.item} />
                    </Collapsible>
                </Col>
            </Row>
            {components.map((component) => {
                // console.log(component);
                return (
                    <Row className="info-rows">
                        <Col md={12}>
                            <Collapsible
                                label={component.type}
                                style={{
                                    maxWidth: "1000px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                {renderComponent(component)}
                            </Collapsible>
                        </Col>
                    </Row>
                );
            })}
            <div className="modalHeader">
                {categoriesToUse
                    .filter(
                        (category) =>
                            props.item[category.id] &&
                            props.item[category.id].length
                    )
                    .map((category) => (
                        <div>
                            <h5>{category.name}</h5>
                            <hr className="modal-hr" />
                            <div>
                                {category.select_type !== 0 ? (
                                    props.item[category.id].map(
                                        (selected, index) => {
                                            if (
                                                index !==
                                                props.item[category.id].length -
                                                    1
                                            ) {
                                                return (
                                                    <div className="modal-text">
                                                        {`${selected}, `}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div className="modal-text">
                                                    {selected}
                                                </div>
                                            );
                                        }
                                    )
                                ) : (
                                    <Linkify>
                                        <p>{props.item[category.id]}</p>
                                    </Linkify>
                                )}
                            </div>
                            <br />
                        </div>
                    ))}
            </div>
        </Container>
    );
};

function calculateHours(props) {
    const rows = [];
    const startandFinish = [0]; // In pairs, keep track of the starting and ending days with same time
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const abbrevDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (let i = 1; i < 7; i++) {
        // not both undefined
        if (props.item.hours[days[i]] !== props.item.hours[days[i - 1]]) {
            if (
                !props.item.hours[days[i]] ||
                !props.item.hours[days[i - 1]] ||
                props.item.hours[days[i]][0] !==
                    props.item.hours[days[i - 1]][0] ||
                props.item.hours[days[i]][1] !==
                    props.item.hours[days[i - 1]][1]
            ) {
                startandFinish.push(i - 1);
                startandFinish.push(i);
            }
        }
        if (i === 6) {
            startandFinish.push(6);
        }
    }
    for (let i = 0; i < startandFinish.length; i += 2) {
        const children = [];
        if (startandFinish[i] === startandFinish[i + 1]) {
            children.push(
                <Col className="modal-col-flex-end" sm={5}>
                    {days[startandFinish[i]]}
                </Col>
            );
        } else {
            const subchild = [
                <div>
                    {abbrevDays[startandFinish[i]]} -{" "}
                    {abbrevDays[startandFinish[i + 1]]}
                </div>,
            ];
            children.push(
                <Col className="modal-col-flex-end" sm={5}>
                    {subchild}
                </Col>
            );
        }
        children.push(
            <Col className="modal-col-flex-start">
                {props.item.hours[days[startandFinish[i]]]
                    ? props.item.hours[days[startandFinish[i]]].map(
                          (time, index) =>
                              formatTime(
                                  props.item.hours[days[startandFinish[i]]],
                                  time,
                                  index
                              )
                      )
                    : "CLOSED"}
            </Col>
        );
        rows.push(<Row>{children}</Row>);
    }
    return rows;

    //   <Row>
    //   <Col className="modal-col-flex-end" sm={5}>
    //     <div>
    //         Monday
    //     </div>
    //   </Col>
    //   <Col className="modal-col-flex-start">
    //     <div>
    //       {' '}
    //       {props.item.hours.Monday ? props.item.hours.Monday.map((time, index) => formatTime(props.item.hours.Monday, time, index)) : 'CLOSED'}
    //     </div>
    //   </Col>
    // </Row>
}

function formatTime(arr, time, index) {
    if (time == null) {
        if (index !== arr.length - 1) {
            return <div className="modal-text">CLOSED - </div>;
        }
        return <div className="modal-text">CLOSED</div>;
    }
    const seconds = time;
    let hours = Math.floor(seconds / 3600);
    let mins: string = ((seconds / 60) % 60).toString();
    const endtime_ending = hours < 12 ? "AM" : "PM";
    hours %= 12;
    if (hours === 0) {
        hours = 12;
    }
    if (parseInt(mins) < 10) {
        mins = `0${mins}`;
    }
    // time = Math.round(time/36);  //
    // if (time/100 > 12) { //check if hour
    //   time = time - 1200;
    //   endtime_ending = "PM";
    // }
    // let timestr = time.toString()
    // let timeformat = timestr.substring(0, timestr.length - 2) + ":" + timestr.substring(timestr.length - 2) + endtime_ending;
    const timeformat = `${hours}:${mins}${endtime_ending}`;
    if (index !== arr.length - 1) {
        return <div className="modal-text">{timeformat} - </div>;
    }
    return <div className="modal-text">{timeformat}</div>;
}

export default compose<any>(
    withFirestore,
    connect((state: Storage) => ({
        providers: state.firestore.ordered.providers,
        firebase: state.firebase,
    }))
)(ProviderInfo);
