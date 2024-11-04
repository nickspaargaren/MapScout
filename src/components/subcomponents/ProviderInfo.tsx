import React, { useState, useEffect } from "react";
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
import GeneralInfo from "components/dashboard/GeneralInfo";

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
        }
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

    

    return (
        <Container fluid className="provider-info-container">
            <Row className="mb-3">
                <Card style={{ width: "100%" }}>
                    <LazyLoad debounce={false} offsetVertical={500}>
                        <Card.Img style={{ maxHeight: "60vh", objectFit: "cover" }} src={image} />
                    </LazyLoad>
                </Card>
            </Row>
            {/* Sample components that in the future should be added dynamically
            based on the response from firebase */}
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
            {/* Sample components that in the future should be added dynamically
            based on the response from firebase */}
            <Row className="info-rows" >
                <Col md={12} >
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

export default compose<any>(
    withFirestore,
    connect((state: Storage) => ({
        providers: state.firestore.ordered.providers,
        firebase: state.firebase,
    })),
)(ProviderInfo);
