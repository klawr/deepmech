`use strict`;
c.style.backgroundColor = 'black';

c.addEventListener('pointerup', cancel);
c.addEventListener("pointerdown", (e) => {
    c.addEventListener('pointermove', draw)
});

let last;
function draw(e) {
    if (last) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#fff';
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(e.pageX - 7, e.pageY - 10);
        ctx.stroke();
    }
    last = {x: e.pageX - 7, y: e.pageY - 10};
}

function cancel(e) {
    c.removeEventListener('pointermove', draw);
    last = undefined;
}