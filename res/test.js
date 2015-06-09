
function send_data() {
	console.log("in send_data()");
	var firstname = document.forms['form1']['fname'].value;
	var lastname = document.forms['form1']['lname'].value;
	//console.log(firstname);
	//console.log(lastname);
	
	var reqdata = {
		"firstname":firstname,
		"lastname":lastname
	};
	//Do stingify here

	$.get( "/testgetform",
			reqdata,
			function(data, status) {
				console.log(data);
				//var respstring = JSON.parse(data);
				//console.log(respstring);
				alert("GET Data: " + data.firstname + "\nStatus: " + status);
			}
	);

	$.post( "/testpostform",
			reqdata,
			function(data, status) {
				console.log(data);
				//var respstring = JSON.parse(data);
				//console.log(respstring);
				alert("POST Data: " + data.firstname + "\nStatus: " + status);
			}
	);
	
	return;
}