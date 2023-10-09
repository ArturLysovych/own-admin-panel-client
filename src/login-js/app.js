const form = document.getElementById('form');
let formType;

document.addEventListener('click', function (event) {
    if (event.target.matches('#form h2')) {
        formType = (form.getAttribute('data-mode') === 'login') ? 'register' : 'login';
        form.setAttribute('data-mode', formType);
        event.target.innerText = `${formType.toUpperCase()} FORM`;

        const emailField = (formType === 'register') ? '<input type="email" placeholder="email" name="email" id="email" required>' : '';
        form.innerHTML = `
            <h2>${formType.toUpperCase()} FORM</h2>
            <input type="text" placeholder="login" name="login" id="login" required>
            <input type="password" placeholder="password" name="password" id="password" required>
            ${emailField}
            <button type="submit">Submit</button>
        `;

        form.style.transform = 'scale(1.05)';
        setTimeout(() => {
            form.style.transform = 'scale(1)';
        }, 200);
        form.reset();
    }
});

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const login = formData.get('login');
    const password = formData.get('password');
    const email = formData.get('email');
    const postingData = { login, password, email };

    axios
    .post(`/${formType}-admin`, postingData)
    .then((response) => {
        alert(response.data);
        if(response.data == 'Successfully login') {
            form.reset();
            window.location.href = `/user?login=${login}&password=${password}`;
        }
    })
    .catch((error) => {
        console.error(error);
    });
});