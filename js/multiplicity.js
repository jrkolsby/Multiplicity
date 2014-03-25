var history = [],
	historyPos = 0,
	recentVal = "";
	vars = {
		"pi": 3.141592653589,
		"tau":  6.283185307190,
		"e": 2.7182818284590
	},
	insertExp = function(text) {
		//insertExp by Scott Klarr, from http://bit.ly/1dELy4Z
		var txtarea = document.getElementsByTagName("input")[0],
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
	},
	canParse = function(exp) {
		try {
			Parser.parse(exp).evaluate(vars);
			return true;
		} catch(e) {return false}
	}
	assess = function(exp) {
		exp = exp.replace(/\s+/g, "")
				//Scientific notation solution
				.replace(/[-+]?[0-9]*\.?[0-9]*E[-+]?[0-9]*\.?[0-9]*/g, function($0) {
					return '(' + $0 + '))';
				}).replace(/E/g, "*10^(")
				//Coefficient solution, omits possible functions
				.replace(/\d[a-z]|[a-z]\d|\d\(|\)(\d|[a-z])|\)\(/gi, function($0) {
					return $0[0] + '*' + $0[1];
				});

		if (exp.length > 0) {
			if (exp.indexOf("=") > -1) {
				//Is assigning
				var eq = exp.indexOf("="),
					str1 = exp.substring(0,eq),
					str2 = exp.substring(eq+1);
				if (!canParse(str1) && canParse(str2)) {
					//Make variable of str1
					if (str1.match(/\d/) == null) {
						vars[str1] = Parser.parse(str2).evaluate(vars);
						return vars[str1];
					} else { return "<span>variable contains numericals</span>" }
				} else if (!canParse(str2) && canParse(str1)) {
					//Make variable of str2
					if (str1.match(/\d/) == null) {
						vars[str2] = Parser.parse(str1).evaluate(vars);
						return vars[str2];
					} else { return "<span>variable contains numericals</span>" }
				} else {
					//Compare both sides
					try {
						var dif = Math.abs(Parser.parse(str1).evaluate(vars) - Parser.parse(str2).evaluate(vars));
						if (dif < 0.00000001) {	
							return "true";
						} else { return "false" }
					} catch(e) { return "<span>"+e['message']+"</span>" }
				}
			} else {
				try {
					return Parser.parse(exp).evaluate(vars);
				} catch(e) { return "<span>"+e['message']+"</span>" }
			}
		} else { return "<span>null</span>" }
	},
	log = function(exp, ans) {
		var calc = {
			"exp": exp,
			"ans": ans
		};
		history.push(calc);
		historyPos=history.length;
		console.log(history);
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
		} else if (event.keyCode == 38) {
			if (historyPos > 0) {
				if (historyPos == history.length) {
					recentVal = $(this).val();
				}
				historyPos -= 1;
				$(this).val(history[historyPos]['exp']);
			}
		} else if (event.keyCode == 40) {
			if (historyPos < history.length-1) {
				historyPos += 1;
				$(this).val(history[historyPos]['exp']);
			} else if (historyPos == history.length-1) {
				historyPos = history.length;
				$(this).val(recentVal);
			}
		}
	});
	$('#wrap').delegate('.row div', 'contextmenu', function() {
		return false;
	}).delegate('.row div', 'mousedown', function(event) {
		switch (event.which) {
			case 1:
				if ($(this).children('span').length == 0) {
					insertExp($(this).html());
				}
				break;
			case 3:
				//Right click, copy expression
				break;
		}
	}).delegate('.row div', 'mouseup', function() {
		$('input').focus();
	});
});