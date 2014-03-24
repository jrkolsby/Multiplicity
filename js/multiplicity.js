var history = [],
	historyIndex = 0,
	vars = {
		"pi": 3.141592653589
	},
	insertExp = function(text) {
		//insertExp by Scott Klarr, from http://bit.ly/1dELy4Z
	    var txtarea = document.getElementsByTagName("input")[0],
	    	scrollPos = txtarea.scrollTop,
	    	strPos = 0;
	    	br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
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
	},
	canParse = function(exp) {
		try {
			Parser.parse(exp).evaluate(vars);
			return true;
		} catch (e) {
			return false;
		}
	}
	assess = function(exp) {
		exp = exp.replace(/(\)\()/g, ")*(") //For multiplying polynomials
				 .replace(/\s+/g, "");
				 
		//Coefficient solution by Jack at http://bit.ly/OPNKkd
		exp = exp.replace(/\d[a-z]|[a-z]\d/i, function($0) {
    		return $0[0] + '*' + $0[1]; 
		});

		console.log(exp);

		if (exp.length > 0) {
			if (exp.indexOf("=") > -1) {
				//Is assigning
				var eq = exp.indexOf("="),
					str1 = exp.substring(0,eq),
					str2 = exp.substring(eq+1);
				if (!canParse(str1) && canParse(str2)) { //If you can't parse str1
					//Assign value to str1
					console.log("1: Bad, 2: Good");
					try {
						vars[str1] = Parser.parse(str2).evaluate(vars);
	    				return vars[str1];
					} catch (e) {
						return e['message'];
					}
				} else if (!canParse(str2) && canParse(str1)) { //If you can't parse str2
					//Assign value to str2
					console.log("1: Good, 2: Bad");
					try {
						vars[str2] = Parser.parse(str1).evaluate(vars);
	    				return vars[str2];
					} catch (e) {
						return e['message'];
					}
				} else if (canParse(str1) && canParse(str2)) {
					console.log("Both good");
					//Compare both sides
					try {
						var dif = Math.abs(Parser.parse(str1).evaluate(vars) - Parser.parse(str2).evaluate(vars));
						if (dif < 0.0000000001) {
							return "true";
						} else {
							return "false"
						}
					} catch (e) {
						return e['message'];
					}
				} else {
					console.log("both bad");
					return "error: syntax";
				}
			} else {
				try {
					return Parser.parse(exp).evaluate(vars);
				} catch (e) {
					return e['message'];
				}
			}
		} else {
			//No input, reenter last
			return "error: null";
		}
	},
	log = function(exp, ans) {
		var calc = {
			"exp": exp,
			"ans": ans
		};
		history.push(calc);
		$("<div class='row'><div>"+exp+"</div><div>"+ans+"</div></div>").insertBefore("div.row#new");
		window.scrollTo(0,document.body.scrollHeight);
	}



$(document).ready(function() {
	$('input').focus().keydown(function(event) {
		if (event.keyCode == 13) {
			//Assess and log input
			var value = $(this).val();
			log(value, assess(value));
			$(this).val("");
		}
	});

	$('#wrap').delegate('.row div', 'contextmenu', function() {
		return false;
	}).delegate('.row div', 'mousedown', function(event) {
		switch (event.which) {
			case 1:
				//Left click, insert expression
				insertExp($(this).html());
				break;
			case 3:
				//Right click, copy expression
				break;
		}
	}).delegate('.row div', 'mouseup', function() {
		$('input').focus();
	});

	/*
	console.log(history[0]['ans']);
	console.log(Parser.parse("4+2").evaluate());
	var exp = Parser.parse("x^2");
	console.log(exp.evaluate({"x": 4}));
	var exp = Parser.parse("x+y");
	console.log(exp.evaluate({"x": 4,"y": 2}));
	*/

});