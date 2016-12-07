$(document).ready(function () {


	//ping

		var connexion = $.ajax({
		url: 'http://greenvelvet.alwaysdata.net/kwick/api/ping',
		dataType : 'jsonp'
		});

		connexion.done( function(data) {
			console.log(data);

			var user = {
				ready : data['result']['ready'],
				
			}

			});
	


	//Inscription

    $("#submit-inc").click(function (evt) {
    	evt.preventDefault();

    	var user_name = $('#Pseudo').val();
    	var password = $('#Password').val();

		var inscription = $.ajax({
		url: 'http://greenvelvet.alwaysdata.net/kwick/api/signup/' + user_name + '/' + password,
		dataType : 'jsonp'
		});

		inscription.done( function(data) {
			console.log(data);

			var user = {
				id : data['result']['id'],
				token : data['result']['token']
			}

			var json_data = JSON.stringify(user);
			localStorage.setItem('user', json_data);

			if(data['result']['status'] === 'done') {
				window.location = 'view/mes.html';
				} else {
					$("#error-inscription").append('<p class="error">Déja inscrit</p>');
				};
		})

  		
	});

    //Connexion

	$("#submit-connect").click(function (evt) {
    	evt.preventDefault();

    	var user_connect = $('#pseudo_connect').val();
    	var password_connect = $('#password_connect').val();

		var connexion = $.ajax({
		url: 'http://greenvelvet.alwaysdata.net/kwick/api/login/'+ user_connect +'/'+ password_connect,
		dataType : 'jsonp'
		});

		connexion.done( function(data) {
			console.log(data);

			var user = {
				id : data['result']['id'],
				token : data['result']['token']
			}

			var json_data = JSON.stringify(user);
			localStorage.setItem('user', json_data);

			if(data['result']['status'] === 'done') {
				window.location = 'view/mes.html';
				} else {
					$("#error").append('<p class="error">Error Connexion</p>');
				};
		});
	});


	// Deconnexion

   $("#deconnexion").click(function (evt) {
    	evt.preventDefault();

    	 	var user_data = JSON.parse(localStorage.getItem('user')),
            user_id = user_data.id,
            token = user_data.token;
		
		var deconnexion = $.ajax({
		  		 url: 'http://greenvelvet.alwaysdata.net/kwick/api/logout/'+ token + '/'+ user_id,
		  		 dataType: 'jsonp'
		});

		deconnexion.done( function(data) {
		localStorage.clear();
		window.location = '../index.html';  
		});
		
	});

   //envoyer de message

 $("#submit-mgs").click(function (evt) {
    	evt.preventDefault();

	var user_data = JSON.parse(localStorage.getItem('user'));
	var user_id = user_data.id,
	 	token = user_data.token,
	 	message = encodeURIComponent($('#msg').val());

	console.log(localStorage.getItem('user'));
		var msgi = $.ajax({
			url: 'http://greenvelvet.alwaysdata.net/kwick/api/say/'+ token +'/'+ user_id +'/'+ message ,
			dataType : 'jsonp'
		});


	msgi.done( function(data) {
	console.log(data);

		var user = {
		id : data['result']['id'],
		token : data['result']['token'],
		message : data ['result']['message'],
	}

	var json_data = JSON.stringify(message);
	$('#msg').val('')[0].focus();
	
	})

});

// affichage message
var list_message = function(){

    var user_data = JSON.parse(localStorage.getItem('user'));
    var user_id = user_data.id,
        token = user_data.token,
    	message = encodeURIComponent($('#msg').val());


    var list = $.ajax({
        url: 'http://greenvelvet.alwaysdata.net/kwick/api/talk/list/' + token + '/0',
        dataType: 'jsonp'
    });

    list.done(function(data) {
        if(data.result.status ==="done"){
            $('#tchat-content').empty();

     		
            var talk = data['result']['talk'];
			talk = talk.slice().reverse();
                for (var i = 0; i < talk.length; i++) {
                var date = $.format.date(new Date(talk[i].timestamp*1000), "dd MMMM yyyy \à H:mm:ss");
                $("#tchat-content").append('<p class="chat-deco"><span class="chat-text-deco"> ' + talk[i].user_name + ' :  </span> <span class="message-deco">'+  talk[i].content +'</span><span class="date"><i class="fa fa-clock-o"></i> '+ date +'</span></p>');

            };
		}
    }); 
};

// Afichage Membre
var list_users = function() { 
     
    var user_data = JSON.parse(localStorage.getItem('user'));
    var user_id = user_data.id,
        token = user_data.token;

    var list_user = $.ajax({
        url: 'http://greenvelvet.alwaysdata.net/kwick/api/user/logged/' + token,
        dataType: 'jsonp'
    });

    list_user.done(function(data) {
        if(data.result.status ==="done"){
            $("#userList").empty();
            console.log(data);

             
            var userlog = data['result']['user'];
            
                for (var i = 0; i < userlog.length; i++) {
                $("#userList").append('<p><i class="fa fa-user"></i><span class="name"> ' + userlog[i] + '</span></p>');


                }
            }
    }); 

};
// refraichement de tchat et des Membre
		var refresh = function() {
		    list_message();
		    list_users();
		}
		refresh();
		setInterval( refresh, 2000);

}); //end jquery

 