//Navigation from Sign in and Sign up
function openSignIn(){
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
  }
  function openSignUp(){
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
  }

  //stores values for authentication purpose
  //these will be used later to configure the user pool data before authenticating
  var username; 
  var password;
  var personalName;
  var poolData;


  //Amazon Cognito Sign up functionality
  function SignUpFunction() {

    personalName = document.getElementById("personalName").value;    
    username = document.getElementById("registerEmail").value;

    //validate passwords with error handling
    if (document.getElementById("signUpPassword").value != document.getElementById("passwordConfirm").value) {
        alert("Passwords Do Not Match!")
        throw "Passwords Do Not Match!"
    } else {
        password = document.getElementById("signUpPassword").value;  
    }

    poolData = {
            UserPoolId : _config.cognito.userPoolId, // Your user pool id here
            ClientId : _config.cognito.clientId // Your client id here
        };     

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = []; // Initializes an empty array

    var dataEmail = {
        Name : 'email',
        Value : username, //get email from form field
    };

    var dataPersonalName = {
        Name : 'name',
        Value : personalName, //get username from form field
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail); 
    var attributePersonalName= new AmazonCognitoIdentity.CognitoUserAttribute(dataPersonalName);

    // Pushing user attributes into the attributeList array
    attributeList.push(attributeEmail);
    attributeList.push(attributePersonalName);

    // Later used in userPool.signUp to sign up a new user with these attributes
    userPool.signUp(username, password, attributeList, null, function(err, result){
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        //change elements of page
        alert("Check Your Email For Verification");
    });
    }
  
  //Amazon Cognito Sign up functionality
  function SignInFunction() {
    var authenticationData = {
      Username: document.getElementById("loginEmail").value,
      Password: document.getElementById("SignInpassword").value,
    };

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    var poolData = {
      UserPoolId: _config.cognito.userPoolId,
      ClientId: _config.cognito.clientId,
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var userData = {
      Username: document.getElementById("loginEmail").value,
      Pool: userPool,
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();
        console.log(accessToken); // Remove this line or use the token as needed

        document.getElementById("root").innerHTML = "Welcome, " + document.getElementById("loginEmail").value
        + '<br><br><button type="button" onclick="SignOutFunction()">Sign Out</button>'; //Add button into html to enable a sign out feature
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("registerForm").style.display = "none";
      },

      onFailure: function (err) {
        alert(err.message || JSON.stringify(err));
      },
    });
  }

  //Sign out funtion
  function SignOutFunction() {
    const logout = () => {
      var poolData = {
        UserPoolId: _config.cognito.userPoolId, //obtain UserPoolId from config
        ClientId: _config.cognito.clientId, //obtain ClientId from config
      };

      var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      var user = userPool.getCurrentUser();

      if (user) {
        user.signOut(); //Sign the user out
        alert("User is signed out");
        location.reload(); // Refresh the page after sign-out
      } else {
        alert("No user to sign out");
      }
    };
    logout();
  }