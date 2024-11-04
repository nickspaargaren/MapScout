import React, { useState, useEffect } from "react";
import { FaRegClock } from "react-icons/fa";
import { SlGlobe } from "react-icons/sl";
import { TbPlaystationCircle } from "react-icons/tb";
import { IoPhonePortraitOutline } from "react-icons/io5";
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
import EmbedForm from "components/dashboard/embed-component/EmbedForm";
import EmbedComponent from "components/dashboard/embed-component/EmbedComponent";
import EventInfoComponent from "components/dashboard/EventInfoComponent";

{
    /*TO BE DELETED */
}
const eventInfo2 = {
    title: "Compnent TEXTTT",
    description: "Sample content",
};
const galleryData = [
    {
        title: "Urban Tree Fundraiser",
        description:
            "Last Friday, we gathered for food, fun, and giving back at Urban Tree cidery. All proceeds from the evening went to our Bereavement fund. Everyone remembered to bring a sweater because the back deck got cold. We enjoyed drinks, games, and more!",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    {
        title: "testVal2",
        description: "testing testing",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    {
        title: "testVal3",
        description: "testing testing",
        imgLink:
            "https://static.vecteezy.com/system/resources/thumbnails/005/857/332/small_2x/funny-portrait-of-cute-corgi-dog-outdoors-free-photo.jpg",
    },
    {
        title: "testVal4",
        description: "testing testing",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    {
        title: "testVal1",
        description: "testing testing",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    {
        title: "testVal2",
        description: "testing testing",
        imgLink:
            "https://static.vecteezy.com/system/resources/thumbnails/005/857/332/small_2x/funny-portrait-of-cute-corgi-dog-outdoors-free-photo.jpg",
    },
    {
        title: "testVal3",
        description: "testing testing",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    {
        title: "testVal4",
        description: "testing testing",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
];
const directoryData =
    [
        {
            name: "bob",
            description: "firefighter",
            details: "bob@gmail.com",
            image: "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
        },
        {
            name: "bob",
            description: "firefighter",
            details: "bob@gmail.com",
            image: "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
        },
        {
            name: "bob",
            description: "firefighter",
            details: "bob@gmail.com",
            image: "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
        },
        {
            name: "bob",
            description: "firefighter",
            details: "bob@gmail.com",
            image: "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
        },
];
const eventInfo = {
    title: "Tour Our Station",
    videoUrl: "https://www.youtube.com/watch?v=oZcKTf4RLQ8&ab_channel=HorizonsHealth",
    thumbnail: "https://picsum.photos/200",
};

const ProviderInfo = (props) => {
    const [image, setImage] = useState("bog");
    const [streetView, setStreetView] = useState("bog");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const res2 = await fetch(
                    `https://maps.googleapis.com/maps/api/staticmap?center=${props.item.latitude},${props.item.longitude}&zoom=16&scale=2&size=335x250&maptype=roadmap&key=${GOOGLE_API_KEY}&format=png&visual_refresh=true` +
                    `&markers=${props.item.latitude},${props.item.longitude}`,
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
    const iconStyle = {
        marginRight: "20px",
        verticalAlign: "middle",
        color: "#226DFF",
    };

    const infoStyle = {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    };

    return (
        <Container fluid className="provider-info-container">
            <Row className="mb-3">
                    <Card style={{width: "100%"}}>
                        <LazyLoad debounce={false} offsetVertical={500}>
                            <Card.Img style={{maxHeight: "60vh", objectFit: "cover"}} src={image} />
                        </LazyLoad>
                    </Card>
            </Row>
            {/* Sample components that in the future should be added dynamically
            based on the response from firebase */}
            <Collapsible
                label={"General Info"}
                style={{
                    maxWidth: "1000px",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
                containerStyle={{placeItems: "flex-start",}}
                    >
            <Row className="info-rows" style={{ justifyContent: "flex-start", maxWidth: "100%"}}>
            <Col md={12}>
                    <div className="description-box">
                        {props.item.description !== undefined && (
                            <p
                            style={{
                                color: "rgba(148, 142, 142, 0.9)",
                                fontFamily: "Inter",
                                fontWeight: "500",
                                fontSize: "16px",
                                lineHeight: "19px"
                                }}
                            >
                                {props.item.description}
                            </p>
                        )}
                    </div>
                </Col>
                <Col md={12}>
                    <div style={infoStyle}>
                        <IoPhonePortraitOutline size={20} style={iconStyle} />
                        <div>
                            {" "}
                            {props.item.phoneNum &&
                                props.item.phoneNum.join(", ")}
                        </div>
                    </div>
                    <div style={infoStyle}>
                        {props.item.website && props.item.website[0] && (
                            <>
                            {props.item.website[0].startsWith("http") ? (<>
                                <SlGlobe size={20} style={iconStyle} />
                                <div>
                                    <a
                                        href={props.item.website[0]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        p{props.item.website[0]}
                                    </a>
                                </div>
                            </>) : (<>
                                <SlGlobe size={20} style={iconStyle} />
                                <div>
                                    <a
                                        href={'//' + props.item.website[0]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {props.item.website[0]}
                                    </a>
                                </div></>)}
                                
                            </>
                        )} 
                    </div>
                    <div style={infoStyle}>
                        <TbPlaystationCircle size={20} style={iconStyle} />
                        <div>
                            {" "}
                            {props.item.address
                                .toString()
                                .split(",")
                                .map((value, index) => {
                                    if (index === 0) {
                                        return (
                                            <div style={{ display: "inline" }}>
                                                {value},
                                            </div>
                                        );
                                    }
                                    if (
                                        index ===
                                        props.item.address.toString().split(",")
                                            .length -
                                        1
                                    ) {
                                        return (
                                            <div style={{ display: "inline" }}>
                                                {value}
                                            </div>
                                        );
                                    }
                                    if (index === 1) {
                                        return (
                                            <div
                                                style={{ display: "inline" }}
                                            >{`${value},`}</div>
                                        );
                                    }
                                    return `${value},`;
                                })}
                        </div>
                    </div>
                    <div style={infoStyle}>
                        <FaRegClock size={20} style={iconStyle} />
                        <div className="modal-hours-container">
                            {props.item.hours && calculateHours(props)}
                        </div>
                    </div>
                </Col>
            </Row>
                    </Collapsible>
            <Row className="info-rows">
                <Col md={12}>
                    <Collapsible
                        label={"Gallery"}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}
                    >
                        {/*TO BE DELETED */}
                        <ProviderGalleryCarousel slidesArray={galleryData} />
                    </Collapsible>
                </Col>
            </Row>
            <Row className="info-rows">
                <Col md={12}>
                    <Collapsible
                        label={"Directory"}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}
                    >
                        <Directory
                            directoryItems={directoryData}
                        ></Directory>
                    </Collapsible>
                </Col>
            </Row>
            <Row className="info-rows">
                <Col md={12}>
                    <Collapsible
                        label={"Sample Embedded title"}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}
                    >
                        <EmbedComponent eventInfo={eventInfo} />
                    </Collapsible>
                </Col>
            </Row>
            <Row className="info-rows">
                <Col md={12}>
                    <Collapsible
                        label={eventInfo2.title}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}
                    >
                        <EventInfoComponent
                            description={eventInfo2.description}
                        />
                    </Collapsible>
                </Col>
            </Row>
            <div className="modalHeader">
                {categoriesToUse
                    .filter(
                        (category) =>
                            props.item[category.id] &&
                            props.item[category.id].length,
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
                                        },
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
                </Col>,
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
                </Col>,
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
                                index,
                            ),
                    )
                    : "CLOSED"}
            </Col>,
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
    })),
)(ProviderInfo);
