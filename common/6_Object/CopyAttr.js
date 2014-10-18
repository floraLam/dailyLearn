/*
    add a nonenumerable extend() method to Object.prototype
    this method extends the object on which it is called by copying properties from the object passed as its argument.All properties of the argument object are copied unless a property with the same name already exists in the target object
	
*/


Object.defineProperty(Object.prototype,
    "extend",
    {
        writable : true,
        enumerable : false,
        configurable : true,
        value : function(o){
            //get all the props,even nonenumerable ones
            var names = Object.getOwnPropertyNames(o);
            for(var i = 0;i< names.length ;i++)
            {
                //skip props already in this object
                if(names[i] in this) continue;
                //get property description from o
                var desc  = object.getOwnPropertyDescriptor(o,names[i]);
                //use it to create property on this
                Object.defineProperty(this,names[i],desc);
            }
        }
    }                  

})
