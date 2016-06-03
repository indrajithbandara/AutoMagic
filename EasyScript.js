//version 0.6.0


window.EasyScript = function(selector) {

    //selecting the element
    var elems;
    if (typeof selector === 'undefined') {
        elems = [document];
    } else if (typeof selector === 'object') {
        if (Object.prototype.toString.call(selector) === '[object Array]' || Object.prototype.toString.call(selector) === '[object NodeList]') {
            elems = selector;
        } else {
            elems = [selector];
        }
    } else if (typeof selector === 'string') {
        elems = document.querySelectorAll(selector);
    } else {
        window.EasyScript.throwError('Selector must be a string');
        return false;
    }

    //add class to element
    //arguments: className
    //------------string------------
    function addClass() {
        var arg = arguments;
        Array.prototype.forEach.call(elems, function(elem, index) {
            var classArray = arg[0].split(' ');
            classArray.forEach(function(currentClass, index) {
                if (elem.className.indexOf(currentClass) < 0) {
                    elem.className += ' ' + currentClass;
                }
            });
        });
        return this;
    }

    //animate a css property
    //arguments: propertiesAndValues , duration , easing
    //---------------object-------------number----string------------
    function animate() {
        var arg = arguments;
        if (typeof arg[0] !== 'object' || arg.length < 1) {
            window.EasyScript.throwError('SyntaxError: Please specify css values to animate');
        } else {
            var vendors = [
                '-webkit-',
                '-o-',
                '-moz-',
                '-ms-',
                ''
            ];

            function getSupportedProp(proparray) {
                var root = document.documentElement;
                for (var i = 0; i < proparray.length; i++) {
                    if (proparray[i] in root.style) {
                        return proparray[i];
                    }
                }
            }

            function toCamelCase(str) {
                return str.replace(/(\-[a-z])/g, function($1) {
                    return $1.toUpperCase().replace('-', '');
                });
            }

            if (typeof arg[1] === 'number') {
                var propArray = [];
                vendors.forEach(function(vendor) {
                    propArray.push(toCamelCase(vendor + 'transition-duration'));
                });
                var transitionDuration = getSupportedProp(propArray);
            }
            if (typeof arg[2] === 'string') {
                var propArray = [];
                vendors.forEach(function(vendor) {
                    propArray.push(toCamelCase(vendor + 'transition-timing-function'));
                });
                var transitionTimingFunction = getSupportedProp(propArray);
            }
            var propArray = [];
            vendors.forEach(function(vendor) {
                propArray.push(toCamelCase(vendor + 'transition-property'));
            });
            var transitionProperty = getSupportedProp(propArray);

            Array.prototype.forEach.call(elems, function(elem, index) {
                elem.style[transitionProperty] = '';
                var count = 0;
                for (key in arg[0]) {
                    if (key.indexOf('background') > -1) {
                        key = 'background';
                    }
                    if (key.indexOf('border') > -1) {
                        key = 'border';
                    }
                    if (key.indexOf('fill') > -1) {
                        key = 'fill';
                    }
                    if (key.indexOf('flex') > -1) {
                        key = 'flex';
                    }
                    if (key.indexOf('font') > -1) {
                        key = 'font';
                    }
                    if (key.indexOf('margin') > -1) {
                        key = 'margin';
                    }
                    if (key.indexOf('motion') > -1) {
                        key = 'motion';
                    }
                    if (key.indexOf('outline') > -1) {
                        key = 'outline';
                    }
                    if (key.indexOf('padding') > -1) {
                        key = 'padding';
                    }
                    if (key.indexOf('stroke') > -1) {
                        key = 'stroke';
                    }
                    if (key.indexOf('text') > -1) {
                        key = 'text';
                    }

                    if (count !== 0) {
                        elem.style[transitionProperty] += ',' + key;
                    } else {
                        elem.style[transitionProperty] += key;
                    }
                    count++;
                }
                if (typeof arg[1] === 'number') {
                    elem.style[transitionDuration] = arg[1] + 'ms';
                }
                if (typeof arg[2] === 'string') {
                    elem.style[transitionTimingFunction] = arg[2];
                }
            });

            var propArray = [],
                properties = [];

            Array.prototype.forEach.call(elems, function(elem, index) {
                for (key in arg[0]) {
                    propArray = [];
                    vendors.forEach(function(vendor) {
                        propArray.push(toCamelCase(vendor + key));
                    });
                    properties.push({
                        prop: getSupportedProp(propArray),
                        value: arg[0][key]
                    });
                }
            });

            var that = this;
            Array.prototype.forEach.call(elems, function(elem, index) {
                properties.forEach(function(property) {
                    var style = window.getComputedStyle(elem);
                    elem.style[property.prop] = style.getPropertyValue(property.prop);
                    setTimeout(function() {
                        elem.style[property.prop] = property.value;
                    }, 10);
                });
            });
            setTimeout(function() {
                if (typeof arg[2] === 'function') {
                    arg[2].call(that.js);
                } else if (typeof arg[3] === 'function') {
                    arg[3].call(that.js);
                }
            }, arg[1]);
        }
        return this;
    }

    //append to element
    //arguments: tobeAppended
    //-----------string , DOM--------------------
    function append() {
        var arg = arguments;
        Array.prototype.forEach.call(elems, function(elem, index) {
            if (typeof arg[0] === 'string') {
                elem.innerHTML += arg[0];
            } else {
                elem.appendChild(arg[0]);
            }
        });
        return this;
    }

    //get or set attribute
    //arguments: attributeName , value
    //--------------string-------string-----------
    function attr() {
        var arg = arguments;
        if (arg.length > 1) {
            Array.prototype.forEach.call(elems, function(elem, index) {
                elem.setAttribute(arg[0],arg[1]);
            });
        } else {
            var elem = elems[0];
            return elem.getAttribute(arg[0]);
        }
        return this;
    }

    //get the closest ancestor with the given query
    //arguments: selector
    //----------- string -------------
    function closest() {
        var arg = arguments;
        elem = elems[0];
        var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
        while (elem && elem.tagName.toLowerCase() !== 'html') {
            if (matchesSelector.call(elem, arg[0])) {
                break;
            }
            elem = elem.parentNode;
        }
        return (elem.tagName.toLowerCase() == 'html') ? null : window.EasyScript(elem);
    };

    //set or get a css property
    //arguments: propertiesAndValues
    //---------------object-------------
    function css() {
        var arg = arguments;
        var vendors = [
            '-webkit-',
            '-o-',
            '-moz-',
            '-ms-',
            ''
        ];
        function getSupportedProp(proparray) {
            var root = document.documentElement;
            for (var i = 0; i < proparray.length; i++) {
                if (proparray[i] in root.style) {
                    return proparray[i];
                }
            }
        }

        function toCamelCase(str) {
            return str.replace(/(\-[a-z])/g, function($1) {
                return $1.toUpperCase().replace('-', '');
            });
        }
        if (arg.length < 1) {
            window.EasyScript.throwError('SyntaxError: no arguments given');
            return undefined;
        } else if(typeof arg[0] === 'string' && arg.length === 1){
            return window.getComputedStyle(elems[0]).getPropertyValue(arg[0]);
        } else if(typeof arg[0] === 'string' && typeof arg[1] === 'string' && arg.length === 2){
            var propArray = [],
                properties;
            Array.prototype.forEach.call(elems, function(elem, index) {
                propArray = [];
                vendors.forEach(function(vendor) {
                    propArray.push(toCamelCase(vendor + arg[0]));
                });
                properties={
                    prop: getSupportedProp(propArray),
                    value: arg[1]
                };
            });
            Array.prototype.forEach.call(elems, function(elem, index) {
                var style = window.getComputedStyle(elem);
                elem.style[arg[0]] = style.getPropertyValue(properties.prop);
                setTimeout(function() {
                    elem.style[properties.prop] = properties.value;
                }, 10);
            });
            return this;
        } else {
            var propArray = [],
                properties = [];

            Array.prototype.forEach.call(elems, function(elem, index) {
                for (key in arg[0]) {
                    propArray = [];
                    vendors.forEach(function(vendor) {
                        propArray.push(toCamelCase(vendor + key));
                    });
                    properties.push({
                        prop: getSupportedProp(propArray),
                        value: arg[0][key]
                    });
                }
            });

            var that = this;
            Array.prototype.forEach.call(elems, function(elem, index) {
                properties.forEach(function(property) {
                    var style = window.getComputedStyle(elem);
                    elem.style[property.prop] = style.getPropertyValue(property.prop);
                    setTimeout(function() {
                        elem.style[property.prop] = property.value;
                    }, 10);
                });
            });
        }
        return this;
    }
    
    //get or set the value of the data attribute
    //arguments: dataAttributeName , dataAttributeValue
    //--------------string----------------any-----------------
    function data(){
        var arg = arguments;
        if (arg.length > 1) {
            Array.prototype.forEach.call(elems, function(elem, index) {
                elem.setAttribute('data-'+arg[0],JSON.stringify(arg[1]));
            });
        } else {
            var elem = elems[0];
            try {
                JSON.parse(elem.getAttribute('data-'+arg[0]));
            } catch (e) {
                return elem.getAttribute('data-'+arg[0]);
            }
            return JSON.parse(elem.getAttribute('data-'+arg[0]));
        }
        return this;
    } 

    //iterate over elements
    //arguments: callback(element,value)
    //-----------------function------------------
    function each() {
        var arg = arguments;
        Array.prototype.forEach.call(elems, function(elem, index) {
            arg[0].apply(elem, [elem, index]);
        });
    }
    
    //find the selector descendent to the selected element
    //arguments: selector
    //-----------selector----------------
    function find(){
        var arg=arguments;
        return E(elems[0].querySelector(arg[0]));
    } 
    
    //check if element has the selected element
    //arguments: selector
    //-----------selector-------------
    function has(){
        var arg=arguments,
            elem=elems[0],
            child=E(arg[0]).js[0];
        var node = child.parentNode;
        while (node != null) {
            if (node == elem) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    
    //check if element has the given class
    //arguments: class
    //-----------string-------------
    function hasClass(){
        var arg=arguments,
            elem=elems[0];
        if(arg.length>0){
            return (" " + elem.className + " " ).indexOf( " "+arg[0]+" " ) > -1;
        }
        return undefined;
    }

    //get the height of an element
    //arguments: value or includeBorder
    //----------number------boolean---------------
    function height() {
        var arg = arguments;
        if (arg.length === 0) {
            return elems[0].clientHeight;
        } else if (typeof arg[0] === 'boolean') {
            return elems[0].offsetHeight;
        } else if (typeof arg[0] === 'number') {
            Array.prototype.forEach.call(elems, function(elem, index) {
                elem.style.height = arg[0] + 'px';
            });
            return this;
        }
    }

    //hide element
    //arguments: delay
    //----------integer------------
    function hide() {
        var arg = arguments;
        if (arg.length === 0) {
            Array.prototype.forEach.call(elems, function(elem, index) {
                elem.style.display = 'none';
            });
        } else {
            setTimeout(function() {
                Array.prototype.forEach.call(elems, function(elem, index) {
                    elem.style.display = 'none';
                });
            }, arg[0]);
        }
        return this;
    }

    //get or set the the html of the element
    //arguments: html
    //----------string---------------
    function html() {
        var arg = arguments,
            elem = elems[0];
        if (arg.length === 0) {
            return elem.innerHTML;
        } else {
            elem.innerHTML = arg[0];
            return this;
        }
    }
    
    //insert string at the carret position
    //arguments: string
    //-----------string------------
    function insertAtCaret() {
        var arg=arguments
        var text=arg[0];
        var txtarea = elems[0];
        var scrollPos = txtarea.scrollTop;
        var strPos = 0;
        var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
            "ff" : (document.selection ? "ie" : false ) );
        if (br == "ie") { 
            txtarea.focus();
            var range = document.selection.createRange();
            range.moveStart ('character', -txtarea.value.length);
            strPos = range.text.length;
        }
        else if (br == "ff") strPos = txtarea.selectionStart;

        var front = (txtarea.value).substring(0,strPos);  
        var back = (txtarea.value).substring(strPos,txtarea.value.length); 
        txtarea.value=front+text+back;
        strPos = strPos + text.length;
        if (br == "ie") { 
            txtarea.focus();
            var range = document.selection.createRange();
            range.moveStart ('character', -txtarea.value.length);
            range.moveStart ('character', strPos);
            range.moveEnd ('character', 0);
            range.select();
        }
        else if (br == "ff") {
            txtarea.selectionStart = strPos;
            txtarea.selectionEnd = strPos;
            txtarea.focus();
        }
        txtarea.scrollTop = scrollPos;
        return this;
    }
    
    //check if element is the same as the selector
    //arguments: selector
    //-----------selector------------
    function is(){
        var arg=arguments,
            elem=elems[0];
        if(arg.length>0){
            if(arg[0]===':checked'){
                return elem.checked;
            }
            if(arg[0]===':disabled'){
                return elem.disabled;
            }
            if(arg[0]===':selected'){
                return elem.selected;
            }
            if(arg[0]===':empty'){
                return elem.value==='';
            }
            return elem===E(arg[0]).js[0];
        }
        return undefined;
    }
    
    //check if the element is loaded or load data into the element
    //arguments: callback or url , callback
    //-----------function--string--function-----
    function load(){
        var arg=arguments,
            elem=elems[0];
        if(arg.length>0){
            if(typeof arg[0]==='function'){
                elem.onload=arg[0];
            }
            else if(typeof arg[0]==='string'){
                req = new XMLHttpRequest();
                req.open("GET", arg[0], true);
                req.send(null);
                req.onreadystatechange = function() {
                    if (req.readyState == req.DONE) {
                        var response = req.responseText;
                        if (req.status == 200) {
                            elem.innerHTML=response;
                            var src=E(elem).js[0].querySelector('script').getAttribute('src');
                            E(elem).js[0].querySelector('script').parentNode.removeChild(E(elem).js[0].querySelector('script'));
                            var script = document.createElement('script');
                            script.type = 'text/javascript';
                            script.src = src;
                            script.onreadystatechange = function(){
                                if(typeof arg[1]!=='undefined'){
                                    arg[1]();
                                }
                            };
                            script.onload = function(){
                                if(typeof arg[1]!=='undefined'){
                                    arg[1]();
                                }
                            };
                            elem.appendChild(script);
                        } else if (req.status == 400) {
                            window.EasyScript.throwError('Something went wrong!');
                        }
                    }
                }
            }
        }
        return this;
    }

    //get the next element
    //arguments: selector
    //------------string----------
    function next() {
        var arg = arguments,
            elem = elems[0],
            currentElement = elem.nextElementSibling;
        if (arg.length > 0) {
            var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
            while (!matchesSelector.call(currentElement, arg[0]) && currentElement !== null) {
                currentElement = currentElement.nextElementSibling;
            }
        }
        if (currentElement === null) {
            window.EasyScript.throwError('element not found');
            return null;
        } else {
            return window.EasyScript(currentElement);
        }
    }

    //get all the elements after
    //arguments: selector
    //------------string----------
    function nextAll() {
        var arg = arguments,
            elem = elems[0],
            currentElement = elem.nextElementSibling,
            output = [];
        if (arg.length > 0) {
            var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
            while (currentElement !== null) {
                if (matchesSelector.call(currentElement, arg[0])) {
                    output.push(currentElement);
                }
                currentElement = currentElement.nextElementSibling;
            }
        } else {
            while (currentElement !== null) {
                output.push(currentElement);
                currentElement = currentElement.nextElementSibling;
            }
        }
        if (output.length < 1) {
            window.EasyScript.throwError('element not found');
            return null;
        } else {
            return window.EasyScript(output);
        }
    }

    //remove event listener
    //arguments: event , handler(event)
    //----------string-----function---------
    function off() {
        var arg = arguments;
        if(arg.length===0){
            Array.prototype.forEach.call(elems, function(elem, index) {
                if(typeof elem.handlers!=='undefined'){
                    elem.handlers.forEach(function(obj,i){
                        elem.removeEventListener(obj.event,obj.handler);
                    });
                    elem.handlers=[];
                }
            });
        }
        else if (arg.length ===1 && typeof arg[0]==='string') {
            Array.prototype.forEach.call(elems, function(elem, index) {
                var handler=null;
                if(typeof elem.handlers==='undefined'){
                    window.EasyScript.throwError('The selected event is not attached.');
                    return undefined;
                }
                elem.handlers.forEach(function(obj,i){
                    if(obj.event===arg[0]){
                        handler=obj.handler;
                        elem.handlers.splice(i,1);
                    }
                });
                if(handler===null){
                    window.EasyScript.throwError('The selected event is not attached.');
                    return undefined;
                }
                elem.removeEventListener(arg[0],handler);
            });
        } else if (arg.length === 2 && typeof arg[0]==='string' && typeof arg[1]==='function') {
            Array.prototype.forEach.call(elems, function(elem, index) {
                var foundHandler=false;
                elem.handlers.forEach(function(obj,i){
                    if(obj.event===arg[0] && obj.handler.toString()===arg[1].toString()){
                        elem.handlers.splice(i,1);
                        foundHandler=true;
                    }
                });
                if(foundHandler){
                    elem.removeEventListener(arg[0], arg[1]);
                }
                else{
                    window.EasyScript.throwError('The selected event is not attached.');
                    return undefined;
                }
            });
        } else if (arg.length === 2 && typeof arg[0]==='string' && typeof arg[1]==='string') {
            Array.prototype.forEach.call(elems, function(elem, index) {
                var foundHandler=false,
                    handler;
                elem.handlers.forEach(function(obj,i){
                    if(obj.event===arg[0] && obj.attachedTo===arg[1]){
                        handler=obj.handler;
                        elem.handlers.splice(i,1);
                        foundHandler=true;
                    }
                });
                if(foundHandler){
                    elem.removeEventListener(arg[0], handler);
                }
                else{
                    window.EasyScript.throwError('The selected event is not attached.');
                    return undefined;
                }
            });
        } else {
            window.EasyScript.throwError('SyntaxError: invalid argument');
            return undefined;
        }
        return this;
    };

    //get the offset of an element
    //arguments: relativeToThis
    //-------------selector--------------
    function offset() {
        var arg = arguments,
            elem = elems[0];
        if (arg.length === 0) {
            var x = 0;
            var y = 0;
            while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
                x += elem.offsetLeft - elem.scrollLeft;
                y += elem.offsetTop - elem.scrollTop;
                elem = elem.offsetParent;
            }
            return {
                top: y,
                left: x
            };
        } else {
            var relativeTo = E(arg[0]).js[0];
            if (relativeTo.contains(elem) && relativeTo !== elem) {
                return {
                    top: E(elem).offset().top - E(relativeTo).offset().top,
                    left: E(elem).offset().left - E(relativeTo).offset().left
                }
            } else {
                window.EasyScript.throwError('Illegal Selector: the "relative" element is not an ancestor of the selected element or they are the same.');
                return undefined;
            }
        }
    }

    //add event listener
    //arguments: event , targetSelector, callback(event)
    //----------string-------string--------function---------
    function on() {
        var arg = arguments;
        if (arg.length < 2) {
            return false;
        } else if (arg.length === 2) {
            Array.prototype.forEach.call(elems, function(elem, index) {
                if(typeof elem.handlers==='undefined'){
                    elem.handlers=[];
                }
                elem.handlers.push({
                    event:arg[0],
                    handler:arg[1],
                    attachedTo:''
                });
                elem.addEventListener(arg[0], arg[1]);
            });
        } else {
            Array.prototype.forEach.call(elems, function(elem, index) {
                if(typeof elem.handlers==='undefined'){
                    elem.handlers=[];
                }
                elem.handlers.push({
                    event:arg[0],
                    handler:function(event) {
                        var target = window.EasyScript(event.target).closest(arg[1]);
                        if (target === null) return false;
                        arg[2].call(target.js[0], event);
                    },
                    attachedTo:arg[1]
                });
                elem.addEventListener(arg[0], elem.handlers[elem.handlers.length-1].handler,true);
            });
        }
        return this;
    };

    //get the parent of the element
    //arguments: selector
    //------------string---------------
    function parent() {
        var arg = arguments,
            elem = elems[0];
        if (arg.length > 0) {
            var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
            if (matchesSelector.call(elem, arg[0])) {
                return window.EasyScript(elem.parentNode);
            } else {
                return false;
            }
        } else {
            return window.EasyScript(elem.parentNode);
        }
    }

    //prepend to element
    //arguments: tobePrepended
    //-----------string , DOM--------------------
    function prepend() {
        var arg = arguments;
        Array.prototype.forEach.call(elems, function(elem, index) {
            if (typeof arg[0] === 'string') {
                elem.innerHTML = arg[0] + elem.innerHTML;
            } else if (elem.childNodes.length > 0) {
                elem.insertBefore(arg[0], elem.firstChild);
            } else {
                elem.appendChild(arg[0]);
            }
        });
        return this;
    }

    //get the previous element
    //arguments: selector
    //------------string----------
    function prev() {
        var arg = arguments,
            elem = elems[0],
            currentElement = elem.previousElementSibling;
        if (arg.length > 0) {
            var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
            while (!matchesSelector.call(currentElement, arg[0]) && currentElement !== null) {
                currentElement = currentElement.previousElementSibling;
            }
        }
        if (currentElement === null) {
            window.EasyScript.throwError('element not found');
            return null;
        } else {
            return window.EasyScript(currentElement);
        }
    }

    //get all the elements before
    //arguments: selector
    //------------string----------
    function prevAll() {
        var arg = arguments,
            elem = elems[0],
            currentElement = elem.previousElementSibling,
            output = [];
        if (arg.length > 0) {
            var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
            while (currentElement !== null) {
                if (matchesSelector.call(currentElement, arg[0])) {
                    output.push(currentElement);
                }
                currentElement = currentElement.previousElementSibling;
            }
        } else {
            while (currentElement !== null) {
                output.push(currentElement);
                currentElement = currentElement.previousElementSibling;
            }
        }
        if (output.length < 1) {
            window.EasyScript.throwError('element not found');
            return null;
        } else {
            return window.EasyScript(output);
        }
    }

    //get or set property value
    //arguments: property , value
    //------------string-----any------
    function prop() {
        var arg = arguments;
        if (arg.length > 1) {
            Array.prototype.forEach.call(elems, function(elem, index) {
                elem[arg[0]] = arg[1];
            });
        } else if (arg.length === 1) {
            return elems[0][arg[0]];
        } else {
            window.EasyScript.throwError('Syntax error: please specify a property as an argument');
            return undefined;
        }
        return this;
    }

    //remove class from the element
    //arguments: className
    //------------string--------------
    function removeClass() {
        var arg = arguments;
        Array.prototype.forEach.call(elems, function(elem, index) {
            var classArray = arg[0].split(' ');
            classArray.forEach(function(currentClass, index) {
                if (elem.className.indexOf(currentClass) > -1) {
                    elem.className = elem.className.replace(currentClass, '');
                }
            });
        });
        return this;
    }

    //replace class of the element
    //arguments: tobeReplacedClassName, replacementClassName
    //------------------string----------------string-----------------
    function replaceClass() {
        var arg = arguments;
        Array.prototype.forEach.call(elems, function(elem, index) {
            var regex = new RegExp(arg[0], 'g');
            elem.className = elem.className.replace(regex, arg[1]);
        });
        return this;
    }

    //get or animate the scroll position
    //arguments: direction , value , duration
    //------------string-----number---number-----------
    function scroll() {
        var arg = arguments,
            elem = elems[0];
        if (arg.length === 0) {
            return {
                x: elem.scrollLeft,
                y: elem.scrollTop
            }
        } else if (arg.length === 1) {
            if (typeof arg[0] === 'string') {
                if (arg[0].toLowerCase() === 'x' || arg[0].toLowerCase() === 'left') {
                    return elem.scrollLeft;
                } else if (arg[0].toLowerCase() === 'y' || arg[0].toLowerCase() === 'top') {
                    return elem.scrollTop;
                } else {
                    return undefined;
                }
            } else {
                window.EasyScript.throwError('SyntaxError: Invalid argument');
            }
        } else if (arg.length === 2) {
            if (typeof arg[0] !== 'string' || typeof arg[1] !== 'number') {
                window.EasyScript.throwError('SyntaxError: Invalid argument');
            } else {
                if (arg[0].toLowerCase() === 'x' || arg[0].toLowerCase() === 'left') {
                    elem.scrollLeft = arg[1];
                } else if (arg[0].toLowerCase() === 'y' || arg[0].toLowerCase() === 'top') {
                    elem.scrollTop = arg[1];
                } else {
                    return undefined;
                }
            }
        } else {
            if (typeof arg[0] !== 'string' || typeof arg[1] !== 'number' || typeof arg[2] !== 'number') {
                window.EasyScript.throwError('SyntaxError: Invalid argument');
            } else {
                if (arg[0].toLowerCase() === 'x' || arg[0].toLowerCase() === 'left') {
                    if (arg[2] <= 0) {
                        elem.scrollLeft = arg[1];
                    } else {
                        scrollTo(arg[1], arg[2], 'scrollLeft');
                    }
                } else if (arg[0].toLowerCase() === 'y' || arg[0].toLowerCase() === 'top') {
                    if (arg[2] <= 0) {
                        elem.scrollTop = arg[1];
                    } else {
                        scrollTo(arg[1], arg[2], 'scrollTop');
                    }
                } else {
                    return undefined;
                }
            }
        }

        function scrollTo(to, duration, direction) {
            if (duration <= 0) return;
            var difference = to - elem[direction];
            var perTick = difference / duration * 10;

            setTimeout(function() {
                elem[direction] = elem[direction] + perTick;
                if (elem[direction] === to) return;
                scrollTo(to, duration - 10, direction);
            }, 10);
        }
        return this;
    }

    //show element
    //arguments: delay , display
    //----------integer--string-----------
    function show() {
        var arg = arguments;
        switch (typeof arg[0]) {
            case 'undefined':
            case 'string':
                Array.prototype.forEach.call(elems, function(elem, index) {
                    elem.style.display = arg[0] || 'initial';
                });
                break;
            case 'number':
                setTimeout(function() {
                    Array.prototype.forEach.call(elems, function(elem, index) {
                        elem.style.display = arg[1] || 'initial';
                    });
                }, arg[0]);
                break;
            default:
                window.EasyScript.throwError('syntaxError: invalid argument');
                return undefined;
        }
        return this;
    }

    //get the siblings that match the selector
    //arguments: selector
    //------------string--------------
    function siblings() {
        var arg = arguments,
            elem = elems[0],
            output = [];
        if (arg.length > 0) {
            var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
            elem.parentNode.childNodes.forEach(function(v, i) {
                if (v !== elem && v.nodeType === 1 && matchesSelector.call(v, arg[0])) {
                    output.push(v);
                }
            });
        } else {
            elem.parentNode.childNodes.forEach(function(v, i) {
                if (v !== elem && v.nodeType === 1) {
                    output.push(v);
                }
            });
        }
        return window.EasyScript(output);
    }

    //get or set the the text of the element
    //arguments: text
    //----------string---------------
    function text() {
        var arg = arguments,
            elem = elems[0];
        if (arg.length === 0) {
            return elem.innerText;
        } else {
            elem.innerText = arg[0];
            return this;
        }
    }

    //to trigger an event on the selected element
    //arguments: eventName
    //------------string-----------------
    function trigger() {
        var arg = arguments,
            event,
            elem = elems[0];
        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent(arg[0], true, true);
        } else {
            event = document.createEventObject();
            event.eventType = arg[0];
        }

        event.eventName = arg[0];

        if (document.createEvent) {
            elem.dispatchEvent(event);
        } else {
            elem.fireEvent("on" + event.eventType, event);
        }
        return this;
    }

    //get or set the value of the selected element
    //arguments: value
    //-----------string--------------------
    function val() {
        var arg = arguments,
            elem = elems[0];
        if (arg.length > 0) {
            elem.value = arg[0];
            return this;
        } else {
            return elem.value;
        }
    }

    //get the width of an element
    //arguments: value or includeBorder
    //----------number------boolean---------------
    function width() {
        var arg = arguments;
        if (arg.length === 0) {
            return elems[0].clientWidth;
        } else if (typeof arg[0] === 'boolean') {
            return elems[0].offsetWidth;
        } else if (typeof arg[0] === 'number') {
            Array.prototype.forEach.call(elems, function(elem, index) {
                elem.style.width = arg[0] + 'px';
            });
            return this;
        }
    }

    //return the functions
    return {
        addClass: addClass,
        animate: animate,
        append: append,
        attr: attr,
        closest: closest,
        css:css,
        data:data,
        each: each,
        has:has,
        hasClass:hasClass,
        height: height,
        hide: hide,
        html: html,
        insertAtCaret:insertAtCaret,
        is:is,
        js: elems,
        length: elems.length || this.length,
        load:load,
        next: next,
        nextAll: nextAll,
        off: off,
        offset: offset,
        on: on,
        parent: parent,
        prepend: prepend,
        prev: prev,
        prevAll: prevAll,
        prop: prop,
        removeClass: removeClass,
        replaceClass: replaceClass,
        scroll: scroll,
        scrollHeight: (elems.length>0) ? elems[0].scrollHeight : undefined,
        scrollWidth: (elems.length>0) ? elems[0].scrollWidth : undefined,
        show: show,
        siblings: siblings,
        text: text,
        trigger: trigger,
        val: val,
        width: width
    }
};

