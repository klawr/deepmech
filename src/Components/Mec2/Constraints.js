import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    MenuItem,
} from '@material-ui/core';
import { MecTable, RadioSelect, UpdateText, ObjectMenu, MultiSelect } from '..';
import { useDispatch, useSelector } from 'react-redux';
import { mecAction, UiAction, UiSelect } from '../../Features';
import AddConstraint from './AddConstraint';
import ContextMenu from '../Utils/ContextMenu';

export default function Constraints() {
    const name = 'constraints';
    const dispatch = useDispatch();
    const head = useSelector(UiSelect).properties[name];
    function updateHead(e, arg) {
        dispatch(UiAction.updateProperty({
            property: name,
            label: arg,
            value: e.target.checked,
        }));
    }

    function SanitizedCell({ elm, idx, property }) {
        function update(value, previous = elm[property]) {
            dispatch(mecAction.add({
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
                        options={model.nodes.map(n => n.id)}
                        onChange={(v) => update(v, elm[property].id)}
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
                                        onChange={(t) => update({ ...elm[property], [e[0]]: t })}
                                        title={e[0]}
                                        label={`${e[0]}: ${e[1]}`}
                                        selected={e[1]}
                                        options={['const', 'free', 'drive']} />
                                case 'ref':
                                    return <RadioSelect key={e[0]}
                                        onChange={e => update(e.target.value)}
                                        title={e[0]}
                                        label={`${property}: e[1]`}
                                        selected={e[1]}
                                        options={model.nodes.map(n => n.id)} />
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
            dispatch(mecAction.add({
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
                <MecTable
                    SanitizedCell={SanitizedCell}
                    head={Object.entries(head).filter(h => h[1]).map(h => h[0])}
                    list={mecElement._model[name]} />
                <AddConstraint options={model.nodes.map(n => n.id)} />
            </Grid>
        </AccordionDetails>
    </Accordion>

}