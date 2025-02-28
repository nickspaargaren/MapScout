import "@fontsource/inter";
import "./mapStyles.css";
import { useTour } from "@reactour/tour";
import { loadClinwikiProviders } from "functions/loadClinwikiProviders";
import queryString from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import { connect } from "react-redux";
import { isEmpty, isLoaded, withFirestore } from "react-redux-firebase";
import { Store } from "reducers/types";
import { compose } from "redux";
import { GOOGLE_API_KEY } from "../../config/keys";
import localizationStrings from "../../utils/Localization";
import ProviderInfo from "../subcomponents/ProviderInfo";
import GoogleMap from "./GoogleMap";
import ProviderCell from "./ProviderCell";
import searchIcon from "../../assets/img/searchicon.png";
import x from "../../assets/img/x.png";
import dropdownIcon from "../../assets/svg/chevron-down.svg";
import Switch from "react-switch";
import { MdChevronRight } from "react-icons/md";
import backArrow from '../../assets/img/back-arrow.png';

const frame = require("../../assets/svg/Frame.svg");

const debounce = require("lodash/debounce");
const classNames = require("classnames");

const FILTER_CUTOFF = 3;
const PAGE_SIZE = 100;

const getWidth = () =>
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

const Map = (props) => {
    const { setIsOpen } = useTour();
    const [upperPageBound, setUpperPageBound] = useState(PAGE_SIZE);
    const [filterActiveState, setFilterActiveState] = useState({
        filter1: false,
        filter2: false,
    });
    const [lowerPageBound, setLowerPageBound] = useState(0);
    const [currPage, setCurrPage] = useState(1);
    const [providers, setProviders] = useState([]);
    const [defaultView, setDefaultView] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeProviders, setActiveProviders] = useState([]);
    const [, setTempProviders] = useState([]);
    const [, setZipProviders] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [currmarker, setCurrmarker] = useState(-1);
    const [point, setPoint] = useState(true);
    const [distances, setDistances] = useState({});

    const [primaryColor, setPrimaryColor] = useState("");
    const [, setSecondaryColor] = useState("");
    const [defaultLat, setDefaultLat] = useState(0);
    const [defaultLong, setDefaultLong] = useState(0);
    const [defaultZoom, setDefaultZoom] = useState(1);
    const [isToggled, setIsToggled] = useState(defaultView);
    const [filtersState, setFiltersState] = useState({});
    const [filtersData, setFiltersData] = useState({});
    const [categories, setCategories] = useState([]);

    const [showInfo, setShowInfo] = useState(false)

    function handleCellClick(index) {
        setSelectedIndex(index);
        setShowInfo(true)
    }

    const items = [];
    items.push();

    const getTeam = useCallback(
        (e?) => {
            return props.location.pathname.replace("/", "");
        },
        [props.location.pathname]
    );

    const handleToggle = (checked) => {
        setIsToggled(checked);
        switchView();
    };

    const clinWikiMap = getTeam() === "clinwiki";

    const filterByTags = useCallback(
        (temp?) => {
            setTempProviders(temp);
            Object.keys(filtersState).forEach((filterName) => {
                temp = temp.filter((provider) =>
                    provider['filters'][filterName]
                        ? provider['filters'][filterName].some((r) =>
                              filtersState[filterName].includes(r)
                          ) || filtersState[filterName].length === 0
                        : true
                );
            });
            setActiveProviders(temp);
        },
        [filtersState]
    );

    const filterSearch = useCallback(
        (filterVal: string, zipCode?: string, zipProvs?) => {
            const regex = new RegExp(`${filterVal.toLowerCase()}`, "gi");
            let temp = zipCode ? zipProvs : providers;
            temp = temp.filter((item) => regex.test(item.facilityName));
            filterByTags(temp);
        },
        [filterByTags, providers]
    );

    // set filterIds from firestore in useeffect

    const filterNormalFilters = useCallback(
        (e?) => {
            const filterName = e.target.name;
            const filterVal = e.target.value;
            if (e.target.type === "checkbox" && e.target.checked) {
                setFiltersState({
                    ...filtersState,
                    [filterName]: [...filtersState[filterName], filterVal],
                });
            } else if (e.target.type === "checkbox" && !e.target.checked) {
                setFiltersState({
                    ...filtersState,
                    [filterName]: filtersState[filterName].filter(
                        (filter) => filter !== filterVal
                    ),
                });
            }
        },
        [filtersState]
    );

    useEffect(() => {
        async function fetchData() {
            const { firestore } = props;
            const collections = firestore.collection("categories");
            const data = {};
            const filtersObj = {};
            const cat = await collections
                .where("active", "==", true)
                .where("team", "==", getTeam())
                .get()
                .then((querySnapshot) => {
                    const arr = [];
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data();
                        arr.push({
                            name: docData.name,
                            options: docData.options,
                            priority: docData.priority,
                            select_type: docData.select_type,
                            id: doc.id,
                        });
                        if (
                            docData.select_type !== 0 &&
                            docData.options.length
                        ) {
                            data[doc.id] = {
                                name: docData.name,
                                options: docData.options,
                                priority: docData.priority,
                            };
                            filtersObj[doc.id] = [];
                        }
                    });
                    return arr;
                });
            setCategories(cat);

            setFiltersState(filtersObj);
            setFiltersData(data);

            const collections2 = firestore.collection("providers");
            let provs = await collections2
                .where("team", "==", getTeam())
                .get()
                .then((querySnapshot) => {
                    const arr = [];
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data();
                        arr.push(docData);
                    });
                    return arr;
                });

            if (clinWikiMap) {
                const parsed = queryString.parse(window.location.search);
                let clinWikiSearchHash = "";

                if (typeof parsed.searchHash == "string") {
                    clinWikiSearchHash = parsed.searchHash;
                }
                const clinwikiProviders = await loadClinwikiProviders(
                    clinWikiSearchHash
                );
                provs = [...provs, ...clinwikiProviders];
            }

            setProviders(provs);
            setActiveProviders(provs);

            const teamCollection = firestore.collection("teams").doc(getTeam());
            const teamData = await teamCollection
                .get()
                .then((doc) => doc.data());
            setPrimaryColor(teamData.primaryColor);
            setSecondaryColor(teamData.secondaryColor);
            setDefaultLat(teamData.latitude);
            setDefaultLong(teamData.longitude);
            setDefaultZoom(teamData.zoom);
            setIsLoading(false);
        }
        document.title = getTeam().toUpperCase();
        setIsLoading(true);
        fetchData().then((_r) => {
            setTempProviders(providers);
        });
    }, []);

    const filterZipcode = async (filterVal) => {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${filterVal}&key=${GOOGLE_API_KEY}`
        );
        const responseJson = await response.json();

        // Handle illegal response
        const filterLat = responseJson.results[0].geometry.location.lat;
        const filterLong = responseJson.results[0].geometry.location.lng;
        let providerLat;
        let providerLong;
        const filteredProviders = [];

        const R = 6371e3;
        const pi = Math.PI;
        const metersPerMile = 1609.344;
        const theta1 = filterLat * (pi / 180);

        providers.forEach((provider) => {
            providerLat = provider.latitude;
            providerLong = provider.longitude;
            const distance =
                Math.pow(Math.abs(filterLat - providerLat), 2) +
                Math.pow(Math.abs(filterLong - providerLong), 2);

            const theta2 = providerLat * (pi / 180);
            const deltaTheta = (providerLat - filterLat) * (pi / 180);
            const deltaLambda = (providerLong - filterLong) * (pi / 180);
            const a =
                Math.sin(deltaTheta / 2) * Math.sin(deltaTheta / 2) +
                Math.cos(theta1) *
                    Math.cos(theta2) *
                    Math.sin(deltaLambda / 2) *
                    Math.sin(deltaLambda / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const miDistance = (R * c) / metersPerMile;

            filteredProviders.push({
                provider,
                latLongdistance: distance,
                miDistance: Math.round(miDistance) + 1,
            });
        });

        filteredProviders.sort((a, b) =>
            a.latLongdistance > b.latLongdistance ? 1 : -1
        );

        const filterActiveProviders = [];
        const filterDistances = [];
        filteredProviders.forEach((provider) => {
            filterActiveProviders.push(provider.provider);
            const distKey = provider.provider.facilityName;
            filterDistances.push({ [distKey]: provider.miDistance });
        });
        setDistances(filterDistances);
        setZipProviders(filterActiveProviders);
        setTimeout(
            () => filterSearch(searchName, filterVal, filterActiveProviders),
            100
        );
    };

    const filterZipCodeOver100 = useCallback(
        (filterVal?) => {
            const filterProviders = activeProviders.filter((provider) => {
                return provider.address[0].includes(filterVal);
            });
            setActiveProviders(filterProviders);
        },
        [activeProviders]
    );

    const filterProviders = useCallback(
        (e?) => {
            if (typeof e !== "undefined") {
                const filtertype = e.target.getAttribute("itemType");
                const filterVal = e.target.value;
                if (filtertype === "search") {
                    setSearchName(filterVal);
                    filterSearch(e.target.value);
                } else if (filtertype === "zipcode") {
                    setSearchZip(filterVal.replace(/\D/g, ""));
                    if (filterVal.length === 5) {
                        if (providers.length > 10) {
                            filterZipCodeOver100(filterVal);
                        } else {
                            filterZipcode(filterVal);
                        }
                    } else if (filterVal.length === 0) {
                        setActiveProviders(providers);
                    } else if (Object.keys(distances).length !== 0) {
                        setDistances({});
                    }
                } else {
                    filterNormalFilters(e);
                }
            }
        },
        [
            distances,
            filterNormalFilters,
            setDistances,
            filterZipCodeOver100,
            providers.length,
            filterZipcode,
            filterSearch,
        ]
    );

    //const filterProviders = async (e?) => {
    // if (typeof e !== "undefined") {
    //     const filtertype = e.target.getAttribute("itemType");
    //     const filterVal = e.target.value;
    //     if (filtertype === "search") {
    //         setSearchName(filterVal);
    //         filterSearch(e.target.value);
    //     } else if (filtertype === "zipcode") {
    //         setSearchZip(filterVal.replace(/\D/g, ""));
    //         if (filterVal.length === 5) {
    //             if (providers.length > 10) {
    //                 filterZipCodeOver100(filterVal);
    //             } else {
    //                 await filterZipcode(filterVal);
    //             }
    //         } else if (distances !== {}) {
    //             setDistances({});
    //         }
    //     } else {
    //         await filterNormalFilters(e);
    //     }
    // }
    //};

    const handlePageChange = useCallback(
        (newPage) => {
            const pageDifference = newPage - currPage;
            let newLowerBound = lowerPageBound + pageDifference * PAGE_SIZE;

            setLowerPageBound(newLowerBound);
            let newUpperBound = upperPageBound + pageDifference * PAGE_SIZE;

            setUpperPageBound(newUpperBound);
            setCurrPage(newPage);
        },
        [currPage, lowerPageBound, upperPageBound]
    );

    useEffect(() => {
        if (isLoaded(providers)) {
            setTempProviders(providers);

            // grab the contents of the query string as an object
            // a prperly formatted query string with a search term and a zip looks like: mapscout.io/?zip=12345&q=asdf
            const parsed = queryString.parse(window.location.search);
            // if there exists a zip object in the querystring (i.e. mapscout.io/?zip=12345)
            if (typeof parsed.zip == "string") {
                filterProviders({
                    target: {
                        name: "queryZip",
                        value: parsed.zip,
                        type: "input",
                        getAttribute: (param) => "zipcode",
                    },
                });
            }
            // if there exists a q object in the querystring (i.e. mapscout.io/?q=12345)
            if (typeof parsed.q == "string") {
                filterProviders({
                    target: {
                        name: "querySearch",
                        value: parsed.q,
                        type: "input",
                        getAttribute: (param) => "search",
                    },
                });
            }
        }
    }, []);

    useEffect(() => {
        handlePageChange(1);
    }, [activeProviders]);

    const [width, setWidth] = useState(getWidth());

    useEffect(() => {
        const resizeListener = () => {
            setWidth(getWidth());
        };
        window.addEventListener("resize", resizeListener);
        return () => {
            window.removeEventListener("resize", resizeListener);
        };
    }, []);

    // const ref = useRef(null);

    // const filterProviders = async (e?) => {
    //     if (typeof e !== "undefined") {
    //         const filtertype = e.target.getAttribute("itemType");
    //         const filterVal = e.target.value;
    //         if (filtertype === "search") {
    //             setSearchName(filterVal);
    //             filterSearch(e.target.value);
    //         } else if (filtertype === "zipcode") {
    //             setSearchZip(filterVal.replace(/\D/g, ""));
    //             if (filterVal.length === 5) {
    //                 if (providers.length > 10) {
    //                     filterZipCodeOver100(filterVal);
    //                 } else {
    //                     await filterZipcode(filterVal);
    //                 }
    //             } else if (distances !== {}) {
    //                 setDistances({});
    //             }
    //         } else {
    //             await filterNormalFilters(e);
    //         }
    //     }
    // };

    /**
     * if number_of_providers <= 100:
     *    don't paginate
     * else
     *    paginate
     */

    function getPages() {
        let paginatedData = [];
        console.log(Math.ceil(providers.length / PAGE_SIZE) + 1);

        const maxPage = Math.ceil(activeProviders.length / PAGE_SIZE);
        // alert(maxPage)
        if (maxPage <= 4) {
            if (currPage <= 3) {
                for (let number = 1; number < maxPage + 1; number++) {
                    paginatedData.push(
                        <Pagination.Item
                            active={number === currPage}
                            activeLabel={number.toString()}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </Pagination.Item>
                    );
                }
            } else if (currPage > maxPage - 3) {
                paginatedData.push(<Pagination.Ellipsis />);
                for (let number = maxPage - 3; number <= maxPage; number++) {
                    paginatedData.push(
                        <Pagination.Item
                            active={number === currPage}
                            activeLabel={number.toString()}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </Pagination.Item>
                    );
                }
            } else {
                paginatedData.push(<Pagination.Ellipsis />);
                for (
                    let number = currPage - 1;
                    number <= currPage + 1;
                    number++
                ) {
                    paginatedData.push(
                        <Pagination.Item
                            active={number === currPage}
                            activeLabel={number.toString()}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </Pagination.Item>
                    );
                }
                paginatedData.push(<Pagination.Ellipsis />);
            }
        } else {
            if (currPage <= 3) {
                for (let number = 1; number < 5; number++) {
                    paginatedData.push(
                        <Pagination.Item
                            active={number === currPage}
                            activeLabel={number.toString()}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </Pagination.Item>
                    );
                }
                paginatedData.push(<Pagination.Ellipsis />);
            } else if (currPage > maxPage - 3) {
                paginatedData.push(<Pagination.Ellipsis />);
                for (let number = maxPage - 3; number <= maxPage; number++) {
                    paginatedData.push(
                        <Pagination.Item
                            active={number === currPage}
                            activeLabel={number.toString()}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </Pagination.Item>
                    );
                }
            } else {
                paginatedData.push(<Pagination.Ellipsis />);
                for (
                    let number = currPage - 1;
                    number <= currPage + 1;
                    number++
                ) {
                    paginatedData.push(
                        <Pagination.Item
                            active={number === currPage}
                            activeLabel={number.toString()}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </Pagination.Item>
                    );
                }
                paginatedData.push(<Pagination.Ellipsis />);
            }
        }
        return paginatedData;
    }

    function handlePaginationNext() {
        if (currPage !== Math.ceil(activeProviders.length / PAGE_SIZE)) {
            handlePageChange(currPage + 1);
        }
    }

    function handlePaginationPrev() {
        if (currPage !== 1) {
            handlePageChange(currPage - 1);
        }
    }

    useEffect(() => {
        if (activeProviders) filterSearch(searchName);
    }, [searchName, filtersState]);

    function switchView() {
        setDefaultView(!defaultView);
    }

    function evaluateFilters() {
        let isFiltersEmpty = true;
        Object.keys(filtersState).forEach((item) => {
            if (filtersState[item].length > 0) {
                isFiltersEmpty = false;
            }
        });

        return !isFiltersEmpty;
    }

    function clearFilters() {
        setFiltersState(
            Object.keys(filtersState).reduce(
                (acc, cur) => ({
                    ...acc,
                    [cur]: [],
                }),
                {}
            )
        );
    }

    function renderTag(item, index) {
        return filtersState[item].map((title, key) => (
            <div
                className="tag"
                style={{
                    border: "2px solid #0a1d7c",
                    borderRadius: "50px",
                    backgroundColor: "#f1f4fa",
                    textAlign: "center",
                    display: "inline-block",
                    margin: "4px 2px",
                    color: "#0a1d7c",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "700",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                }}
                key={`${index}${key}`}
            >
                {title}{" "}
                <span
                    className="remove-tag"
                    onClick={async () => {
                        setFiltersState({
                            ...filtersState,
                            [item]: filtersState[item].filter(
                                (i) => i !== title
                            ),
                        });
                        setTimeout(() => filterProviders(), 100);
                    }}
                >
                    {" "}
                    <img src={x} />
                </span>
            </div>
        ));
    }

    const renderTagControl = () => (
        <>
            <div
                className={classNames("filter-row", "padder", "filters")}
                style={{ display: "flex", alignItems: "center" }}
            >
                <div style={{ marginRight: "8px", marginBottom: "6px" }}> </div>
                {
                console.log((filtersData))}
                {Object.entries(filtersData)
                    .filter(
                        ([key, value]: any[]) =>
                            Number.isInteger(value.priority) &&
                            value.priority <= FILTER_CUTOFF
                    )
                    .sort(
                        ([aKey, aValue]: any[], [bKey, bValue]: any[]) =>
                            aValue.priority - bValue.priority
                    )
                    .map(([key, value]: any[]) =>
                        renderDropdown(value.name, key)
                    )}

                {Object.keys(filtersData).length > FILTER_CUTOFF ? (
                    <>  
                        <Dropdown>
                            <Dropdown.Toggle
                                className="astext"
                                id="more-filters-dropdown"
                            >
                                {moreFilters}
                                <span className="custom-dropdown-icon">
                                    <img
                                        src={dropdownIcon}
                                        alt="dropdown icon"
                                        style={{ height: "16px" }}
                                    />
                                </span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                            {Object.entries(filtersData)
                                .filter(
                                    ([key, value]: any[]) =>
                                        !Number.isInteger(value.priority) ||
                                        value.priority > FILTER_CUTOFF
                                )
                                .sort(
                                    (
                                        [aKey, aValue]: any[],
                                        [bKey, bValue]: any[]
                                    ) => aValue.priority - bValue.priority
                                )
                                .map(([key, value]: any[]) =>
                                    renderMoreDropdown(value.name, key)
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        {/* <Button
                            className="astext"
                            style={{ color: "red" }}
                            onClick={() => setMoreFilter(false)}
                        >
                            {lessFilters}
                            <span className="custom-dropdown-icon"><img src={dropdownIcon} alt="dropdown icon" style={{ height: '16px' }} /></span>
                        </Button> */}
                    </>
                ) : (
                    <div></div>
                    // <Button 
                    //     className="astext"
                    //     onClick={() => setMoreFilter(true)}>
                    //     {moreFilters}
                    //     <span className="custom-dropdown-icon"><img src={dropdownIcon} alt="dropdown icon" style={{ height: '16px' }} /></span>
                    // </Button>
                )}
                {/* <FaRegQuestionCircle
                    data-tooltip-id="my-tooltip-1"
                    className="filter-tooltip-tutorial"
                    style={{ marginBottom: "4px" }}
                    onMouseEnter={() => setOpen(true)}
                />
                <ReactTooltip
                    id="my-tooltip-1"
                    place="right"
                    isOpen = {isOpen}
                    border = "true"
                    variant = "light"
                    arrowColor = "white"
                    style={{
                    pointerEvents: "auto",
                    padding: "0px",
                    borderStyle: "solid",
                    borderWidth: 'thin',
                    borderRadius: '8px',
                    }}
                >
                    <div>
                    <div
                        style={{
                        backgroundColor: "#244D75",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        }}
                    >
                        <h4
                        style={{
                            margin: "0px",
                            padding: "1rem 5rem",
                            paddingLeft: "0.5rem",
                            color: "white"
                        }}
                        >
                        {" "}
                        Filters{" "}
                        </h4>
                    </div>
                    <div style={{ padding: "0.2rem 0.5rem" }}>
                        <p
                        style={{
                            fontSize: "11px",
                            margin: "0px",
                            borderRadius: "0px",
                            lineBreak: "anywhere",
                            color: "black",
                            maxWidth: "12rem",
                            borderBottom: "1px",
                            borderBottomColor: "black",
                            borderBottomStyle: "solid",
                            paddingBottom: "0.2rem"
                        }}
                        >
                        {" "}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                        enim ad minim v{" "}
                        </p>
                    </div>
                    <div
                        style={{
                        padding: "0.2rem 0.5rem",
                        borderBottomLeftRadius: "4px",
                        borderBottomRightRadius: "4px"
                        }}
                    >
                        <button
                        onClick={() => {
                            setOpen(false);
                        }}
                        style={{
                            backgroundColor: "#244D75",
                            border: "0px",
                            color: "white",
                            padding: "0.3rem",
                            marginLeft: "9.2rem",
                            borderRadius: '4px',
                        }}
                        >
                        Got It!
                        </button>
                    </div>
                    </div>
                </ReactTooltip> */}
            </div>
        </>
    );

    function renderDropdown(title, key) {
        return (
            <Dropdown key={key} style={{ marginTop: "0px" }}>
                <Dropdown.Toggle
                    id={key}
                    variant="light"
                    className={`custom-dropdown-toggle ${
                        filterActiveState[key] ? "active" : ""
                    }`}
                >
                    {title}
                    <span className="custom-dropdown-icon">
                        <img
                            src={dropdownIcon}
                            alt="dropdown icon"
                            style={{ height: "16px" }}
                        />
                    </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {filtersData[key].options.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                const newFilters = [...filtersState[key]];

                                if (newFilters.includes(item.value)) {
                                    const itemIndex = newFilters.indexOf(
                                        item.value
                                    );
                                    newFilters.splice(itemIndex, 1);
                                } else {
                                    newFilters.push(item.value);
                                }

                                setFiltersState({
                                    ...filtersState,
                                    [key]: newFilters,
                                });

                                setFilterActiveState({
                                    ...filterActiveState,
                                    [key]: newFilters.length > 0,
                                });
                            }}
                        >
                            <Form.Check
                                className="dropdown-item custom-checkbox"
                                name={key}
                                type="checkbox"
                                checked={filtersState[key].includes(item.value)}
                                value={item.value}
                                label={item.label}
                                itemType="normalfilter"
                            />
                        </div>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    function renderMoreDropdown(title, key) {
        return (
            // <Dropdown key={key} style={{ marginTop: '0px' }}>
            //     <Dropdown.Toggle
            //         id={key}
            //         variant="light"
            //         className={`custom-dropdown-toggle ${filterActiveState[key] ? 'active' : ''}`}
            //     >
            //         {title}
            //         <span className="custom-dropdown-icon">
            //             <img src={dropdownIcon} alt="dropdown icon" style={{ height: '16px' }} />
            //         </span>
            //     </Dropdown.Toggle>
                <Dropdown key={key} drop='right'>
                    <Dropdown.Toggle className="subMenu" id="sub-dropdown">
                        {title}
                        <MdChevronRight/>
                    </Dropdown.Toggle>
                <Dropdown.Menu>
                    {filtersData[key].options.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                const newFilters = [...filtersState[key]];
                                
                                if (newFilters.includes(item.value)) {
                                    const itemIndex = newFilters.indexOf(item.value);
                                    newFilters.splice(itemIndex, 1);
                                } else {
                                    newFilters.push(item.value);
                                }

                                setFiltersState({
                                    ...filtersState,
                                    [key]: newFilters,
                                });
    
                                setFilterActiveState({
                                    ...filterActiveState,
                                    [key]: newFilters.length > 0,  
                                });
                            }}
                        >
                            <Form.Check
                                className="dropdown-item custom-checkbox"
                                name={key}
                                type="checkbox"
                                checked={filtersState[key].includes(item.value)}
                                value={item.value}
                                label={item.label}
                                itemType="normalfilter"
                            />
                        </div>
                    ))}
                </Dropdown.Menu>
             </Dropdown>
        );
    }

    // Localization is unused because it's hardcoded and doesn't fit with our dynamic model
    let {
        searchProviderName,
        searchZipcode,
        hideLabel,
        showLabel,
        lessFilters,
        moreFilters,
        filters,
    } = localizationStrings;

    const isDesktop = width > 768;

    if (isLoading || !isLoaded(activeProviders)) {
        return (
            <div className="spinner-wrap">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div
            className={classNames("bg-white", {
                "overflow-scroll": !isDesktop,
            })}
            style={{ "height": "100vh" }}
        >
            {/* <NavBar /> */}
            <div style={{ "height": "100%" }}>
                <div>
                    <div
                        className={classNames("row-spaced", "ml-2", "pt-3", {
                            "mr-2": !isDesktop,
                        })}
                    >
                        <div className="w-75">
                            <Row noGutters={!isDesktop}>
                                <Col
                                    style={{
                                        paddingBottom: "0px",
                                        marginBottom: "0px",
                                    }}
                                >
                                    {showInfo ? (
                                        <div style={{display: "flex", flexDirection: "row", alignItems: "center",}}>
                                            <a
                                                onClick={() => setShowInfo(false)}
                                                style={{ cursor: "pointer", marginRight: "10px", marginLeft: "10px",}}
                                            >
                                                <img src={backArrow} alt="Back" style={{ width: '80%', height: '80%', marginBottom: '8px' }} />      
                                            </a>                                          
                                            <h4 style={{ fontWeight: "bold", }}>{providers[selectedIndex].facilityName + " #" + providers[selectedIndex].stationNum}</h4>
                                            </div>
                                        ) : (
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text id="search-addon" className="search">
                                                    <img
                                                        src={searchIcon}
                                                        alt="search"
                                                        className="imgSearch"
                                                    />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    placeholder={searchZipcode}
                                                    itemType="search"
                                                    onChange={filterProviders}
                                                    value={searchName}
                                                    className="search-bar"
                                                />
                                            </InputGroup>
                                    )}
                                </Col>
                            </Row>
                        </div>
                        <div className="mb-3">
                            <div
                                className="right-container"
                                style={{ display: "flex"}}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        marginRight: "20px",
                                    }}
                                >
                                    <div
                                        style={
                                            isDesktop
                                                ? {
                                                    marginRight: "10px",
                                                    fontWeight: "700",
                                                    fontFamily: "Inter, sans-serif",
                                                }
                                                : {
                                                    marginRight: "0px", 
                                                    fontWeight: "600", 
                                                    fontFamily: "Inter, sans-serif",
                                                    fontSize: "12px", 
                                                }
                                        }
                                    >
                                        {isDesktop
                                            ? isToggled
                                                ? hideLabel
                                                : showLabel
                                            : isToggled
                                            ? showLabel
                                            : hideLabel}
                                    </div>
                                    <Switch
                                        onChange={handleToggle}
                                        checked={isToggled}
                                        offColor="#E0E0E0"
                                        onColor={primaryColor}
                                        handleDiameter={18}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        height={24}
                                        width={44}
                                    />
                                </div>
                                {isDesktop && (
                                    <Button
                                        style={{
                                            marginRight: "20px",
                                            fontSize: "14px",
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                        className="button-tutorial"
                                        variant="primary"
                                        onClick={() => setIsOpen(true)}
                                    >
                                        Start Tutorial
                                    </Button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
                <div className={classNames({ "row-nowrap": isDesktop })} style={{ "height": "calc(100% - 70px)" }}>
                    <div
                        className={classNames("map-list")}
                        style={{
                            pointerEvents: point || isDesktop ? "all" : "none",
                            width: isDesktop
                                ? defaultView
                                    ? "50vw"
                                    : "100vw"
                                : defaultView
                                ? "100vw"
                                : 0,
                            display: !isDesktop && !defaultView && "none",
                            "height": "100%"
                        }}
                    >
                        {!showInfo && renderTagControl()}
                        <div style={{ "height": !showInfo ? "calc(100% - 43px)" : "100%", "overflowY": "scroll" }}>
                            <div
                                className={classNames("tag-row padder", {
                                    "result-tutorial": isEmpty(activeProviders),
                                })}
                            >
                                {!showInfo && (
                                    <>
                                        {Object.keys(filtersState).map(renderTag)}
                                        {evaluateFilters() && (
                                            <div
                                                onClick={() => clearFilters()}
                                                className="tag clear-all"
                                                style={{
                                                    border: "none",
                                                    color: "#2F76FF",
                                                    fontFamily: 'Inter, sans-serif',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                Clear
                                            </div>
                                        )}
                                    </>
                                )}
                                </div>
                            {!isEmpty(activeProviders) ? (
                                <div className='container2'>
                                    {showInfo ? (
                                        activeProviders &&
                                        activeProviders[selectedIndex] &&
                                        (
                                            <div className="containerInfo d-flex flex-column" style={{ height: "80vh" }}>
                                                <div className="padder d-flex flex-column" style={{ height: "calc(200vh - 70px)" }}>
                                                    <div className="content d-flex flex-column">
                                                        <ProviderInfo item={activeProviders[selectedIndex]} categories={categories} />
                                                        <div className="mt-2">
                                                        </div>                              
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <>
                                            <strong className="custom-padder">
                                                {activeProviders.length}
                                                {clinWikiMap ? " trials found" : " locations found"}
                                            </strong>
                                            {activeProviders
                                                .slice(lowerPageBound, upperPageBound)
                                                .map((i, index) => (
                                                    <div
                                                        // className={classNames({
                                                        //     "result-tutorial": index == 0,
                                                        // })}
                                                        key={i.id}
                                                    >   
                                                        <ProviderCell
                                                            item={i}
                                                            index={index}
                                                            primaryColor={primaryColor}
                                                            onMouseEnter={debounce(() => {
                                                                if (defaultView && isDesktop) {
                                                                    setCurrmarker(index);
                                                                }
                                                            }, 300)}
                                                            onClick={() => handleCellClick(index)}
                                                            distances={distances}
                                                        />
                                                    </div>
                                                ))}
                                        </>
                                    
                                    
                                    )}
                                </div>
                            ) : (
                                <Row>
                                    <div>
                                        <Row>
                                            <img
                                                src={frame}
                                                alt="No providers found."
                                            />
                                            <Col>
                                                <b>Whoops!</b>
                                                <p>
                                                    Sorry, your query returned
                                                    no matching providers.
                                                </p>
                                                <p>
                                                    Please adjust the filters or
                                                    try different keywords.
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                </Row>
                            )}
                            {activeProviders.length / PAGE_SIZE > 1 ? (
                                <Pagination>
                                    <Pagination.First
                                        onClick={() => handlePageChange(1)}
                                    />
                                    <Pagination.Prev
                                        onClick={() => handlePaginationPrev()}
                                    />
                                    {getPages()}
                                    <Pagination.Next
                                        onClick={() => handlePaginationNext()}
                                    />
                                    <Pagination.Last
                                        onClick={() =>
                                            handlePageChange(
                                                Math.ceil(
                                                    activeProviders.length /
                                                        PAGE_SIZE
                                                )
                                            )
                                        }
                                    />
                                </Pagination>
                            ) : (
                                <div />
                            )}
                        </div>
                    </div>
                    <div
                        className={classNames("map-google-map")}
                        style={{
                            width: isDesktop
                                ? defaultView
                                    ? "50vw"
                                    : 0
                                : defaultView
                                ? 0
                                : "100vw",
                            display: !isDesktop && defaultView && "none",
                        }}
                        onMouseLeave={() => setPoint(true)}
                    >
                        <GoogleMap
                            providers={activeProviders}
                            defaultZoom={defaultZoom}
                            primaryColor={primaryColor}
                            defaultCenter={{
                                lat: defaultLat,
                                lng: defaultLong,
                            }}
                            selectedMarker={currmarker}
                            onShowMoreClick={handleCellClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default compose<any>(
    withFirestore,
    connect((state: Store) => ({
        state,
    }))
)(Map);
