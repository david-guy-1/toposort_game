class monster{
	constructor(name, displayString, img, reqs, hp, width, height){
		if(Array.isArray(reqs)){
			reqs = new Set(reqs);
		}
		if(!Array.isArray(img) || img.length != 2){
			throw new Error("monster imgs must be array of length 2")
		}
		this.displayString = displayString; // used when cannot kill monster
		this.name = name;
		this.img = img; // a pair of images, not attacked vs. attacked
		this.reqs = reqs;
		this.hp = hp;
		this.width = width;
		this.height = height;
	}

}

export default monster;