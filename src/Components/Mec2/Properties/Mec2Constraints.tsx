  
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    MenuItem,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { UIAction, UISelect } from '../../../Features/UISlice';
import { mecModelAction } from '../../../Features/MecModelSlice';
import ContextMenu from '../../Utils/ContextMenu';
import UpdateText from '../../Utils/UpdateText';
import MultiSelect from '../../Utils/MultiSelect';
import Mec2Table from '../Utils/Mec2Table';
import RadioSelect from '../../Utils/RadioSelect';
import ObjectMenu from '../../Utils/ObjectMenu';

export default function Constraints() {
    const name = 'constraints';
    const dispatch = useDispatch();
    const head = useSelector(UISelect).properties[name];
    const ref = (globalThis as any).mecElement as any;

    function updateHead(e: any, arg: any) {
        dispatch(UIAction.updateProperty({
            property: name,
            label: arg,
            value: e.target.checked,
        }));
    }

    function SanitizedCell({ elm, idx, property }: any) {
        function update(value: any, previous = elm[property]) {
            dispatch(mecModelAction.add({
                list: name, idx,
                value: { [property]: value },
                previous: { [property]: previous }
            }));
        };

        function select() {
            switch (property) {
                case 'id': return <UpdateText
                    title={property}
                    value={elm[property]}
                    onSubmit={update} />
                case 'p1':
                case 'p2':
                    return <RadioSelect
                        options={ref._model.nodes.map((n: any) => n.id)}
                        onChange={(v: any) => update(v, elm[property].id)}
                        selected={elm[property].id}
                        title={property} />
                case 'len':
                case 'ori':
                    const proxy = elm[property] || { type: 'free' };
                    return <ObjectMenu label={property} title={proxy.type}>
                        {Object.entries(proxy).map(e => {
                            switch (e[0]) {
                                case 'type':
                                    return <RadioSelect key={e[0]}
                                        onChange={(t: any) => update({ ...elm[property], [e[0]]: t })}
                                        title={e[0]}
                                        label={`${e[0]}: ${e[1]}`}
                                        selected={e[1]}
                                        options={['const', 'free', 'drive']} />
                                case 'ref':
                                    return <RadioSelect key={e[0]}
                                        onChange={(e: any) => update(e.target.value)}
                                        title={e[0]}
                                        label={`${property}: e[1]`}
                                        selected={e[1]}
                                        options={ref._model.nodes.map((n: any) => n.id)} />
                                default:
                                    return <div>{e[0]}</div>
                            };
                        })}
                    </ObjectMenu>
                default:
                    if (typeof elm[property] === 'object') {
                        return <div> {JSON.stringify(elm[property])} </div>
                    }
                    return <div>{elm[property]}</div>
            }
        }

        function removeConstraint() {
            dispatch(mecModelAction.add({
                list: name, idx: 'remove',
                // TODO len ref and ori ref?
                value: {
                    id: elm.id,
                    p1: elm.p1.id,
                    p2: elm.p2.id,
                    len: { type: elm.len.type },
                    ori: { type: elm.ori.type },
                },
                previous: {}
            }));
        }

        return <ContextMenu key={idx}>
            {select()}
            <MenuItem onClick={removeConstraint}>
                {`Remove constraint ${elm['id']}`}
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
                {/* TODO <AddConstraint options={model.nodes.map(n => n.id)} /> */}
            </Grid>
        </AccordionDetails>
    </Accordion>
}