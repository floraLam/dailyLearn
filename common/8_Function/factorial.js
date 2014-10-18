/*
	
	defining your own function properties
uses properties of itself(treat itself as an array) to cache previously computed results
	created : 2014-10-18
	
*/


function factorial(n)
{
	
	if(isFinite(n) && n>0 && n==Math.round(n)){	//Finite,positive ints only
		if(!(n in factorial))			//if no cahched result
		{
			factorial[n] = n*factorial(n-1);//compute and cache it
		}	
		return factorial[n];			//return the cached result
	}
	else
		return NAN;				//if  input was bad
}
factorial[1] = 1; 					//Initialize the cache  to hold this base case

console.info(factorial[1]);
console.info(factorial(3));
console.info(factorial[3]);
console.info(factorial[2]);
