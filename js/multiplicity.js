var history = [],
	historyPos = 0,
	recentVal = "";
	vars = {
		"pi": 3.141592653589,
		"tau":  6.283185307190,
		"e": 2.7182818284590
	},
	setSelectionRange = function(selectionStart, selectionEnd) {
		//SetSelectionRange by codingspot.com, from http://bit.ly/1pD0dDn
		var input = document.getElementsByTagName("input")[0]
		if (input.setSelectionRange) {
			input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		} else if (input.createTextRange) {
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		}
	},
	setCaretToPos = function(pos) {
		setSelectionRange(pos, pos);
	}
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
		if (history.length > 0) {
			exp = exp.replace(/ans/gi, history[history.length-1]['ans']);
		}
		exp = exp.replace(/\s+/g, "")
				 //Scientific notation
				 .replace(/([-+]?[0-9]*\.?[0-9]*)E([-+]?[0-9]*\.?[0-9]*)/g, "(($1)*10^($2))")
				 //Coefficients
				 .replace(/\d[a-z]|[a-z]\d|\d\(|\)(\d|[a-z])|\)\(/gi, function($0) {
					 return $0[0] + '*' + $0[1];
				 })
				 .replace(/sec\(([^)]+)\)/g, "(1/cos($1))")
				 .replace(/csc\(([^)]+)\)/g, "(1/sin($1))")
				 .replace(/cot\(([^)]+)\)/g, "(1/tan($1))");
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
					if (str2.match(/\d/) == null) {
						vars[str2] = Parser.parse(str1).evaluate(vars);
						return vars[str2];
					} else { return "<span>variable contains numericals</span>" }
				} else {
					try {
						var dif = Math.abs(Parser.parse(str1).evaluate(vars) - Parser.parse(str2).evaluate(vars));
						if (dif < 0.00000001) {	
							return "true";
						} else { return "false" }
					} catch(e) { return "<span>"+e['message']+"</span>" }
				}
			} else {
				try {
					var eval = Parser.parse(exp).evaluate(vars).toString();
					return eval.replace(/e/g, "E"); //Fix javascript's scientific notation
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
		$("<div class='row'><div>"+exp+"</div><div>"+ans+"</div></div>").insertBefore("div.row#new");
		window.scrollTo(0,document.body.scrollHeight);
	}
$(document).ready(function() {
	$('#button.info').click(function() {
		$('#help').addClass('active');
	});
	$('#button.close').click(function() {
		$('#help').removeClass('active');
	});
	
	$('input').focus().keydown(function(event) {
		if (event.keyCode == 13) {
			//Assess and log input
			log(this.value, assess(this.value));
			this.value = "";
		} else if (event.keyCode == 38) {
			if (historyPos > 0) {
				if (historyPos == history.length) {
					recentVal = this.value;
				}
				historyPos -= 1;
				this.value = history[historyPos]['exp'];
			}
		} else if (event.keyCode == 40) {
			if (historyPos < history.length-1) {
				historyPos += 1;
				this.value = history[historyPos]['exp'];
			} else if (historyPos == history.length-1) {
				historyPos = history.length;
				this.value = recentVal;
			}
		} else if (this.value.length == 0) {
			var input = this;
			setTimeout(function() {
				if (input.value.match(/(\/|\*|\+|\-|\=|\%|E)/) !== null) {
					input.value = "ans" + input.value;
				}
			}, 0);
		} else if (event.keyCode !== 8 && event.keyCode !== 46) {
			var input = this;
			setTimeout(function() {
				if (input.value.match(/(sqrt|round|abs|log|sin|cos|tan|sec|csc|cot)(?!\()/) !== null) {
					input.value = input.value.replace(/(sqrt|round|abs|log|sin|cos|tan|sec|csc|cot)(?!\()/, "$1()");
					setCaretToPos(input.value.length-1);
				}

			}, 0);		
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
				//Find a way to copy to clipboard
				break;
		}
	}).delegate('.row div', 'mouseup', function() {
		$('input').focus();
	});
});