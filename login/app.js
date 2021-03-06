//window.addEventListener('load', function() {
  //var content = document.querySelector('.content');
  //var loadingSpinner = document.getElementById('loading');
  //content.style.display = 'block';
  //loadingSpinner.style.display = 'none';

  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email phone',
    leeway: 60
  });

  function setSession(authResult) {
    console.log(authResult);
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    //displayButtons();
	authenticate();
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        setSession(authResult);               
        //loginBtn.style.display = 'none';
        //homeView.style.display = 'inline-block';
        redirectToBot();
      } else if (err) {
        homeView.style.display = 'inline-block';
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      } else {
		  webAuth.authorize();
	  }
    });
  }

  function getUserInfo() {    
    webAuth.client.userInfo(localStorage.getItem('access_token'),(error,profile) => {
      console.log("profile",profile);
      if(!error){ 
        this.profile = profile;               
      }
    });
  }
  
  function authenticate() {
	  if(isAuthenticated()) {
		  redirectToBot();
	  } else {
		  handleAuthentication();
	  } 
  }

  function redirectToBot(){
    /*$.ajax({
      type: "GET",
      headers: {'Content-Type':'application/json'},
      url: "http://localhost:8080/#!/chatMobile",      
      success: function (msg) {
          console.log(msg);
      }
    });*/
  getUserInfo();
	location.href = "http://localhost:8080/#!/chatMobile";
  }

  function getDelegationToken(id_token){ 
    var data = {'idToken':id_token};    
    $.ajax({
      type: "POST",
      headers: {'Content-Type':'application/json'},
      url: "http://localhost:8080/getToken",
      data: JSON.stringify(data),
      success: function (msg) {
          console.log(msg);
      }
    });
       
  }

  /*function displayButtons() {
    if (isAuthenticated()) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      loginStatus.innerHTML = 'You are logged in!';
    } else {
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      loginStatus.innerHTML =
        'You are not logged in! Please log in to continue.';
    }
  }*/

  authenticate();
//});
