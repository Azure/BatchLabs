import * as React from "react";
import { HEADER_HEIGHT } from "./header";

export const Main: React.FC = props => {
    return (
        <main>
            <div style={{marginTop: HEADER_HEIGHT}}>
                {props.children}
            </div>
        </main>
    );
};
