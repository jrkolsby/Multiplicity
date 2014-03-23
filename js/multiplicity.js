var history = [
		{
			"exp": "3+5",
			"ans": "8"
		},
	],
	appendExp = function(exp) {
		$('input').val($('input').val() + exp);
	}
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
	log = function() {

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
				appendExp($(this).html());
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