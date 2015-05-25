/* base start */
var superJs;
superJs = function(selector, context) {
	var elems = []; //to save the selector for return 
	context = context || document; //if there no arguments of context , set document

	if (context.nodeName) { //Determine whether the context is a node or not,true : to do  
		elems = context === document ? context.querySelectorAll(selector) : selectorAll(selector, context);
		//document can not get getAttribute and in order to deal width the BUG of querySelectorAll,
		//to make sure if not document === context, go to deal with this BUG
		elems = makeArray(elems);
		//elems is arrary-like, go to make it to be arrary
	} else {
		//in order to deal width a situation when there 
		//<div id="a">
		//<span>span1</span>
		//<span>span2</span>
		//<div id="a1"><span>span3</span></div>
		//</div>,
		//$('span',$('div')) will repeat to get span
		context = makeArray(context); //make context to be arrary

		var prevElem = context[0], //the first context ele
			curElem;

		for (var i = 0, len = context.length; i < len; i++) {
			curElem = context[i]; //ele in context eles, and to make sure it is not in the prevElem
			if (!contains(prevElem, curElem)) { //when curElem if not in the prevElem go in
				prevElem = curElem;
				//update the prevElem,because is no relationship between all prev eles before cur ele and cur ele;
				elems = makeArray(selectorAll(selector, curElem), elems);
			}
		}
	}
	
	if(elems.length == 1){
		elems = elems[0];
	}
	return elems;

	function selectorAll(selector, context) { //to deal woth the BUG of querySelectorAll 
			var oldContext = context,
				oldId = context.getAttribute('id'),
				newId = oldId || '__sizzle__';
			try {
				!oldId ? context.setAttribute('id', newId) : null;
//				selectors = context.querySelectorAll('#' + newId + ' ' + selector);
				selectors = context.querySelectorAll(selector);
			} catch (e) {

			} finally {
				if (!oldId) {
					oldContext.removeAttribute('id');
				}
				return selectors;
			}
		}
		//简单地将array-like转换为真正的数组

	function makeArray(source, target) {
			target = target || [];
			for (var i = 0, len = source.length; i < len; i++) {
				target[target.length] = source[i];
			}
			return target;
		}
		//to see the link http://blog.csdn.net/huajian2008/article/details/3960343 how to decide a eleA is in eleB or not 

	function contains(root, el) {
		// 按照原则，先判断标准浏览器
		if (root.compareDocumentPosition) {
			return !!(root.compareDocumentPosition(el) & 16);
		} else if (root.contains) {
			return root !== el && root.contains(el);
		}
		return false;
	}
};

