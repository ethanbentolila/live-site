//Partner 1: 
    //Name:Ethan Bentolila
    //Student ID:100783477 

// Partner 2
    // Name: Marshall Presutto!
    // Student ID: 100775601

//Date Completed: 2022-02-25



(function(core){

    /**
     * User class will create a suer with a username, firstname, lastname, emailaddress and password
     */
    class User 
    {
        // constructor
        constructor(username = "",firstName = "", lastName = "", emailAddress = "", password = "")
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.Username = username;
            this.EmailAddress = emailAddress;
            this.Password = password;
        }

        //overriden functions
        toString() 
        {
            return `Username: ${this.Username}\nFirst Name: ${this.FirstName}\nLastName: ${this.LastName}\nEmail Address: ${this.EmailAddress}`;
        }

        //utility function
        toJSON()
        {
            return {
                "Username" : this.Username,
                "FirstName": this.FirstName,
                "LastName": this.LastName,
                "EmailAddress" : this.EmailAddress,
            }
        }
    


        fromJSON(data)
        {
            this.Username = data.Username;
            this.FirstName = data.FirstName;
            this.LastName = data.LastName;
            this.EmailAddress = data.EmailAddress;
            this.Password = data.Password;
        }



        serialize()
        {
            if(this.Username !== "" && this.FirstName !== "" && this.LastName !== "" && this.EmailAddress !== "") {
                return `${this.Username},${this.FirstName},${this.LastName},${this.EmailAddress}`;
            }
            console.error("One or more properties of the User Object are missing or empty");
            return null;
        }

        deserialize(data) 
        {
            let propertyArray = data.split(",");
            this.Username = propertyArray[0];
            this.FirstName = propertyArray[1];
            this.LastName = propertyArray[2];
            this.EmailAddress = propertyArray[3];

        }



    }

    core.User = User;

})(core || (core={}));



