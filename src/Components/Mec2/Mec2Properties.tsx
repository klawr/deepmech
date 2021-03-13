import { Grid } from '@material-ui/core';
import Mec2Id from './Properties/Mec2Id';
import Mec2Nodes from './Properties/Mec2Nodes';
import Mec2Constraints from './Properties/Mec2Constraints';
import Mec2Views from './Properties/Mec2Views';
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