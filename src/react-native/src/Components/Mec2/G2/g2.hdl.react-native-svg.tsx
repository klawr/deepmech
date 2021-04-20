import { a, beg, cir, drw, ell, fill, g2, grid, l, lin, m, ply, rec, stroke, txt, use, view } from "g2-module";
import * as React from 'react';
import { Circle, Ellipse, G, Line, Path, Polyline, Rect, Text } from "react-native-svg";

export function register() {
    g2.handler.factory.push((ctx: any) => {
        return Object.assign({}, reactNativeSVG, { ctx: ctx });
    });
}

const reactNativeSVG = {
    ctx: undefined as any,
    stash: [] as any,
    pos: { x: undefined, y: undefined },
    init() {
        (this as any).stack = [];
        return true;
    },
    exe(commands: any) {
        for (let cmd of commands) {
            if (cmd.a && cmd.a.g2) {
                const cmds = cmd.a.g2().commands;
                // If false, ext was not applied to this cmd. But the command still renders
                if (cmds) {
                    this.exe(cmds);
                    continue;
                }
            }
            else if (cmd.a && cmd.a.commands) {
                this.exe(cmd.a.commands);
                continue;
            }
            if (cmd.c && (this as any)[cmd.c]) {
                (this as any)[cmd.c](cmd.a);
            } else {
                console.log(`couldnt find ${cmd.c}`)
            }
        }
    },
    view(a: view) {
        this.beg(a);
    },
    grid(a: grid) {
        // https://stackoverflow.com/questions/14208673/how-to-draw-grid-using-html5-and-canvas-or-svg
        const color = a?.color || '#666';
        const sz = 10; // a?.sz || 10;
        (this.stash[0] || this.ctx).push(<><defs>
            <pattern id="smallGrid" width={sz} height={sz} patternUnits="userSpaceOnUse">
                <path d={`M ${sz} 0 L 0 0 0 ${sz}`} fill="none" stroke={color} strokeWidth="0.5" />
            </pattern>
            <pattern id="grid" width={sz * 10} height={sz * 10} patternUnits="userSpaceOnUse">
                <rect width={sz * 10} height={sz * 10} fill="url(#smallGrid)" />
                <path d={`M ${sz * 10} 0 L 0 0 0 ${sz * 10}`} fill="none" stroke={color} strokeWidth="1" />
            </pattern>
        </defs>
            <rect width="100%" height="100%" fill="url(#grid)" /></>)
    }, // TODO
    clr() { }, // TODO
    cir(a: cir) {
        this.ctx.push(<Circle cx={a.x} cy={a.y} r={a.r} {...this.setStyle(a)} />);
    },
    arc() { }, // TODO
    ell(a: ell) {
        this.ctx.push(<Ellipse cx={a.x} cy={a.y} rx={a.rx} ry={a.ry} {...this.setStyle(a)} />)
    },
    rec(a: rec) {
        this.ctx.push(<Rect x={a.x} y={a.y} width={a.b} height={a.h} {...this.setStyle(a)} />)
    },
    lin(a: lin) {
        this.ctx.push(<Line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} {...this.setStyle(a)} />)
    },
    ply(a: ply) {
        const points = a.pts.reduce((b: any, pt: any) => b += `${pt.x}, ${pt.y} `, "");
        this.ctx.push(<Polyline points={points} {...this.setStyle(a)} />)
    },
    txt(a: txt) {
        const style = this.setStyle(a);
        style.fill = style.stroke;
        const sign = this.cartesian ? -1 : 1;
        const transform = `translate(${a.x || 0}, ${(a.y || 0) * sign - 10})
        rotate(${(a.w || 0) * 180 / Math.PI || 0}) scale(${/*TODOa.scl || */1}, ${(/*TODOa.scl || */1) * -sign})`;
        (style as any)["transform-origin"] = this.cartesian || true ? `${a.x} ${(a.y || 0) - 10}` : "";
        this.ctx.push(<G transform={transform} key={style.key}><Text {...style} textAnchor="middle">{a.str}</Text></G>)
    },
    img() { }, // TODO
    use(a: use) {
        this.beg(a);
        this.exe((a.grp as any).commands);
        this.end();
    },
    cartesian: false,
    beg(a: beg) {
        const style = this.setStyle(a);
        // let cartesian = false;
        // if ((a as any).cartesian !== undefined && this.cartesian !== (a as any).cartesian) {
        this.cartesian = (a as any).cartesian;
        this.stack.push({ ...a });
        const sign = this.cartesian ? -1 : 1;
        const transform = `translate(${a.x || 0}, ${(a.y || 0) * sign})
        rotate(${(a.w || 0) * 180 / Math.PI || 0}) scale(${a.scl || 1}, ${(a.scl || 1) * sign})`;
        (style as any)["transform-origin"] = this.cartesian ? `50% 50%` : "";
        // this.cartesian = (a as any).cartesian !== undefined && (a as any).cartesian === true;
        // };
        this.stash.push(this.ctx);
        const ctx: any = [];
        this.ctx.push(<G transform={transform} {...style}>{ctx}</G>);
        this.ctx = ctx;
    },
    end() {
        this.stack.pop();
        this.ctx = this.stash.pop();
    },
    stroke(a: stroke) {
        this.ctx.push(<Path d={this.path} {...this.setStyle(a)} />);
    },
    fill(a: fill) {
        this.ctx.push(<Path d={this.path} {...this.setStyle(a)} />);
    },
    drw(a: drw) {
        const style = this.setStyle(a);
        style.fill = style.stroke;
        this.ctx.push(<Path d={a.d} {...style} />)
    },
    a(a: a) {
        const dx = (a.x || 0) - (this.pos.x || 0);
        const dy = (a.y || 0) - (this.pos.y || 0);
        const dr = Math.hypot(dx, dy);

        this.path += `${(a as any).dw > 0 ?
            `M${0},${0} v${dr} a${dr},${dr} 0 0 1 ${-dr},${-dr}z` :
            `M${0},${0} v-${dr} a${-dr},${-dr} 0 0 1 ${dr},${dr}`} z`
    },
    path: "",
    p() {
        this.path = "";
    },
    m(a: m) {
        this.path += `M${a.x} ${a.y}`;
    },
    l(a: l) {
        this.path += `L${a.x} ${a.y}`;
    },
    z() {
        this.path += "Z";
    }, // TODO
    stack: [] as any,
    setStyle(s: any) {
        const ds = (g2 as any).defaultStyle;
        const getStyle = (key: string) => {
            let stack
            for (let i = 0; i < this.stack.length; ++i) {
                if (this.stack[i][key]) {
                    stack = this.stack[i][key];
                    break;
                }
            }
            let symbol;
            if (typeof s[key] === 'string' && s[key][0] === '@') {
                let ref = s[key].substr(1);
                symbol = (g2 as any).symbol[ref];
            }
            return symbol || s[key] || stack || ds[key]
        }
        return {
            fill: getStyle('fs'),
            stroke: getStyle('ls'),
            strokeWidth: getStyle('lw'),
            key: `$queueElement${this.stash.length}/${this.ctx.length}`,
        }
    },
};