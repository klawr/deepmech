
import React from 'react';
import { Switch } from 'react-native';
import { IMec2CellPropertyArgs } from './Mec2Cell';

export default function Mec2BoolCell({ property, elm, update }: IMec2CellPropertyArgs) {
    const value = elm[property] === null ? false : elm[property] as boolean;
    return <Switch value={value} onValueChange={(v) => update(!!v)} />
}
