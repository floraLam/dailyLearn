/*
	code from <javascript the definition book>
		

	One important use of the Arguments object is to write functions that operate on any number of arguments.
	function max behaves the same way like the built-in function Math.max()
*/


function max(/* ... */)
{
	var max = Number.NEGATIVE_INFINITY;
	//loop through the arguments ,looking for,and remembering ,the biggest.
	for(var i = 0;i<arguments.length ;i++)
	{
		if(arguments[i] > max) max = arguments[i];
	}
	//return the biggest
	return max;
}