//ajax call
//arguments: configuration
//--------------object--------------
window.EasyScript.ajax = function() {
    var arg = arguments,
        config = {
            async: arg[0].async || true,
            beforeSend: arg[0].beforeSend || function() {},
            complete: arg[0].complete || function() {},
            contentType: arg[0].contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
            data: arg[0].data || '',
            dataType: arg[0].dataType || 'text',
            stringify: arg[0].stringify || false,
            error: arg[0].error || function() {},
            fail: arg[0].fail || function() {},
            headers: arg[0].headers || {},
            method: arg[0].method || 'POST',
            success: arg[0].success || function() {},
            timeout: arg[0].timeout || 0,
            url: arg[0].url || '/'
        };

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            var response = xmlhttp.responseText;
            if (config.dataType === 'json') {
                response = JSON.parse(xmlhttp.responseText);
            }
            config.complete(response);
            if (xmlhttp.status == 200) {
                config.success(response);
            } else if (xmlhttp.status == 400) {
                config.error(xmlhttp, xmlhttp.status, xmlhttp.responseText);
            } else {
                config.fail(xmlhttp, xmlhttp.status, xmlhttp.responseText);
            }
        }
    };

    if (config.stringify && config.method === 'POST') {
        var data = '';
        for (key in config.data) {
            data += String(key) + '=' + JSON.stringify(config.data[key]) + '&';
        }
        config.data = data;
    } else {
        var data = '';
        for (key in config.data) {
            data += String(key) + '=' + config.data[key] + '&';
        }
        config.data = data;
    }

    if (config.method === 'POST') {
        xmlhttp.open(config.method, config.url, config.async);
    } else {
        xmlhttp.open(config.method, config.url + '?' + config.data, config.async);
    }
    xmlhttp.responseType = '';
    xmlhttp.timeout = config.timeout;
    xmlhttp.setRequestHeader('Content-Type', config.contentType);
    if (config.headers.length !== undefined) {
        config.headers.forEach(function(key, value) {
            xmlhttp.setRequestHeader(key, value);
        });
    }
    config.beforeSend();
    if (config.method === 'POST') {
        xmlhttp.send(config.data);
    } else {
        xmlhttp.send();
    }
}

