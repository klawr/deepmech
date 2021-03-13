import { Grid } from '@material-ui/core';
import Mec2Id from './Mec2Id';
import Mec2Nodes from './Mec2Nodes';
import Mec2Constraints from './Mec2Constraints';
import Mec2Views from './Mec2Views';
import Mec2UndoRedo from './Mec2UndoRedo';

export default function Mec2Properties() {
    return <div>
        <Grid container direction="row">
            <Mec2Id />
            <Mec2UndoRedo />
        </Grid>
        <Mec2Nodes />
        <Mec2Constraints />
        <Mec2Views />
    </div>
}