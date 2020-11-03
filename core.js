import {dots_num, multipler, radius} from './settings.js';

function DegToRad(deg){
    return deg*Math.PI/180;
}
let h = window.innerHeight;
let w = window.innerWidth
Array.prototype.last = function() {
    return this[this.length - 1];
}

var stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: w,
    height: h,
    draggable: true
});

// then create layer
var main_circle_layer = new Konva.Layer();
var visual_dots_layer = new Konva.Layer();
var visual_dots_nums_layer = new Konva.Layer();
var lines_layer = new Konva.Layer();

var circle = new Konva.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: h * 0.9 * radius,
    stroke: 'black',
    strokeWidth: 1
});
main_circle_layer.add(circle);

circle.dots = [];


function draw_numbers(dn){
    visual_dots_nums_layer.destroy();
    visual_dots_layer.destroy();
    let iter = 0;
    for(let n = dn; n>0; n-=1) {
        let deltaAngle = DegToRad(360 / dn * n);

        let x = Math.cos(deltaAngle) * circle.radius() + circle.x();
        let xnum = Math.cos(deltaAngle) * circle.radius() * 1.2 + circle.x();
        let y = Math.sin(deltaAngle) * circle.radius() + circle.y();
        let ynum = Math.sin(deltaAngle) * circle.radius() * 1.2 + circle.y();

        circle.dots.push([x,y]);

        visual_dots_layer.add(new Konva.Circle({
            x: x,
            y: y,
            radius: circle.radius() / 150,
            fill: 'red'
        }));

        let new_text = new Konva.Text({
            x: xnum,
            y: ynum,
            text: n,
            fontSize: 100/Math.sqrt(dn) + 3,
            fontFamily: 'Calibri',
            fill: '#555',
        });

        new_text.offsetX(new_text.width() / 2);
        new_text.offsetY(new_text.height() / 2);

        visual_dots_nums_layer.add(new_text);

        iter++;
    }
    stage.add(visual_dots_nums_layer);
    stage.add(visual_dots_layer);
}
function draw_lanes(m, dn){
    lines_layer.destroy();

    for(let n = 0; n<dn; n+=1) {
        let first_angle = DegToRad(360 / dn * n);
        let second_angle = first_angle * m;

        let x1 = Math.cos(first_angle) * circle.radius() + circle.x();
        let y1 = Math.sin(first_angle) * circle.radius() + circle.y();

        let x2 = Math.cos(second_angle) * circle.radius() + circle.x();
        let y2 = Math.sin(second_angle) * circle.radius() + circle.y();

        lines_layer.add(new Konva.Line({
            points: [x1, y1, x2, y2],
            stroke: 'red',
            strokeWidth: circle.radius()*0.03/dn*10,
        }));

    }
    stage.add(lines_layer);
}



stage.add(main_circle_layer);

//draw_numbers(dots_num);
draw_lanes(multipler, dots_num);

var scaleBy = 1.2;
stage.on('wheel', (e) => {
    e.evt.preventDefault();
    var oldScale = stage.scaleX();

    var pointer = stage.getPointerPosition();

    var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    var newScale =
        e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
});
