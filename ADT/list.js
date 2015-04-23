function List() {
	this.listSize = 0;
	this.pos = 0;
	this.dataStore = []; 
	// initialize an empty array to save the list element
	this.clear = clear;
	this.find = find;
	this.toString = toString;
	this.insert = insert;
	this.append = append;
	this.remove = remove;
	this.front = front;
	
	this.end = end;
	this.prev= prev;
	this.next = next;
	this.length = length;
	this.currPos = currPos;
	this.moveTo = moveTo;
	this.getElement = getElement;
	this.length = length;

}
function append(element){
	this.dataStore[this.listSize++] = element;
}
function find(element){
	for(var i =0;i<this.listSize;i++){
		if(this.dataStore[i] == element){
			return i;
		}
	}
	return -1;
}
function remove(element){
	var  foundAt = this.find(element);
	if(foundAt > -1){
		this.dataStore.splice(foundAt,1);
		this.listSize--;
		return true;
	}
	return false;
}
function length(){
	return this.listSize;
}
function toString(){
	return this.dataStore;
}

/*
	//for test
	var names = new List();
	names.append("Cynthia");
	names.append("Raymond");
	names.append("Barbara");
	print(names.toString());
	names.remove("Raymond");
	print(names.toString());
*/

function insert(element.after){
	var insertPos = this.find(element);
	if(insertPos >-1){
		this.dataStore.splice(insertPos+1,0,element);
		this.listSize++;
		return true;
	}
	return false;
}

function clear(){
	//there is something different  to the original book in order to be more semantizative
	this.dataStore.splice(0,this.listSize);
	this.listSize = this.pos = 0;
}


function front(){
	this.pos =0;
}
function end(){
	this.pos = this.listSize-1;
}
function prev(){
	if(this.pos >0){
		--this.pos;
	}
}
function next(){
	if(this.pos < this.listSize-1){
		this.pos++;
	}
}
function removeTo(position){
	this.pos = position;
}
function getElement(){
	return this.dataStore[this.pos];
}