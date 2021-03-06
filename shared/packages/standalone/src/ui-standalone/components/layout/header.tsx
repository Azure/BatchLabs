import * as React from "react";

export const HEADER_HEIGHT = "60px";

export const Header: React.FC = props => {
    return (
        <header style={{
            top: 0,
            width: "100%",
            position: "fixed",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            color: "white",
            backgroundColor: "#0078d4",
            height: HEADER_HEIGHT,
            zIndex: 9999
        }}>
            <h1 style={{
                fontSize: "1.5em",
                margin: 0,
                padding: "0 16px",
                fontWeight: 600,
                lineHeight: HEADER_HEIGHT,
                userSelect: "none"
            }}>Batch Standalone</h1>
        </header>
    );
};
