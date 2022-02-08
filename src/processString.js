export function aAn(x){
	if("aeiou".indexOf(x[0]) == -1){
				return "a " + x;
			} else {
				return "an " + x;
			}	
}
export function processString(string, reqs){
		//process a string based on reqs
		reqs = Array.from(reqs);
		var reqs2 = reqs.map(aAn);
		var reqString = reqs2.join(", ")
		var index = reqString.lastIndexOf(", ")
		if(index != -1){
			reqString = reqString.substr(0, index) + ", and " + reqString.substr(index+2)
		}
		return string.split("$1").join(reqString)
	}
	
export default processString;