(function()
{

    /**
     * This method uses AJAX to open a connection to the url and returns data to the callback function
     * @param {string} method 
     * @param {string} url 
     * @param {function} callback 
     */
     function AjaxRequest(method, url, callback)
     {
         //Step 1 - instantiate an XHR object
         let XHR = new XMLHttpRequest();
 
         //Step 2 - create an event listener / handler for readystatechange event
         XHR.addEventListener("readystatechange", () =>
         {
             if(XHR.readyState === 4 && XHR.status === 200) 
             {
                 callback(XHR.responseText);
             }
         });
 
         //Step 3 - Open a connection to the server
         XHR.open(method, url);
 
         //Step 4 - send the request to the server
         XHR.send();
     }

    /**
     * This function loads the NavBar from the header file and injects it into the page
     * @param {string} data 
     */
     function LoadHeader(data) 
     {
         $("header").html(data); // data payload
         $(`li>a:contains('${document.title}')`).addClass("active"); //adds a class of 'active'
         CheckLogin();

     }


     //Checks if the user is logged in or not
     function CheckLogin()
     {
         // if user is logged in
         if(sessionStorage.getItem("user"))
         {

             $("#login").html(
                 `<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
             );

            let newUser = new core.User();
            newUser.deserialize(sessionStorage.getItem("user"));
            //swap out the login link for the logout link

            
            //Will get the users display name
            let Navbar = document.getElementsByTagName("ul")[0];
            let tester = document.createElement("li");
            tester.innerHTML = `<a class="nav-link" href="#"><i class="fas fa-user-circle"></i> ${newUser.Username}</a>`;
            Navbar.insertBefore(tester,document.getElementsByTagName("li")[5]);



             $("#logout").on("click", function()
             {
                 // perform logout
                 sessionStorage.clear();
 
                 // redirect back to login
                 location.href = "login.html";
             });
            

         }
     }


    //Named function
    function Start() 
    {

        AjaxRequest("GET", "header.html" , LoadHeader);

        //Will always occur on all pages
        switch(document.title) 
        {

            case "Register":
                DisplayRegisterPage();
                break;
            case "login":
                DisplayLoginPage();
                break;
        }
    }
    window.addEventListener("load", Start);
})();



    /**
     * Will validate an input field given the input field id, regular expression and error message
     * @param {string} input_field_ID 
     * @param {RegExp} regular_expression 
     * @param {string} error_message 
     */
     function validateField(input_field_ID,regular_expression,error_message) 
     {
         let ErrorMessage = $("#ErrorMessage").hide();
 
         $("#"+input_field_ID).on("blur" , function() {
             let textContent = $(this).val(); 
             if(!regular_expression.test(textContent)) {
                 $(this).trigger("focus").trigger("select"); 
                 ErrorMessage.addClass("alert alert-danger").text(error_message).show();
             }
             else 
             {
                ErrorMessage.removeAttr("class").hide(); 
             }
         });
     }


     /**
      * Will call validateField for all fields in the register form
      */
     function RegisterFormValidation() 
     {

        //A capatalized first name firstname that allows for prefixes, max length of 25
        validateField("firstName", /^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,25})$/, "Please enter a valid First Name. Must have a capatalized first letter.");
        //A capatalized last name that allows for individuals with hyphenated last names, max length of 40
        validateField("lastName", /^([A-Z][a-z]{1,25})?(-)?([A-Z][a-z]{1,40})$/, "Please enter a valid Last Name. Must have a capatalized first letter.");
        //An email address with a minimum length of 8 and a requirement for the @ symbol
        validateField("emailAddress",/^(([a-zA-Z0-9._-]{2,})+@([a-zA-Z0-9.-]{2,})+\.[a-zA-Z]{2,10})/,"Please enter a valid Email Address.");
        //A password allowing for alphanumeric characters and select symbols with a minumum of 8
        validateField("password", /^[a-zA-Z0-9._-|!|?|#|$|@]{6,}$/, "Please enter a valid password. Must be a minimum of 8 characters.");
         
     }
 




//called if user is on the register page
function DisplayRegisterPage() {

    RegisterFormValidation();

    $("#registerButton").on("click", function(event)
    {
        event.preventDefault();
        let ErrorMessage = $("#ErrorMessage").hide();

        //I found our validation unfair if the user doesn't know what they wrote as the password, 
        //I check if they are the same once the user clicks the button
        //If it is invalid, a user will not be created and the form will not be reset
        if(password.value !== confirmPassword.value){
            $(this).trigger("focus").trigger("select"); 
            ErrorMessage.addClass("alert alert-danger").text("password and confirm password do not match.").show();
        }
        else 
        {
            ErrorMessage.removeAttr("class").hide(); 
            //will create a new user, their username will be their first and last name
            let newUser = new core.User(firstName.value + " "+lastName.value,firstName.value,lastName.value,emailAddress.value,password.value);
            console.log(newUser.toString());
            $("#registerForm").trigger("reset");
        }
    });

}

//called if user is on the login page
function DisplayLoginPage() 
{
    let messageArea = $("#messageArea");
    messageArea.hide();
    $("#loginButton").on("click", function() 
    {
        let success = false;
        //create an empty user object
        let newUser = new core.User();
        // use a jquery shortcut to load the users.json file 
        $.get("./Data/users.json",function(data) 
        {
            //for every user in the users.json file. loop
            for (const user of data.users) 
            {
                //check if the username and password entered match with user
                if(username.value == user.Username && password.value == user.Password) 
                {
                    //get the user data from the file and assign it to our user
                    newUser.fromJSON(user);
                    success = true;
                    break;
                }
            }
            //if username and password matches - success... perform login sequence
            if(success) 
            {
                //add user to session storage
                sessionStorage.setItem("user", newUser.serialize());
                //hide any error messages
                messageArea.removeAttr("class").hide();
                //redirect user to secure site
                location.href = "index.html";
            }
            else 
            {
                //display an error message 
                $("#username").trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
            }
        });
        $("#cancelButton").on("click", function ()
        {
            //clears the login form
            document.forms[0].reset();  
            //return to homepage
            location.href = "index.html";
        });
    });
}
