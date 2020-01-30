const mec2Elements = document.getElementsByTagName('mec-2');
function mec2Deepmech() {
    for (element of mec2Elements) {
        const nav_left = element._root.children[1].children[0].children[0];
        const c = element._ctx.canvas;

        const view = element._interactor.view;
        const cq = g2().view(view);
        cq.rec({
            x: () => -view.x / view.scl,
            y: () => -view.y / view.scl,
            b: () => element.height / view.scl,
            h: () => element.width / view.scl,
            fs: '#000'
        });

        function draw(e) {
            e.preventDefault();
            const bbox = e.target.getBoundingClientRect && e.target.getBoundingClientRect() || {left:0, top:0};
            const x = (-view.x + e.clientX - Math.floor(bbox.left)) / view.scl;
            const y = (-view.y + element.height - (e.clientY - Math.floor(bbox.top))) / view.scl;
            if (last) {
                const now = { x2: x, y2: y };
                if (e.buttons === 1) {
                    cq.lin({ ...last, ...now, lc: 'round', lw: 3, ls: '#fff' });
                }
                else if (e.buttons === 2) {
                    cq.lin({ ...last, ...now, lc: 'round', lw: 6, ls: '#000' });
                }
            }
            last = { x1: x, y1: y };
            cq.exe(element._ctx);
        }
        function cancel(e) {
            c.removeEventListener('pointermove', draw);
            last = undefined;
        }
        function drawOnMove(e) { c.addEventListener('pointermove', draw); }
        function preventDefault(e) { if (element._drawing) e.preventDefault(); }

        let last;
        element._drawing = false;
        element._drawbtnHdl = e => {

            element._drawing = !element._drawing;
            if (element._drawing) {
                const m = element._model;
                const grp = {
                    commands: element._g.commands.filter(
                        c => m.nodes.includes(c.a) || m.constraints.includes(c.a))
                }
                cq.use({ grp });
                element._interactor.deinit();
                c.addEventListener('pointerup', cancel);
                c.addEventListener('pointerdown', drawOnMove);
                c.addEventListener('contextmenu', preventDefault);

                cq.exe(element._ctx);
            } else {
                c.removeEventListener('pointerdown', drawOnMove);
                element._interactor.init(element._ctx);
                element._interactor.startTimer();
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