/*
	bind
	create : 2014-10-17
	
*/


var person = {
	name: 'flora',
	job: 'web front end developer',
	gender: 'female',
	sayHello: function() {
		return 'Hi, I am ' + this.name + ', a ' + this.job;
	}
}
console.log(person.sayHello()); // Hi, I am flora, a web front end developer
var anotherGuySayHello = person.sayHello.bind({
	name:'ray',
	job: 'back end JAVA developer'
});
console.log(anotherGuySayHello()); // Hi, I am ray, a back end JAVA developer 



var array_1 = [null,undefined,10,NaN,'10',true,function(){}];
    var array_2 = [new Function(),new String(),new Number(),new Boolean(true),{},[],/x/,new Error(),new Date()];
    var varArray = array_1.concat(array_2);
    (function(){
        for(var i in varArray){
            console.log(typeof varArray[i]);
        }
    })();
