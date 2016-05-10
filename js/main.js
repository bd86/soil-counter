$('.update').click(function() {
	//var count = $('.progress-bar')[0].style.width;
	var number = $('.counter').text();
 	var complete = 153;
 	perscent  = (parseInt(number)/complete)*100;
	$('.progress-bar').css('width',Math.round(perscent)+'%');
	$('.counter').text(parseInt(number)+1);
	console.log(perscent);
});