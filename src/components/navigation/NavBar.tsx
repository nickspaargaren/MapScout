import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Link from "react-router-dom/Link";
import {
    FiGrid,
    FiFileText,
    FiMap,
    FiBell,
    FiPower,
    FiMessageCircle,
} from "react-icons/fi";
import {
    providerRoute,
    templateRoute,
    chatRoute,
} from "../../routes/pathnames";
import { databaseRef, responseRef } from "../../store";
import { updateChat, updateNewChat } from "../../functions/reduxActions";

const classnames = require("classnames");

function NavBar(props) {
    const [expand, setExpanded] = useState(false);
    const [showBubble, setShowBubble] = useState(props.newChat);

    useEffect(() => {
        async function parseChat(payload, payload2) {
            const { firebaseAuth } = props;
            const chats = payload
                ? Object.values(payload).filter(
                      (x: any) => x.uid && x.uid === firebaseAuth.auth.uid,
                  )
                : [];
            const responses = payload2
                ? Object.values(payload2).filter((x: any) => {
                      const index = x.message.indexOf(
                          `$${firebaseAuth.auth.uid}`,
                      );
                      if (index === 0) {
                          x.message = x.message
                              .replace(`$${firebaseAuth.auth.uid}`, "")
                              .trim();
                      }
                      return index === 0;
                  })
                : [];
            const arr = [];
            while (chats.length > 0 && responses.length > 0) {
                const chatTarget: any = chats[chats.length - 1];
                const responseTarget: any = responses[responses.length - 1];
                const chatDate = new Date(chatTarget.timestamp);
                const responseDate = new Date(responseTarget.timestamp);
                if (chatDate > responseDate) {
                    arr.push(chatTarget);
                    chats.pop();
                } else if (chatDate < responseDate) {
                    arr.push(responseTarget);
                    responses.pop();
                } else {
                    arr.push(chatTarget);
                    chats.pop();
                    arr.push(responseTarget);
                    responses.pop();
                }
            }
            if (chats.length > 0) {
                arr.push(...chats);
            } else if (responses.length > 0) {
                arr.push(...responses);
            }
            props.updateChat(arr);
        }
        databaseRef.on("value", (snapshot) => {
            parseChat(
                snapshot.child("chat").val(),
                snapshot.child("response").val(),
            );
        });
        responseRef.on("child_added", () => {
            props.updateNewChat(true);
        });
    }, []);

    useEffect(() => {
        setShowBubble(props.newChat);
    }, []);

    return (
        <div>
            <div
                className={classnames("gray-overlay", {
                    none: !expand,
                    fadeIn: expand,
                })}
            />
            <div id="root">
                <div
                    className={classnames("logo", { expanded: expand })}
                    onMouseLeave={() => setExpanded(false)}
                    onMouseEnter={() => setExpanded(true)}
                >
                    <a href="/">
                        <img
                            style={{ width: 90 }}
                            src={props.team.logoUrl}
                            alt=""
                        />
                    </a>
                </div>
                <div
                    id="sidebar"
                    onMouseLeave={() => setExpanded(false)}
                    onMouseEnter={() => setExpanded(true)}
                >
                    <div>
                        <Link
                            to={providerRoute}
                            style={{ textDecoration: "none" }}
                        >
                            <div className="cell">
                                <div className="icon">
                                    <FiGrid />
                                </div>
                                <div
                                    className={classnames("cell-title", {
                                        none: !expand,
                                        fadeIn: expand,
                                    })}
                                >
                                    PROVIDERS
                                </div>
                            </div>
                        </Link>
                        <Link
                            to={templateRoute}
                            style={{ textDecoration: "none" }}
                        >
                            <div className="cell">
                                <div className="icon">
                                    <FiFileText />
                                </div>
                                <div
                                    className={classnames("cell-title", {
                                        none: !expand,
                                        fadeIn: expand,
                                    })}
                                >
                                    FILTERS
                                </div>
                            </div>
                        </Link>
                        <Link
                            to={`/${props.team.name}`}
                            target="_blank"
                            style={{ textDecoration: "none" }}
                        >
                            <div className="cell">
                                <div className="icon">
                                    <FiMap />
                                </div>
                                <div
                                    className={classnames("cell-title", {
                                        none: !expand,
                                        fadeIn: expand,
                                    })}
                                >
                                    VIEW MAP
                                </div>
                            </div>
                        </Link>
                        <Link to={chatRoute} style={{ textDecoration: "none" }}>
                            <div className="cell">
                                <div className="icon">
                                    {showBubble && <div className="redDot" />}
                                    <FiMessageCircle />
                                </div>
                                <div
                                    className={classnames("cell-title", {
                                        none: !expand,
                                        fadeIn: expand,
                                    })}
                                >
                                    FEEDBACK
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div>
                        <div className="cell">
                            <div className="icon">
                                <FiBell />
                            </div>
                            <div
                                onClick={() =>
                                    window.open(
                                        "https://www.notion.so/gtbitsofgood/MapScout-FAQs-9f6191f9571b47bc964f52a3961eb2ee",
                                        "_blank",
                                    )
                                }
                                className={classnames("cell-title", {
                                    none: !expand,
                                    fadeIn: expand,
                                })}
                            >
                                HELP
                            </div>
                        </div>
                        {/* <div className = "cell"> */}
                        {/*  <div className = "icon"> */}
                        {/*    <FiSettings/> */}
                        {/*  </div> */}
                        {/*  <div className={classnames("cell-title", { "none": !expand, "fadeIn": expand })}> */}
                        {/*    SETTINGS */}
                        {/*  </div> */}
                        {/* </div> */}
                        <Link
                            to={"/"}
                            target="_blank"
                            style={{ textDecoration: "none" }}
                        >
                            <div className="cell" onClick={props.logout}>
                                <div className="icon">
                                    <FiPower />
                                </div>
                                <div
                                    className={classnames("cell-title", {
                                        none: !expand,
                                        fadeIn: expand,
                                    })}
                                >
                                    LOGOUT
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = {
    updateNewChat,
    updateChat,
};

const mapStateToProps = (state) => ({
    firebaseAuth: state.firebase,
    newChat: state.item.newChat,
    chatHistory: state.item.chatHistory,
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
