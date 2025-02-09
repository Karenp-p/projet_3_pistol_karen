async function login(email, password){
    try{
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        });

        const data = await response.json();

        localStorage.setItem('token', data.token);

        window.location.href = "index.html";
    }catch(error){
        console.log(error)
    }
}

document.getElementById('login').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
})

// petite modif