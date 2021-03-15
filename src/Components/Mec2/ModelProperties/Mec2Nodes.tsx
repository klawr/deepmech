import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Grid, MenuItem } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mecModelAction } from "../../../Redux/MecModelSlice";
import { UIAction, UISelect } from "../../../Redux/UISlice";
import handleMec2NodeEvents from "../../../Services/handleMec2NodeEvents";
import ContextMenu from "../../Utils/ContextMenu";
import MultiSelect from "../../Utils/MultiSelect";
import UpdateText from "../../Utils/UpdateText";
import Mec2Table from "../Utils/Mec2Table";
import AddMec2Node from "./AddElement/AddMec2Node";

export default function Mec2Nodes() {
    const ref = (globalThis as any).mecElement as any;

    const name = 'nodes';
    const dispatch = useDispatch();
    const head = useSelector(UISelect).properties[name];
    function updateHead(e: any, arg: any) {
        dispatch(UIAction.updateProperty({
            property: name,
            label: arg,
            value: e.target.checked,
        }));
    }

    React.useEffect(() => handleMec2NodeEvents(dispatch));

    function SanitizedCell({ property, idx, elm }: any) {
        function update(value: any, previous = elm[property]) {
            dispatch(mecModelAction.add({
                list: name, idx,
                value: { [property]: value },
                previous: { [property]: previous }
            }));
        }

        // TODO
        const [checked, changeChecked] = React.useState(!!elm[property]);

        function select() {
            switch (property) {
                case 'base':
                    return <Checkbox
                        checked={checked}
                        onChange={(e) => {
                            changeChecked(e.target.checked);
                            update(e.target.checked);
                        }} />
                case 'x':
                case 'y':
                    return <UpdateText
                        title={property}
                        value={Math.round(elm[property])}
                        onSubmit={(v: any) => update(+v)} />
                case 'id':
                    return <UpdateText
                        title={property}
                        value={elm[property]}
                        onSubmit={update} />
                default: return <div>{elm[property]}</div>
            }
        }

        function removeNode() {
            dispatch(mecModelAction.add({
                list: name, idx: 'remove',
                value: (({ id, x, y, base }) => ({ id, x, y, base }))(elm),
                previous: {}
            }));
        }

        return <ContextMenu key={idx}>
            {select()}
            <MenuItem onClick={removeNode}>
                {`Remove node ${elm['id']}`}
            </MenuItem>
        </ContextMenu>
    }

    return <Accordion>
        <AccordionSummary> {name} </AccordionSummary>
        <AccordionDetails>
            <Grid container direction="row">
                <MultiSelect options={head} updateOptions={updateHead} />
                <Mec2Table
                    SanitizedCell={SanitizedCell}
                    head={Object.entries(head).filter(h => h[1]).map(h => h[0])}
                    list={ref._model[name]} />
                <AddMec2Node />
            </Grid>
        </AccordionDetails>
    </Accordion>
}
