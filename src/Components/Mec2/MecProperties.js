import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { Id, Nodes, Constraints, Views } from '..';
import { selectModel, updateModel } from '../../Features';
import { useDispatch, useSelector } from 'react-redux';

export default function MecProperties({ classes, mec2 }) {
    useDispatch()(updateModel(JSON.parse(mecElement._model.asJSON())));

    function Acc(elm, title) {
        return <Accordion>
            <AccordionSummary> {title} </AccordionSummary>
            <AccordionDetails> {elm} </AccordionDetails>
        </Accordion>
    }

    return <div>
        <Id classes={classes} mec2={mec2} />
        {Acc(<Nodes mec2={mec2} />, 'nodes')}
        {Acc(<Constraints
            elms={model.constraints}
            mec2={mec2} />, 'constraints')}
        {Acc(<Views
            elms={model.views}
            mec2={mec2} />, 'views')}
    </div>
}
