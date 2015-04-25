function Node(element) {
	this.element = element;
	this.next = null;
}
function LList() {
	this.head = new Node("head");
	this.find = find;
	this.insert = insert;
	this.display = display;
	this.findPrevious = findPrevious;
	this.remove = remove;
	this.append = append;
}
function remove(item) {
	var prevNode = this.findPrevious(item);
	if(!(prevNode.next == null)){
		prevNode.next = prevNode.next.next;
	}
}
//NOTE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function findPrevious(item){
	var currNode = this.head;
	while(!(currNode.next == null) && (currNode.next.element != item)){
		currNode = currNode.next;
	}
	return currNode;
}
function display() {
	var currNode = this.head;
	while (!(currNode.next == null)) {
		console.info(currNode.next.element);
		currNode = currNode.next;
	}
}
function find(item) {
	var currNode = this.head;
	while (currNode.element != item) {
		currNode = currNode.next;
	}
	return currNode;
}
//NOTE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function insert(newElement, item) {
	var newNode = new Node(newElement);
	var current = this.find(item);
	newNode.next = current.next;
	current.next = newNode;
}
//NOTE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function append(newElement) {
	var newNode = new Node(newElement);
	var currNode = this.head;
	while (!(currNode.next == null)) {
	
		currNode = currNode.next;
	}
	currNode.next = newNode;
	return this.head;
}