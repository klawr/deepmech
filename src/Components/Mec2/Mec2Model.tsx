import { Grid } from '@material-ui/core';
import Mec2Id from './ModelProperties/Mec2Id';
import Mec2Nodes from './ModelProperties/Mec2Nodes';
import Mec2Constraints from './ModelProperties/Mec2Constraints';
import Mec2Views from './ModelProperties/Mec2Views';
import Mec2UndoRedo from './Utils/Mec2UndoRedo';

export default function Mec2Model() {
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