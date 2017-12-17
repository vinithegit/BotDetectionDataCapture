$(document).ready(() => {
	var elapsed, now, averageTypingSpeed = 0, numKeyPresses = 0;
	var timings = {}, previousTime = {}, mousePositions = [];
	$.each( [ 'username', 'emailID' ], function ( _, field ) {
		$( '.' + field ).keyup( function () {
			console.log( 'key pressed on ' + field );
			var now = new Date().getTime();
			elapsed = now - (previousTime[field] || now);
			timings[field] = timings[field] || [];
			timings[field].push(elapsed);
			previousTime[field] = now;
		} );
	} );
	$(document).mousemove(function(event) {
		mousePositions.push({x:event.pageX, y:event.pageY});
	});
	$('#human').click(function(){
		$.ajax({
			url: 'http://localhost:4560',
			//This is the data written to the file. We can modify this as we like
			//as long as it is a valid JSON
			data: JSON.stringify({
				"usernameTimings" : timings['username'],
				"emailIDTimings" : timings['emailID'],
				"mousePositions" : mousePositions.slice(-100)
			}),
			contentType: "text/plain",
			type: 'POST',
			jsonCallback: 'callback',
			success: function(data) {
				console.log('success');
				//It might be a good idea to hide the checkbox after clicking so that the same
				//data is not submitted multiple times
				$('#human').hide();
			},
			error: function(xhr, status, error) {
				console.log('Error:' + error.message);
			}
		});
	});
});
