function Stack(){
	this.dataStore = [];
	this.top = 0;
	this.push =push;
	this.pop = pop;
	this.peek = peek;
}
function push(element){
	this.dataStore[this.top++] = element;
}
function pop(){
	return this.dataStore[--this.top];
}
function peek(){
	return this.dataStore[this.top-1];
}
function length(){
	return this.top;
}
function clear(){
	this.dataStore.splice(0,this.top);
	this.top =0;

}