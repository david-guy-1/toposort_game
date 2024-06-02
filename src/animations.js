// mutates 
export function update_all(animations) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var i = animations.length - 1; i >= 0; i--) {
        var result = animations[i].update(args);
        if (result) {
            animations.splice(i, 1);
        }
    }
}
// mutates 
export function add_drawings(commands, animations) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    for (var _a = 0, animations_1 = animations; _a < animations_1.length; _a++) {
        var animation = animations_1[_a];
        var new_commands = animation.draw(args);
        commands.push.apply(commands, new_commands);
    }
}



class star {

    constructor(r1 ,r2 ,x ,y ,dx ,dy ,angle ,spinspeed, color,lifespan ){
        this.r1=r1;
        this.r2=r2;
        this.x=x;
        this.y=y;
        this.dx=dx;
        this.dy=dy;
        this.angle=angle;
        this.spinspeed = spinspeed
        this.color=color;
        this.lifespan=lifespan;
        this.init=lifespan;
    }
    update(){
        this.x += this.dx;
        this.y += this.dy;
        this.angle += this.spinspeed; 
        this.lifespan -= 1;
        return this.lifespan <= 0;
    }
    draw(){ 
        var r1 = this.r1;
        var r2 = this.r2;
        var angle = this.angle; 
        var x = this.x;
        var y = this.y; 
        var interval = 2*Math.PI / 5;
        var points = []
        for(var i=0; i<10; i++){
            var t = interval * i/2 + angle
            if(i%2 == 0){
                points.push([Math.cos(t)*r2+x, Math.sin(t)*r2+y])
            } else { 
                points.push([Math.cos(t)*r1+x, Math.sin(t)*r1+y])
            }
        }
        var d = {type:"drawPolygon", "color":`hsla(${this.color[0]},${this.color[1]}%,${this.color[2]}%,${this.lifespan/this.init > 0.5 ? 1 : this.lifespan/this.init*2 })`, "fill":true, "points_x" : points.map((x) => x[0]), "points_y": points.map((x) => x[1])}
        return [d];
    }
}
export function spawn_stars(a ,x,y){
    for(var i = 0; i < 50; i++){
        var theta = Math.random()*2*Math.PI;
        var r1 = Math.random()*5;
        var r2 = r1 +3;
        var speed = 2*Math.random() + 3
        a.push(new star(r1, r2, x,y, Math.cos(theta)*speed , Math.sin(theta)*speed, 0, 0.03, [Math.random() * 360, 100, 75],40));
    }
}
export function spawn_circle(a ,x,y, color = "black", r = 5, lifespan = 60){
    var angle = Math.random() * 2 * Math.PI
    var speed =  3*Math.random()
    a.push(new circle(r, x, y, speed*Math.cos(angle), speed*Math.sin(angle), color, lifespan));

}


class circle {

    constructor(r ,x ,y ,dx ,dy, color,lifespan ){
        this.r=r;
        this.x=x;
        this.y=y;
        this.dx=dx;
        this.dy=dy;
        this.color=color;
        this.lifespan=lifespan;
        this.init = lifespan;
    }
    update(){
        this.x += this.dx;
        this.y += this.dy;
        this.lifespan -= 1;
        return this.lifespan <= 0;
    }
    draw(){ 
        return [{type:"drawCircle", color:this.color, x : this.x, y : this.y, r : this.r *this.lifespan/this.init, fill:"true"}]
    }
}
