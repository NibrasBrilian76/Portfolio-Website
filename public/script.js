const form = document.getElementById("registerForm");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(username);

    const response = await fetch("/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username,
            email,
            password
        })

    });

    const data = await response.text();

    document.getElementById("message").innerText = data;

});