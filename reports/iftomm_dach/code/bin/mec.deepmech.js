const mec2Elements = document.getElementsByTagName('mec-2');
function mec2Deepmech() {
    for (element of mec2Elements) {
        const nav_left = element._root.children[1].children[0].children[0];
        const c = element._ctx.canvas;

        const cq = g2().view({ cartesian: true });
        cq.rec({ b: element.height, h: element.width, fs: '#000' });

        function draw(e) {
            e.preventDefault();

            const evt = element._interactor.evt;
            if (last) {
                const now = { x2: evt.x, y2: evt.y };
                if (e.buttons === 1) {
                    cq.lin({ ...last, ...now, lc: 'round', lw: 3, ls: '#fff' });
                }
                else if (e.buttons === 2) {
                    cq.lin({ ...last, ...now, lc: 'round', lw: 6, ls: '#000' });
                }
            }
            last = { x1: evt.x, y1: evt.y };
            cq.exe(element._ctx);
        }
        function cancel(e) {
            c.removeEventListener('pointermove', draw);
            last = undefined;
        }
        function drawOnMove(e) {
            c.addEventListener('pointermove', draw);
        }
        function preventDefault(e) {
            if (element._drawing) {
                e.preventDefault();
            }
        }

        let last;
        element._drawing = false;
        element._drawbtnHdl = e => {

            element._drawing = !element._drawing;
            if (element._drawing) {
                c.addEventListener('pointerup', cancel);
                c.addEventListener('pointerdown', drawOnMove);
                c.addEventListener('contextmenu', preventDefault);
                cq.exe(element._ctx);
            } else {
                c.removeEventListener('pointerdown', drawOnMove);
                element._g.exe(element._ctx);
            }
        }

        const drawbtn = document.createElement('span');
        drawbtn.style.paddingLeft = '10px';
        drawbtn.innerHTML = 'draw';
        drawbtn.id = 'drawbtn';
        drawbtn.addEventListener('click', element._drawbtnHdl, false);
        nav_left.appendChild(drawbtn)

        element._drawbtn = drawbtn;
    }
}
mec2Deepmech();