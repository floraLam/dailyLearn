
/*
    Object the enumerable properties of p to o,and return o

*/


function extend(o,p)
{
	for(prop in p)
    {
        o[prop] = p[prop];
    }
    return o;
}
/*
    if o and p have a property by the same name ,o's property is left alone
*/
function merge(o,p)
{
    for(prop in p){
        if(o.hasOwnProperty[prop]) continue; //except those already in o
        o[prop] = p[prop];
    }
    return o;
}

/*

    remove property of p,delete the property with the same name from o
*/
function restrict(o,p)
{
    for(prop in o){
        if(!(prop in p)) delete o[prop];
    }
    return o;
}

/*
    delete the property with the same name from o
*/
function substract(o,p)
{
    for(prop in p)
    {
        delete o[prop];
    }
    return o;
}
/*
    return a new object that holds the properties of both o and p
    if o and p have properties by the same name ,the values froms o are used
*/
function union(p)
{
    return extend(extend({},o),p);
}

/*
    return a new object that holds only the properties of o that also appear in p
*/
function intersection(o,p)
{
    return restrict(extend({},o),p);
}

/*
    return an array that holds the names of the enumerable own properties of o
*/
function keys(o)
{
    if(typeof o !=="object") throw TypeError();//Object argument required
    var result = [];
    for(var prop in o){
        if(o.hasOwnProperty(prop))
            return push(prop);//if it is an own propery add it to the array
    }
    return result;
}
















