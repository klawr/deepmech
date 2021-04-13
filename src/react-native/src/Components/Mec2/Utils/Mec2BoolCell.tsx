
import React from 'react';
import { Switch } from 'react-native';
import Mec2Cell from './Mec2Cell';

export default function Mec2BoolCell({ property, elm, update }: any) {
    return <Mec2Cell>
        <Switch
            value={elm[property]}
            onValueChange={update} />
    </Mec2Cell>
}
