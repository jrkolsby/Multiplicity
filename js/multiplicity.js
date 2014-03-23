var history = [
		{
			"exp": "3+5",
			"ans": "8"
		},
	],
	insertExp = function(text) {

		//By Scott Klarr, from http://bit.ly/1dELy4Z

	    var txtarea = document.getElementsByTagName("input")[0];
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
	},
	assess = function(exp) {
		if (exp.length > 0) {
			if (exp.indexOf("=") > -1) {
				//Is assigning
			} else {
				//Is expression
				var ans = Parser.parse(exp).evaluate();
				console.log(ans);
			}
		} else {
			//No input, reenter last
		}
		return ans;
	},
	log = function(exp, ans) {

	}



$(document).ready(function() {
	$('input').focus().keydown(function(event) {
		if (event.keyCode == 13) {
			//Assess input
			assess($(this).val());
		}
	});

	/*
	console.log(history[0]['ans']);
	console.log(Parser.parse("4+2").evaluate());
	var exp = Parser.parse("x^2");
	console.log(exp.evaluate({"x": 4}));
	*/

	$('.row div').on('contextmenu', function() {
		return false;
	}).mousedown(function(event) {
		switch (event.which) {
			case 1:
				insertExp($(this).html());
				break;
			case 3:
				$('textarea').val($(this).html()).addClass('visible').keyup(function() {
					$(this).removeClass('visible');
					$('input').focus();
				});
				break;
		}
	}).mouseup(function() {
		if ($('textarea').hasClass('visible')) {
			$('textarea').select();
		} else {
			$('input').focus();
		}
	});

});