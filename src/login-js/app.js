let h2 = document.querySelector('h2');
const form = document.getElementById('form');
let formType = 'register';

h2.addEventListener('click', function() {
    let currentType = form.getAttribute('data-mode');
    formType = (currentType === 'login') ? 'register' : 'login';
    this.innerText = `${formType} form`;
    form.setAttribute('data-mode', formType);
    form.style.transform = 'scale(1.05)';
    setTimeout(() => {
        form.style.transform = 'scale(1)';
    }, 200);
    form.reset();
    if (formType == 'register') {
        form.querySelectorAll('input').forEach((input) => {
            input.style.display = 'flex';
        });
    }
    if (formType == 'login') {
        Array.from(form.querySelectorAll('input')).at(-1).style.display = 'none';
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
            window.location.href = `/user?login=${login}&email=${email}&password=${password}`;
        }
    })
    .catch((error) => {
        console.error(error);
    });
});