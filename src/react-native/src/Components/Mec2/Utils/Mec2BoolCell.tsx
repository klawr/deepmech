
import React from 'react';
import { Switch } from 'react-native';

export default function Mec2BoolCell({ property, elm, update }: any) {
    return <Switch
        value={elm[property]}
        onValueChange={update} />
}
