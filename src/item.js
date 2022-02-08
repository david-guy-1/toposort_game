//items are always 40x40
// item DISPLAYED ON THE SCREEN
class item{
    constructor(name,image,x,y,displayString){
        this.name = name
        this.image = image
		this.displayString = displayString; // displayed when picking up item
        this.x = x
        this.y = y
    }
}
export default item