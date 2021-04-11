import React from "react";
import Accordion from "../Utils/Accordion";
import Mec2AddNode from "./Add/Mec2AddNode";

export default function Mec2Nodes() {
    return <Accordion title="Nodes">
        <Mec2AddNode />
    </Accordion>

}
