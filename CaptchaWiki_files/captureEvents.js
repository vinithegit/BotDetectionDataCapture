$(document).ready(() => {
	window.localStorage.setItem('usernameTimings', []);
	window.localStorage.setItem('passwordTimings', []);
	var elapsed, now, averageTypingSpeed = 0, numKeyPresses = 0, usernamePreviousTime = new Date().getTime(), passwordPreviousTime = new Date().getTime(), confirmPasswordPreviousTime = new Date().getTime(), emailIDPreviousTime = new Date().getTime();
	var usernameTimings=[], passwordTimings=[], confirmPasswordTimings=[], emailIDTimings=[], mousePositions=[];
	$( '.username' ).keyup( function () {
	    console.log("Key pressed on input");
		now = new Date().getTime();
		elapsed = now - usernamePreviousTime;
		//usernameTimings = window.localStorage.getItem('usernameTimings').split(",") || [];
		usernameTimings.push(elapsed);
		window.localStorage.setItem('usernameTimings', usernameTimings);
		usernamePreviousTime = now;
	} );
	$( '.password' ).keyup( function () {
	    console.log("Key pressed on input");
		now = new Date().getTime();
		elapsed = now - passwordPreviousTime;
		//passwordTimings = window.localStorage.getItem('passwordTimings').split(",") || [];
		passwordTimings.push(elapsed);
		window.localStorage.setItem('passwordTimings', passwordTimings);
		passwordPreviousTime = now;
	} );
	$( '.confirmPassword' ).keyup( function () {
	    console.log("Key pressed on input");
		now = new Date().getTime();
		elapsed = now - confirmPasswordPreviousTime;
		//confirmPasswordTimings = window.localStorage.getItem('confirmPasswordTimings').split(",") || [];
		confirmPasswordTimings.push(elapsed);
		window.localStorage.setItem('confirmPasswordTimings', confirmPasswordTimings);
		confirmPasswordPreviousTime = now;
	} );
	$( '.emailID' ).keyup( function () {
	    console.log("Key pressed on input");
		now = new Date().getTime();
		elapsed = now - emailIDPreviousTime;
		//emailIDTimings = window.localStorage.getItem('emailIDTimings').split(",") || [];
		emailIDTimings.push(elapsed);
		window.localStorage.setItem('emailIDTimings', emailIDTimings);
		emailIDPreviousTime = now;
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
				"usernameTimings" : usernameTimings,
				"passwordTimings" : passwordTimings,
				"confirmPasswordTimings" : confirmPasswordTimings,
				"emailIDTimings" : emailIDTimings,
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