(function($) {
	$.getContextData = function(context) {
		var map = {};
		context = context || $("body");
		if (typeof(context) == "string") {
			context = $("#" + context);
		}
		var targets = $("[dbfield]", context),
			target, type, fieldName, i, len = targets.length,
			checkboxTargets, checkboxData, tagName, selectOption, selectObj;
		if(typeof len == "undefined"){
			targets=[targets];
			len = targets.length;
		}
		for (i = 0; i < len; i++) {
			target = targets[i];
			tagName = target.tagName.toLowerCase();
			fieldName = target.getAttribute("dbfield");
			switch (tagName) {
				case "p":
				case "span":
				case "div":
					map[fieldName] = target.innerText || target.innerHTML;
					break;
				case "img":
					map[fieldName] = target.getAttribute("src");
					break;
				case "input":
					type = target.getAttribute("type");
					switch (type) {
						case "text":
						case "hidden":
						case "password":
						case "textarea":
						case "email":
						case "number":
							map[fieldName] = target.value;
							break;
						case "radio":
							target = $("input[type='radio'][dbfield='" + fieldName + "']:checked", context);
							map[fieldName] = target.value;
							break;
						case "checkbox":
							checkboxData = map[fieldName] || [];
							checkboxData.push({
								fieldName: target.value
							});
							map[fieldName] = checkboxData;
						case "file":
							map[fieldName] = target;
							break;
					}
					break;
				case "select":
					var selectIndex = target.selectedIndex;//获得是第几个被选中了
					var selectText = target.options[selectIndex].text ;
					selectObj = {
						"text": selectText,
						"val": target.value
					};
					map[fieldName] = selectObj;
					break;
				case "textarea":
					map[fieldName] = target.value;
					break;
			}
		}
		return map;
	};

	$.setContextData = function(obj, context) {
		var p, eles, selectEle, i, len, tagName;
		context = context || $("body");
		if (typeof(context) == "string") {
			context = $("#" + context);
		}
		for (p in obj) {
			eles = $("[dbField='" + p + "']", context);
			if (eles && ( typeof eles.length == "undefined" || eles.length>0)) {
				if(! eles.length){
					eles = [eles];
				}
				for (i = 0, len = eles.length; i < len; i++) {
					tagName = eles[i].tagName.toLowerCase();
					if ((tagName == 'input' && eles[i].type != 'radio') || eles[i].tagName == 'select' || eles[i].tagName == 'textarea') {
						eles[i].value = obj[p];
					} else if (eles[i].tagName == 'input' && eles[i].type == 'radio') {
						selectEle = $("[dbField='" + p + "'][type='radio'][value='" + obj[p] + "']", context);
						selectEle.checked = true;
					} else if (eles[i].tagName == 'input' && eles[i].type == 'checkbox') {
						selectEle = $("[dbField='" + p + "'][type='checkbox'][value='" + obj[p] + "']", context);
						selectEle.checked = true;
					} else if (eles[i].tagName == 'IMG') {
						eles[i].setAttribute("src", obj[p]);
					} else if (eles[i].tagName == 'a') {
						if (obj[p]) {
							eles[i].setAttribute("href", obj[p]);
						}
					} else
						eles[i].innerHTML = obj[p];
				}

			}
		}
	};
	
	$.getUrlParms =function(){
		var args=new Object();   
	    var query=location.search.substring(1);//获取查询串   
	    var pairs=query.split("&");//在逗号处断开   
	    for(var   i=0;i<pairs.length;i++)   
	    {   
	        var pos=pairs[i].indexOf('=');//查找name=value   
	            if(pos==-1)   continue;//如果没有找到就跳过   
	            var argname=pairs[i].substring(0,pos);//提取name   
	            var value=pairs[i].substring(pos+1);//提取value   
	            args[argname]=decodeURI(value);//存为属性   
	    }
	    return args;
	}
	
	$.getDataFromJson = function(json){
		var obj;
		if(!json){
			return {};
		}
		// json = json.replace(new RegExp("\"","gm"),"'");
		if(typeof(json) =="string"){
			if(json==""){
				return {};
			}
			try{
				obj = JSON.parse(json);
				return obj;
			}catch(err){
				txt="此页面存在一个错误。\n\n"
				txt+="错误描述: " + err.message  + "\n\n"
				txt+="点击OK继续。\n\n"
				$.console(txt);
				obj = eval("["+json+"]");
				return obj[0];
			}
		}else{
			return json;
		}
	}
	
	$.getStorageData = function(key){
		return window.localStorage[key] || "";
	}
	
	$.setStorageData = function(key,value){
		window.localStorage[key] = JSON.stringify(value);
	}
	
	$.ready = (function(func) {
		/* * 传递函数给whenReady() * 当文档解析完毕且为操作准备就绪时，函数作为document的方法调用 */
		//这个函数返回whenReady()函数    
		var funcs = [];
		//当获得事件时，要运行的函数    
		var ready = false;
		//当触发事件处理程序时,切换为true        
		//当文档就绪时,调用事件处理程序    
		function handler(e) {
				if (ready) return;
				//确保事件处理程序只完整运行一次               
				//如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好        
				if (e.type === 'onreadystatechange' && document.readyState !== 'complete') {
					return;
				}
				//运行所有注册函数        
				//注意每次都要计算funcs.length        
				//以防这些函数的调用可能会导致注册更多的函数        
				for (var i = 0; i < funcs.length; i++) {
					funcs[i].call(document);
				}
				//事件处理函数完整执行,切换ready状态, 并移除所有函数        
				ready = true;
				funcs = null;
			}
			//为接收到的任何事件注册处理程序    
		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', handler, false);
			document.addEventListener('readystatechange', handler, false);
			//IE9+
			window.addEventListener('load', handler, false);
		} else if (document.attachEvent) {
			document.attachEvent('onreadystatechange', handler);
			window.attachEvent('onload', handler);
		}
		//返回whenReady()函数 
		return function whenReady(fn) {
			if (ready) {
				fn.call(document);
			} else {
				funcs.push(fn);
			}
		}
	})();
	
	$.addEvent = function(obj,type,fn,option){
		var i,ilen;
	    if(type=="touch"){
	    	if( obj.length >0 ){
	    		for(i=0,ilen=obj.length;i<ilen;i++){
	    			addTouchEvent(obj[i],fn);
	    		}
	    	}else{
	    		addTouchEvent(obj,fn);
	    	}
	    }
	    if(window.navigator.msPointerEnabled && (type==="touchstart" || type==="touchmove" || type==="touchend")){
	    	switch(type){
	    		case "touchstart":type="MSPointerDown";break;
	    		case "touchmove":type="MSPointerMove";break;
	    		case "touchend":type="MSPointerOut";break;
	    	}
	    }
	    if(window.addEventListener){
	    	var flag = false;
	    	if( type == "blur" || type == "focus"){
	    		flag = true;
	    	}
	    	if(option && typeof option.propagationFlag != "undefined"){
	    		flag = option.propagationFlag;
	    	}
	    	if( obj.length >0 ){
	    		for(i=0,ilen=obj.length;i<ilen;i++){
	    			obj[i].addEventListener(type,fn,flag);
	    		}
	    	}else{
	    		obj.addEventListener(type,fn,flag);
	    	}
	    }
	    else{
	    	if( obj.length >0 ){
	    		for(i=0,ilen=obj.length;i<ilen;i++){
	    			obj[i].attachEvent("on"+type,function(e){
			            return fn.call(obj,e);
			        });
	    		}
	    	}else{
	    		obj.attachEvent("on"+type,function(e){
		            return fn.call(obj,e);
		        });
	    	}
	    }

		function addTouchEvent(titleNodes,func){
		    if(typeof titleNodes =="array" ){
		        for(var i in titleNodes){
		            if(titleNodes.hasOwnProperty(i) && i != 'length'){
		                var isClick = false;
		                var startTime = 0,endTime = 0;
		                var startPageX=0,startPageY=0,endPageX=0,endPageY=0;
		                $.addEvent(titleNodes[i],'touchend',function(e){
		                    isClick = true;
		                    startTime = e.timestamp || Date.now();
		                    var touch = e.touches[0],
		                    startPageX = touch.pageX,
		                    startPageY = touch.pageY;
		                })
		
		                $.addEvent(titleNodes[i],'touchmove',function(e){
		                    isClick = false;
		                })
		
		                $.addEvent(titleNodes[i],'touchend',function(e){
		                    endTime = e.timestamp || Date.now();
		                    var touch = e.touches[0],
		                    endPageX = touch.pageX,
		                    endPageY = touch.pageY;
		                    if(endTime - startTime < 400 && (Math.abs(endPageX-startPageX)<10 && Math.abs(endPageY-startPageY)<10)){
		                        if(isClick){
		                            func(e);
		                        }   
		                    }
		                })
		            }
		        }
		    }else{
		        var isClick = false;
		        var startTime = 0,endTime = 0;
		        $.addEvent(titleNodes,'touchend',function(e){
		            isClick = true;
		            startTime = e.timestamp || Date.now();
		        })
		
		        $.addEvent(titleNodes,'touchmove',function(e){
		            isClick = false;
		        })
		
		        $.addEvent(titleNodes,'touchend',function(e){
		            endTime = e.timestamp || Date.now();
		            if(endTime - startTime < 400){
		                if(isClick){
		                    func(e);
		                }   
		            }
		        })
		    }
		}
	};
	
	$.removeEvent = function(obj,type,fn){
	    if(obj.removeEventListener){
	        obj.removeEventListener(type,fn,false);
	    }else{
	        obj.detachEvent("on"+type,function(event){
	           return fn.call(obj,event);
	        });
	    }
	};
	
	$.show = function(obj){
		if($.isExistEle(obj)){
			$.removeClass(obj,"display-none");
		}
	};
	
	$.hide = function(obj){
		if($.isExistEle(obj)){
			$.addClass(obj,"display-none");
		}
	};	
	
	$.hasClass = function( target, name ) {
		console.info(target);
		console.info(name);
		return target && target.className.match(new RegExp('(\\s|^)'+name+'(\\s|$)'));
	}
	
	$.addClass = function( target, name ) {
		if(!$.isExistEle(target)){
			return ;
		}
		if(target.length>0){
			for(var i=0;i<target.length;i++){
				if( !$.hasClass( target[i], name ))target[i].className += " "+name;
			}
		}else{
		    if( !$.hasClass( target, name ))target.className += " "+name;
		}
		return target;
	}
	
	$.removeClass = function( target, name ) {
		if(!target){
			return ;
		}
	    var reg = new RegExp('(\\s|^)' + name + '(\\s|$)');
		if(target.length>0){
			for(var i=0;i<target.length;i++){
				target[i].className = target[i].className.replace(reg, '');
			}
		}else{
		    target.className = target.className.replace(reg, '');
		}
		return target;
	}	
	
	$.toggleClass = function( target, name ) {
		var i,ilen;
		if(target.length>0){
			for(i=0,ilen=target.length;i<ilen;i++){
				arguments.callee(target[i],name);
			}
		}else{
			if($.hasClass(target,name)){
				$.removeClass(target,name);
			}else{
				$.addClass(target,name);
			}
		}
		return target;
	};
	
	$.isExistEle = function(obj){
		return obj && ( typeof obj.length == "undefined" && obj || obj.length > 0 );
	};
	
	$.searchTarget = function(target ,tagStr ,tagParentId) {
	    var className;
	    if(tagStr.substring(0,1) == "." ){
	    	className=tagStr.substring(1,tagStr.length);
	    	while (!$.hasClass(target,className)) {
		        target = target.parentNode;
		        if(tagParentId && target.id== tagParentId || target == document.body || !target.parentNode ){
		            return;
		        }
		    }
	    }else if(tagStr.substring(0,1) == "#" ){
	    	var $tagStr =$(tagStr);
	    	while (target != $tagStr) {
		        target = target.parentNode;
		        if(tagParentId && target.id== tagParentId || target == document.body || !target.parentNode){
		            return;
		        }
		    }
	    }else{
		    while (target.tagName.toLowerCase() != tagStr) {
		        target = target.parentNode;
		        if(target.id== tagParentId ){
		            return;
		        }
		    }
	    }
	    return target;
	};
	
	$.appendHTML = function(html,context) {
	    var divTemp = document.createElement("div"), nodes = null
	        // 文档片段，一次性append，提高性能
	        , fragment = document.createDocumentFragment();
	    divTemp.innerHTML = html;
	    nodes = divTemp.childNodes;
	    for (var i=0, length=nodes.length; i<length; i+=1) {
	       fragment.appendChild(nodes[i].cloneNode(true));
	    }
	    context.appendChild(fragment);
	    // 据说下面这样子世界会更清净
	    nodes = null;
	    fragment = null;
	};
	$.waitFlower =function(){
		
		if($(".waitFlower").style.display == "none"){
			$(".waitFlower").style.display = "block";
		}else{
			$(".waitFlower").style.display = "none";
		}	
		
	

	};
	$.prependHTML = function(html,context) {
	    var divTemp = document.createElement("div"), nodes = null
	        , fragment = document.createDocumentFragment();
	    divTemp.innerHTML = html;
	    nodes = divTemp.childNodes;
	    for (var i=0, length=nodes.length; i<length; i+=1) {
	       fragment.appendChild(nodes[i].cloneNode(true));
	    }
	    // 插入到容器的前面 - 差异所在
	    context.insertBefore(fragment, context.firstChild);
	    // 内存回收？
	    nodes = null;
	    fragment = null;
	};
	
	$.afterHTML = function(html,context) {
	    var divTemp = document.createElement("div"), nodes = null
	        , fragment = document.createDocumentFragment();
	    divTemp.innerHTML = html;
	    nodes = divTemp.childNodes;
	    for (var i=0, length=nodes.length; i<length; i+=1) {
	       fragment.appendChild(nodes[i].cloneNode(true));
	    }
	    // 插入到容器的前面 - 差异所在
	    context.parentNode.insertBefore(fragment, context.nextSibling.nextSibling);
	    // 内存回收？
	    nodes = null;
	    fragment = null;
	};
	
	$.getScript = function(url,callback){
		var versionScript = document.createElement("script");
		versionScript.setAttribute('src', url + "?ts=" + new Date().getTime());
		versionScript.setAttribute('type', "text/javascript");
		document.body.appendChild(versionScript);
		versionScript.onload = versionScript.onreadystatechange = function(){
			if(!this.readyState || this.readyState === 'loaded' || this.readyState  === 'complete'){  
				if(typeof callback == "function"){
					callback();
				}
			}
		};
	};
	
	$.formatDate = function (dateStr,format) {//ex: dateStr:20130909
		if(typeof(dateStr)== 'string' && !format){
			var year = dateStr.substring(0,4);
			var month = dateStr.substring(4,6);
			var day = dateStr.substring(6,8);
			var hour = dateStr.substring(8,10);
			var minutes = dateStr.substring(10,12);
			var seconds = dateStr.substring(12,14);
			var date = year+"/"+month+"/"+day+" "+hour+":"+minutes+":"+seconds
			return date;
		}else if(typeof(dateStr)== 'string' && format){
			var year = dateStr.substring(0,4);
			var month = dateStr.substring(4,6);
			var day = dateStr.substring(6,8);
			var hour = dateStr.substring(8,10);
			var minutes = dateStr.substring(10,12);
			var seconds = dateStr.substring(12,14);
			var str=format;
			str=str.replace('yyyy', year).replace('MM', month).replace('dd', day).replace('HH', hour).replace('mm', minute).replace('ss', seconds);
			return str;
		}else if (typeof(dateStr)== 'object'){
			var year=dateStr.getFullYear();
			var month=dateStr.getMonth() + 1;
			var day=dateStr.getDate();
			var hour=dateStr.getHours();
			var minute=dateStr.getMinutes();
			var second=dateStr.getSeconds();    
			
			var str=format;
			
			if(month<10){
				month="0"+month;
			}
			if(day<10){
				day="0"+day;
			}
			if(hour<10){
				hour="0"+hour;
			}
			if(minute<10){
				minute="0"+minute;
			}
			if(second<10){
				second="0"+second;
			}				
			str=str.replace('yyyy', year).replace('MM', month).replace('dd', day).replace('HH', hour).replace('mm', minute).replace('ss', second);
			return str;
		}
	};
	
	$.console = function(msg) {
		console.log(msg);
//		alert(msg);
	};
	
	$.toast = function(msg) {
		$.console(msg);
	};
	
	$.alert = function(msg) {
		alert(msg);
	};
	
})(superJs);

