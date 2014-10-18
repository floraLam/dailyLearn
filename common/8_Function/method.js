/*
    use the variable self to store the scope of the outer function ,so that you can access the scope for the inner function
	
*/


var o = {
    m : function(){
        var self = this;
        console.log(this === o);
        f();
        
        function f(){
            console.log(this === o);
            console.log(self === o);
        }
    }
};
o.m();

function isArray(value){
	if (value instanceof Array ||
		(!(value instanceof Object) &&
		(Object.prototype.toString.call((value)) == '[object Array]') ||
		typeof value.length == 'number' &&
		typeof value.splice != 'undefined' &&
		typeof value.propertyIsEnumerable != 'undefined' &&
		!value.propertyIsEnumerable('splice'))) {
			return 'array';
		} 
}
function flexisum(a)
{
    var total = o;
	console.info(arguments);
    for(var i = 0;i<arguments.length ; i++)
    {
	
        var element = arguments[i],n;
	console.info(arguments[i]);
        if(element == null) continue; //ignore null and undefined arguments
        if(isArray(element))//if the argument is an array compute its sum recursively
            n = flexisum.apply(this,element);
        else if(typeof element === "function ")//if it's a function invoke it and convert
            n = Number(element());
        else n = Number(element);
        
        if(isNaN(n))
            throw Error("flexisum() can't convert" + element+"to number");
        total += n;
    }
    return total;
}
console.info(flexisum(1,4,4));




