//set, get and remove cookies
//arguments: name , data , daysToExpire 
//----------string--any-------number----------
window.EasyScript.cookie=function(){
    var arg=arguments;
    if(arg.length > 1){
        var expires = "";
        if (arg[2]) {
            var date = new Date();
            date.setTime(date.getTime()+(arg[2]*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        document.cookie = arg[0]+"="+JSON.stringify(arg[1])+expires+"; path=/";
    }
    else if(arg.length===1){
        var nameEQ = arg[0] + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length,c.length));
        }
        return null;
    }
}

//iterate over array or object
//arguments: currentInstance , callback(value,index)
//-------------array,object----function----------
window.EasyScript.each = function() {
    var arg = arguments;
    if(Object.prototype.toString.call(arg[0]) === '[object Array]'){
        arg[0].forEach(arg[1]);
    }
    else if(typeof arg[0]==='object'){
        for(key in arg[0]){
            arg[1].apply(arg[0][key], [key, arg[0][key]]);
        }
    }
};

//escape string
//arguments: string
//-----------string------------
window.EasyScript.escapeString = function() {
    var arg = arguments;
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;',
        "\\": '&#x5C;'
    };
    return String(arg[0]).replace(/[&<>"'\/\\]/g, function(s) {
        return entityMap[s];
    });
};