/* base end */

/* ajax start */
(function($) {

	var scriptTypeRE = /^(?:text|application)\/javascript/i,
		xmlTypeRE = /^(?:text|application)\/xml/i,
		jsonType = 'application/json',
		htmlType = 'text/html',
		blankRE = /^\s*$/;

	$.ajaxSettings = {
		// Default type of request
		type: 'post',
		// Callback that is executed before request
		beforeSend: empty,
		// Callback that is executed if the request succeeds
		success: empty,
		// Callback that is executed the the server drops error
		error: empty,
		// Callback that is executed the the server drops abort
		abort: empty,
		// Callback that is executed the the server drops timeout
		timeoutFunc: empty,
		// Callback that is executed on request complete (both: error and success)
		complete: empty,
		// Whether to trigger "global" Ajax events
		global: true,
		// Default timeout
		timeout: 10000,
		//async
		async: true,
		//prevent repeat submit
		canRepeat: false,
		repeatObj: {} //{"methodName":{"data":setting.data,"requesting":false}}
	};

	$.ajax = function(settings) {
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
			url = settings.url,
			data = $.serialize(settings.data),
			protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
			timeout = settings.timeout || $.ajaxSettings.timeout;

		var abortTimeout = setTimeout(function() { /*重点，在请求发布后开始设置setTimeout，如果请求状态不成功也就是readyState != 4 那么setTimeout将会在5秒后运行，并弹出信息提示，要是请求成功，将会清除该setTimeout*/
			xhr.abort(); //终止XMLHttpRequest对象
			ajaxError(null, 'timeout', xhr, settings);
			ajaxComplete(status, xhr, settings);
		}, $.ajaxSettings.timeout);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				xhr.onreadystatechange = empty;
				clearTimeout(abortTimeout);
				var result, error = false,
					dataType, status = "";
				//根据状态来判断请求是否成功
				//状态>=200 && < 300 表示成功
				//状态 == 304 表示文件未改动过，也可认为成功
				//如果是取要本地文件那也可以认为是成功的，xhr.status == 0是在直接打开页面时发生请求时出现的状态，也就是不是用localhost的形式访问的页面的情况
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
					//获取返回的数据类型
					dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));
					result = xhr.responseText;
					status = "success";

					if (dataType == 'script')(1, eval)(result) //如果返回的数据类型是JS
					else if (dataType == 'xml') result = xhr.responseXML
					else if (dataType == 'json') result = blankRE.test(result) ? null : JSON.parse(result)

					ajaxSuccess(result, xhr, settings);
					ajaxComplete(status, xhr, settings);
				} else {
					//如果请求出错，则根据xhr.status来执行相应的错误处理函数
					if (xhr.status != 0) { //0:timeout
						status = "error";
						ajaxError(null, status, xhr, settings);
						ajaxComplete(status, xhr, settings);
					}
				}
				superJs.console("调用："+settings.url+"\n结果："+JSON.stringify(result)+"\n");
			}
		}

		settings.method = settings.method || "post";

		if (!ajaxBeforeSend(data, xhr, settings)) {
			xhr.abort(); //终止XMLHttpRequest对象
			clearTimeout(abortTimeout);
			ajaxError({
				"msg": "abort"
			}, 'abort', xhr, settings);
			ajaxComplete("abort", xhr, settings);
		} else {
			var async = 'async' in settings ? settings.async : $.ajaxSettings.async;
			if (settings.method.toLowerCase() == "get") {
				//get
				xhr.open('GET', url + "?" + data, async);
				xhr.send();
			}
			if (settings.method.toLowerCase() == "post") {
				//post
				xhr.open('POST', url, async);
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.send(data);
			}
		}
		
		superJs.console("调用："+settings.url+"\n入参："+JSON.stringify(settings.data)+"\n");
	}

	function empty() {
		return true;
	};

	//根据MIME返回相应的数据类型，用作ajax参数里的dataType用，设置预期返回的数据类型
	//如html,json,scirpt,xml,text
	var mimeToDataType = function(mime) {
		if (mime) mime = mime.split(';', 2)[0]
		return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text'
	}

	//将obj转换为查询字符串的格式
	$.serialize = function(obj) {
		var res = "";
		for (var i in obj) {
			res += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]) + "&";
		}
		return res.slice(0, -1);
	}

	var ajaxBeforeSend = function(data, xhr, settings) {
		var result = true;
		var canRepeat = settings.canRepeat || $.ajaxSettings.canRepeat;
		if (canRepeat === false) {
			if (isPreventRepeatAndRequesting(settings)) {
				result = false;
			} else {
				updateRepatObj(settings, true);
			}
		}
		if (result === true && $.ajaxSettings.global && $.ajaxSettings.beforeSend) {
			result = $.ajaxSettings.beforeSend(data, xhr, settings) === undefined ? true : result;
		}
		if (result === true && settings.beforeSend) {
			result = settings.beforeSend(data, xhr, settings) === undefined ? true : result;
		}
		return result;
	}

	var ajaxSuccess = function(data, xhr, settings) {
		$.ajaxSettings.global && $.ajaxSettings.success(data, xhr, settings);
		settings.success && settings.success(data, xhr, settings);
	}

	var ajaxError = function(error, status, xhr, settings) {
		if (status === "timeout") {
			$.ajaxSettings.global && $.ajaxSettings.timeoutFunc(error, status, xhr, settings);
			settings.timeoutFunc && settings.timeoutFunc(error, status, xhr, settings);
		} else if (status === "abort") {
			$.ajaxSettings.global && $.ajaxSettings.abort(error, status, xhr, settings);
			settings.abort && settings.abort(error, status, xhr, settings);
		} else if (status === "error") {
			$.ajaxSettings.global && $.ajaxSettings.error(error, status, xhr, settings);
			settings.error && settings.error(error, status, xhr, settings);
		}
	}

	var ajaxComplete = function(status, xhr, settings) {
		$.ajaxSettings.global && $.ajaxSettings.complete(status, xhr, settings);
		settings.complete && settings.complete(status, xhr, settings);
		var canRepeat = settings.canRepeat || $.ajaxSettings.canRepeat;
		if (canRepeat === false) {
			updateRepatObj(settings, false);
		}
	}

	var isPreventRepeatAndRequesting = function(settings) {
		var url = settings["url"];
		var action = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
		var repeatObj = $.ajaxSettings.repeatObj[action];
		if (repeatObj && JSON.stringify(repeatObj.data) === JSON.stringify(settings.data) && repeatObj.requesting === true) {
			return true;
		}
		$.ajaxSettings.repeatObj[action] = {
			"data": settings.data,
			"requesting": true
		};
		return false;
	}

	var updateRepatObj = function(settings, requesting) {
		var url = settings["url"];
		var action = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
		var repeatObj = $.ajaxSettings.repeatObj[action];
		$.ajaxSettings.repeatObj[action] = {
			"data": settings.data,
			"requesting": requesting
		};
	}

})(superJs);

