import * as d from "./canvasDrawing.js"
function draw(lst, c) {
    for (var _i = 0, lst_1 = lst; _i < lst_1.length; _i++) {
        var item = lst_1[_i];
        switch (item.type) {
            case "drawImage":
                d.drawImage(c, item.img, item.x, item.y);
                break;
            case "drawLine":
                d.drawLine(c, item.x0, item.y0, item.x1, item.y1, item.color, item.width);
                break;
            case "drawCircle":
                d.drawCircle(c, item.x, item.y, item.r, item.color, item.width, item.fill, item.transparency, item.start, item.end);
                break;
            case "drawPolygon":
                d.drawPolygon(c, item.points_x, item.points_y, item.color, item.width, item.fill, item.transparency);
                break;
            case "drawRectangle":
                d.drawRectangle(c, item.tlx, item.tly, item.brx, item.bry, item.color, item.width, item.fill, item.transparency);
                break;
            case "drawRectangle2":
                d.drawRectangle2(c, item.tlx, item.tly, item.width, item.height, item.color, item.widthA, item.fill, item.transparency);
                break;
            case "drawText":
                d.drawText(c, item.text_, item.x, item.y, item.width, item.color, item.size);
                break;
            case "drawEllipse":
                d.drawEllipse(c, item.posx, item.posy, item.brx, item.bry, item.color, item.transparency, item.rotate, item.start, item.end);
                break;
            case "drawEllipseCR":
                d.drawEllipseCR(c, item.cx, item.cy, item.rx, item.ry, item.color, item.transparency, item.rotate, item.start, item.end);
                break;
            case "drawEllipse2":
                d.drawEllipse2(c, item.posx, item.posy, item.width, item.height, item.color, item.transparency, item.rotate, item.start, item.end);
                break;
            case "drawBezierCurve":
                d.drawBezierCurve(c, item.x, item.y, item.p1x, item.p1y, item.p2x, item.p2y, item.p3x, item.p3y, item.color, item.width);
                break;
            case "drawBezierShape":
                d.drawBezierShape(c, item.x, item.y, item.curves, item.color, item.width);
                break;
            case "drawRoundedRectangle":
                d.drawRoundedRectangle(c, item.x0, item.y0, item.x1, item.y1, item.r1, item.r2, item.color, item.width, item.fill);
                break;
        }
    }
}
export default draw;