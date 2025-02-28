import "@fontsource/inter";

import React, { useEffect, useRef, useState } from "react";
// import grabberIcon from "../../assets/svg/grabber.svg";
import { ReactComponent as InfoIcon } from "../../assets/svg/info.svg";
import { ReactComponent as ChevronIcon } from "../../assets/svg/chevron.svg";
import { Button, Collapse, Form } from "react-bootstrap";
import ImageModal from "./ImageModal";
import { storage } from "../../store";

import styles from "./DirectoryForm.module.css";

export interface DirectoryItem {
    name: string;
    description: string;
    details: string;
    image: string;
}

const DirectoryFormItem = ({
    index,
    item,
    directoryItems,
    setDirectoryItems,
}) => {
    const updateItem = (newItem) => {
        setDirectoryItems([
            ...directoryItems.slice(0, index),
            newItem,
            ...directoryItems.slice(index + 1),
        ]);
    };
    const handleNameChange = (e) => {
        updateItem({ ...item, name: e.target.value });
    };
    const handleDescriptionChange = (e) => {
        updateItem({ ...item, description: e.target.value });
    };
    const handleDetailsChange = (e) => {
        updateItem({ ...item, details: e.target.value });
    };
    const handleUploadSuccess = async (file) => {
        const filename = file.name;
        await storage.ref("images").child(filename).put(file);
        let newItem = { ...item, image: filename };
        await storage
            .ref("images")
            .child(filename)
            .getDownloadURL()
            .then((url) => {
                console.log(url);
                newItem = { ...newItem, image: url };
                updateItem(newItem);
            });
    };

    return (
        <div
            className="directoryItem"
            style={{ display: "flex", flexDirection: "column", marginBottom: "8px"}}
        >
            <div
                style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    marginBottom: "16px",
                }}
            >{`Item ${index + 1}`}</div>
            <Form.Group>
                <Form.Label>
                    Name <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                    required
                    type="text"
                    placeholder="ex. Hannah"
                    value={item.name}
                    onChange={handleNameChange}
                    style={{ marginLeft: "2px" }}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="ex. Designer"
                    value={item.description}
                    onChange={handleDescriptionChange}
                    style={{ marginLeft: "2px" }}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Details</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="ex. Contact, Phone, Email, More info"
                    value={item.details}
                    onChange={handleDetailsChange}
                    style={{ marginLeft: "2px" }}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Upload Image</Form.Label>
                <div style={{ width: "70%", height: "200px" }}>
                    <ImageModal
                        dropzoneHeight="200px"
                        handleSuccess={handleUploadSuccess}
                    ></ImageModal>
                </div>
            </Form.Group>
            <button
                className="deleteButton"
                type="button"
                style={{
                    alignSelf: "end",
                    border: "none",
                    background: "none",
                    width: "50px",
                    height: "24px",
                    fontSize: "16px",
                    color: "#4F4F4F",
                    fontWeight: "500",
                }}
                onClick={() => {
                    const filterItems = directoryItems.filter(
                        (_, i) => i !== index
                    );
                    // console.log(filterItems);
                    setDirectoryItems(filterItems);
                }}
            >
                Delete
            </button>
        </div>
    );
};

interface DirectoryState {
    items: DirectoryItem[];
}

const DirectoryForm = ({
    directoryState,
    setDirectoryState,
    deleteComponent,
}: {
    directoryState: DirectoryState;
    setDirectoryState: (newState: DirectoryState) => void;
    deleteComponent: () => void;
}) => {
    const defaultDirectoryItem: DirectoryItem = {
        name: "",
        description: "",
        details: "",
        image: "",
    };
    //might have to lift this state later to avoid one shared state
    // const [directoryItems, setDirectoryItems] = useState<DirectoryItem[]>(
    //     data.items
    // );
    const { items: directoryItems } = directoryState;

    const setDirectoryItems = (newItems) => {
        // console.log(newItems);
        setDirectoryState({ ...directoryState, items: newItems });
    };

    /*
    directoryItem
    {
      name*:
      description:
      details: 
      image: 
    }
    */
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                className={`${styles.directory}`}
                style={{
                    // paddingRight: "5px",
                    // marginTop: "16px",
                    // overflow: "auto",
                }}
            >
                {/* {directoryItems.length} */}
                {directoryItems.map((directoryItem, index) => {
                    return (
                        // console.log()
                        <DirectoryFormItem
                            key={index}
                            index={index}
                            item={directoryItem}
                            directoryItems={directoryItems}
                            setDirectoryItems={setDirectoryItems}
                        ></DirectoryFormItem>
                    );
                })}
                {/* < */}
                <div
                    style={{ display: "flex", justifyContent: "space-between", marginTop: "16px"}}
                >
                    <button
                        className={`addButton ${styles.addButton}`}
                        type="button"
                        onClick={() => {
                            setDirectoryItems([
                                ...directoryItems,
                                defaultDirectoryItem,
                            ]);
                        }}
                    >
                        + Add Item
                    </button>
                    <button
                        type="button"
                        id="delete"
                        style={{
                            color: "red",
                            border: "1px solid red",
                            padding: "5px",
                            borderRadius: "4px",
                        }}
                        onClick={deleteComponent}
                    >
                        Delete Component
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DirectoryForm;