(function($) {
	$.extend = function(targetObj, sourceObj) {
		for (var key in sourceObj) {
			if (sourceObj.hasOwnProperty(key)) {
				targetObj[key] = sourceObj[key];
			}
		}
	};
})(superJs);

/* ajax end */

/* 表单校验 开始 */
(function($) {
	$.validFormData = function(formData, validData) {
		var resultObj = {
			"result": true,
			"resultMsg": "",
			"require": false
		};
		var passFlag = false; //可以跳过后面的校验标记
		var validData = validData || window.validData;
		for (key in formData) {
			passFlag = false;
			resultObj.dbfield = key;
			if (validData[key]) {
				var value = formData[key];
				var validRuleObj = validData[key];
				resultObj.require = validRuleObj.require;
	
				//必填校验
				if (typeof validRuleObj.require != "undefined" && validRuleObj.require == false && !value) {
					passFlag = true;
				} else if (validRuleObj.require && validRuleObj.require == true && !value) {
					resultObj.result = false;
					resultObj.resultMsg = validRuleObj["requireMsg"];
					return resultObj;
				}
				//长度校验
				if (!passFlag && validRuleObj.minlen && validRuleObj.maxlen && (value.length < validRuleObj.minlen || value.length > valid_rule_obj.maxlen)) {
					resultObj.result = false;
					resultObj.resultMsg = validRuleObj["lenMsg"];
					return resultObj;
				};
				//正则表达式校验
				if (!passFlag && validRuleObj.regexArr && validRuleObj.regexArr.length > 0) {
					for (var i = 0, len = validRuleObj.regexArr.length; i < len; i++) {
						var regex = new RegExp(validRuleObj.regexArr[i]);
						if (!regex.test(value)) {
							resultObj.result = false;
						 	resultObj.resultMsg = validRuleObj.regexArrMsg[i];
							return resultObj;
						}
					}
				};
				//不能为某值校验
				if (!passFlag && validRuleObj.notValue && validRuleObj.notValue.length > 0) {
					for (var i = 0, len = validRuleObj.notValue.length; i < len; i++) {
						if (validRuleObj.notValue[i] == value) {
							resultObj.result = false;
							resultObj.resultMsg = validRuleObj.notValueMsg[i];
							return resultObj;
						}
					}
				};
			}
		}
		return resultObj;
	}
})(superJs);
/* 表单校验 结束 */

/* custom start */
superJs.extend(superJs.ajaxSettings, {
	"error": function() {
//		superJs.console("ajaxSettings.error");
	},
	"abort": function(error) {
//		superJs.console(error.msg);
	},
	"timeoutFunc": function() {
		superJs.console("网络开小差了");
	},
	"success": function() {
//		superJs.console("ajaxSettings.success");
	},
	"beforeSend": function(data) {
//		superJs.console("ajaxSettings.beforeSend");
	},
	"complete": function() {
//		superJs.console("ajaxSettings.complete");
	}
});
/* custom end */

var $ = superJs;