var myFirebaseRef = new Firebase("https://bd.firebaseio.com/");
//var current_number = $('.counter').text();
// myFirebaseRef.set({
// 	current_sample_number:current_number
// });


$('.update').click(function() {
	//var count = $('.progress-bar')[0].style.width;
	var number = $('.counter').text();
 	var complete = 153;
 	perscent  = (parseInt(number)/complete)*100;
	$('.progress-bar').css('width',Math.round(perscent)+'%');
	$('.counter').text(parseInt(number)+1);
	console.log(perscent);
	myFirebaseRef.set({
		current_sample_number:parseInt(number)+1
	});
});