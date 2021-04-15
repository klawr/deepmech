
import React from 'react';
import { Switch } from 'react-native';
import { IMec2CellPropertyArgs } from './Mec2Cell';

export default function Mec2BoolCell({ property, elm, update }: IMec2CellPropertyArgs) {
    return <Switch
        value={elm[property] as boolean}
        onValueChange={update} />
}
