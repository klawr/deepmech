import { g2 } from 'g2-module';
import React from 'react';
import Svg from 'react-native-svg';
import { register } from './g2.hdl.react-native-svg';

register();
export default function App({ cq, width, height } = { width: 300, height: 150 } as any) {
    const ctx: any = [];
    g2().use({ grp: cq }).exe(ctx);

    return <Svg height={height} width={width} >{ctx}</Svg>
}