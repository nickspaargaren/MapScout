import React, { useState, useEffect, useMemo } from "react";
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
import EventInfoComponent from "components/dashboard/EventInfoComponent";
import {
    ICalendarData,
} from "components/dashboard/calender-component/CalendarForm";
import UpcomingEventsContainer from "components/dashboard/calender-component/UpcomingEventContainer";
import CalendarEvent from "components/dashboard/calender-component/CalendarEvent";

const calenderData: ICalendarData = {
    displayNumber: 5,
    events: [
        //NON-CUSTOM, EXPIRED EVENT DATE CASE (SHOULD NOT BE SHOWN)
        {
            eventName: "Morning Yoga Class",
            fromDate: "2025-01-01", // Start date
            toDate: "2025-11-01", // End date (same as start date)
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
            fromDate: "2025-01-01", // Start date
            toDate: "2025-11-29", // End date
            fromTime: "09:00",
            toTime: "17:00",
            isAllDay: false,
            isCustom: true,
            address: "Tech Park Auditorium",
            description:
                "A 3-day conference with keynotes and workshops on technology trends.",
            repeatDays: ["Tuesday", "Thursday"],
            customEndDate: "2025-11-12",
            customEndOccurrences: 1,
            isOn: true,
            isAfter: false,
            buttonLink: "https://techconf2024.com",
            buttonText: "Get Tickets",
        },
        //CUSTOM, ON, EXPIRED CUSTOM END DATE, NON-EXPIRED EVENT END DATE (SHOULD BE SHOWN ON ANY DAY SINCE THE CUSTOM END DATE IS PAST AND NOT EXPIRED EVENT DATE)
        {
            eventName: "Weekly Community Meetup",
            fromDate: "2025-01-01", // Start date
            toDate: "2025-12-15", // End date
            fromTime: "18:00",
            toTime: "20:00",
            isAllDay: false,
            isCustom: true,
            address: "Local Library, Meeting Room 2",
            description:
                "A weekly gathering for community discussions and activities.",
            repeatDays: ["Sunday", "Tuesday"],
            customEndDate: "2025-11-02",
            customEndOccurrences: 8,
            isOn: true,
            isAfter: false,
            buttonLink: "https://communitymeetup.org",
            buttonText: "Join Us",
        },
        //NON-CUSTOM, NON-EXPIRED EVENT DATE CASE (SHOULD BE SHOWN AND SHOULD SHOW ALL DAY IN EVENT TILE)
        {
            eventName: "Art Workshop for Beginners",
            fromDate: "2025-01-01", // Start date
            toDate: "2025-11-29", // End date (same as start date)
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

const galleryData = [
    {
        title: "Urban Tree Fundraiser",
        description:
            "Last Friday, we gathered for food, fun, and giving back at Urban Tree cidery. All proceeds from the evening went to our Bereavement fund. Everyone remembered to bring a sweater because the back deck got cold. We enjoyed drinks, games, and more!",
        imgLink:
            "https://firebasestorage.googleapis.com/v0/b/gtbog-pacts.appspot.com/o/images%2FA5_5_3.png?alt=media&token=9b4befbc-5158-4de6-9f8f-fbe488e84703",
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
    const sections = props.item.content?.sections ?? [];

    const components = useMemo(() => {
        return sections.flatMap((section) => section.components);
    }, [sections]);

    const renderComponent = (component) => {
        const { type, data } = component;
        // console.log(data);
        switch (type) {
            case "Calendar":
                return (
                    <Collapsible
                        label={type}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <UpcomingEventsContainer
                            events={data.events}
                            displayNumber={data.displayNumber}
                        />
                    </Collapsible>
                );
            case "Chart":
                switch (data.type) {
                    case "donut":
                        return (
                            <Collapsible
                                label={type}
                                style={{
                                    maxWidth: "1000px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                <DonutChart
                                    data={data.data.donutData}
                                    buttonLink={data.data.buttonLink}
                                    buttonLabel={data.data.buttonLabel}
                                ></DonutChart>
                            </Collapsible>
                        );
                    case "progress":
                        return (
                            <Collapsible
                                label={type}
                                style={{
                                    maxWidth: "1000px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                <ProgressBar
                                    current={data.data.current}
                                    total={data.data.total}
                                    units={data.data.units}
                                    buttonLink={data.data.buttonLink}
                                    buttonLabel={data.data.buttonLabel}
                                ></ProgressBar>
                            </Collapsible>
                        );
                    case "line":
                        return (
                            <Collapsible
                                label={type}
                                style={{
                                    maxWidth: "1000px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                <LineChart
                                    title={data.title}
                                    data={data.data.lineData}
                                ></LineChart>
                            </Collapsible>
                        );
                    default:
                        return <></>;
                }
            case "Gallery":
                return (
                    <Collapsible
                        label={type}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        {console.log(data)}
                        <ProviderGalleryCarousel
                            slidesArray={data.slidesArray}
                        ></ProviderGalleryCarousel>
                    </Collapsible>
                );
            case "Directory":
                return (
                    <Collapsible
                        label={type}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <Directory directoryItems={data.items}></Directory>
                    </Collapsible>
                );
            case "Embed":
                const eventInfo = {
                    title: data.title,
                    videoUrl: data.embedLink,
                }
                return (
                    <Collapsible
                        label={eventInfo.title}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <EmbedComponent eventInfo={eventInfo}></EmbedComponent>
                    </Collapsible>
                );
            case "Text":
                return (
                    <Collapsible
                        label={data.title}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <EventInfoComponent description={data.description}></EventInfoComponent>
                    </Collapsible>
                );
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
                <Card style={{ width: "100%" }}>
                    <LazyLoad debounce={false} offsetVertical={500}>
                        <Card.Img style={{ maxHeight: "60vh", objectFit: "cover" }} src={image} />
                    </LazyLoad>
                </Card>
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
                            {renderComponent(component)}
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
        </Container >
    );
};

export default compose<any>(
    withFirestore,
    connect((state: Storage) => ({
        providers: state.firestore.ordered.providers,
        firebase: state.firebase,
    }))
)(ProviderInfo);
