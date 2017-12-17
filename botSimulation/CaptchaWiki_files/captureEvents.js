$(document).ready(() => {
	window.localStorage.setItem('usernameTimings', []);
	window.localStorage.setItem('passwordTimings', []);
	var elapsed, now, averageTypingSpeed = 0, numKeyPresses = 0, usernamePreviousTime = new Date().getTime(), passwordPreviousTime = new Date().getTime(), confirmPasswordPreviousTime = new Date().getTime(), emailIDPreviousTime = new Date().getTime();
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
	$(document).click(function(event) {
		mousePositions.push({x:event.pageX, y:event.pageY});
	});
	
	function linearInterpolation(startPoint, endPoint, steps){
		var points = [];
		var deltax = (endPoint.x - startPoint.x)/steps;
		var deltay = (endPoint.y - startPoint.y)/steps;
		for(var x = startPoint.x, y = startPoint.y; x <= endPoint.x, y <= endPoint.y; x += deltax, y += deltay) {
			points.push({x: x, y: y});
		}
		return points;
	}
	
	$('#human').click(function(event){
		$.ajax({
			url: 'http://localhost:4561',
			data: JSON.stringify({
				"usernameTimings" : Array(parseInt(Math.random()*20)).fill(timings['username'][1]),
				"emailIDTimings" : Array(parseInt(Math.random()*20)).fill(timings['emailID'][1]),
				"mousePositions" : linearInterpolation(mousePositions[0], {x:event.pageX, y:event.pageY}, parseInt(Math.random()*100))
			}),
			contentType: "text/plain",
			type: 'POST',
			success: function(data) {
				console.log('success');
				$('#human').hide();
			},
			error: function(xhr, status, error) {
				console.log('Error:' + error.message);
			}
		});
	});
});