//document ready
//arguments: callback
//-----------function-------------
window.EasyScript.ready = function() {
    var arg = arguments;
    document.addEventListener("DOMContentLoaded", function(event) {
        window.EasyScript.ready.fired=true;
        arg[0]();
        return;
    });
    if(window.EasyScript.ready.fired){
        arg[0]();
    }
}

//replace all occurances
//arguments: targetString , replace , replacement
//-------------string-------string------string-------------
window.EasyScript.replaceAll=function(){
    var arg=arguments;
    if(arg.length===3){
        return arg[0].split(arg[1]).join(arg[2]);
    }
    else{
        window.EasyScript.throwError('SyntaxError: three arguments required');
        return undefined;
    }
} 

//push state
//arguments: multiple scenarios
//-----------------------------------
window.EasyScript.state={
    push:function(){
        var arg=arguments,
            link=((arg[0]==='') ? '/' : arg[0]) || window.location.pathname;
        window.history.pushState({"content":E(E.state.elem).html()},'',link);
    },
    watch:function(){
        var arg=arguments;
        E.state.elem=arg[0];
        window.onpopstate = function(e){
            if(e.state){
                E(arg[0]).html(e.state.content);
                var elem=arg[0];
                var src=E(elem).js[0].querySelector('script').getAttribute('src');
                E(elem).js[0].querySelector('script').parentNode.removeChild(E(elem).js[0].querySelector('script'));
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = src;
                E(elem).js[0].appendChild(script);
            }
        };
    },
    elem:''
}

