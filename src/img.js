class img{
    constructor(img,x,y, whenDraw = "always", reqs = []){
        this.img = img // is a string
        this.x = x
        this.y = y
		
		this.whenDraw = whenDraw; // "always", "met", "not met"
		this.reqs = reqs; // used for whenDraw, ignored if whenDraw = always
		// simpler version of reqImgs
    }
}
export default img