//get, set or remove localStorage
//arguments: name , value //empty string to remove
//----------string---any------------
window.EasyScript.storage = function() {
    var arg = arguments;
    if (arg.length > 1 && arg[1] !== '') {
        window.localStorage.setItem(arg[0], JSON.stringify(arg[1]));
    } else if (arg.length > 1 && arg[1] === '') {
        window.localStorage.removeItem(arg[0]);
    } else {
        if (window.localStorage.getItem(arg[0]) !== null) {
            return JSON.parse(window.localStorage.getItem(arg[0]));
        } else {
            return null;
        }
    }
}

//throw error
//arguments: text
//-----------string------------
window.EasyScript.throwError = function() {
    var arg = arguments;
    console.error(arg[0]);
};

//trim string
//arguments: string
//-----------string-------------
window.EasyScript.trim = function() {
    var arg = arguments,
        regex = new RegExp(/\s/, 'g');
    return arg[0].replace(regex, '');

}

//unescape string
//arguments: string
//-----------string------------
window.EasyScript.unescapeString = function() {
    var arg = arguments;
    var entityMap = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        '&quot;': '"',
        '&#39;': "'",
        '&#x2F;': "/",
        '&#x5C;': "\\"
    };
    return String(arg[0]).replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;|&#x5C;/gi, function(s) {
        return entityMap[s];
    });
};

//definition of EasyScript
window.E = E = EasyScript = window.EasyScript;