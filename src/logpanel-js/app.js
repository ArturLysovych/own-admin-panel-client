const form = document.getElementById('form');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(form);
    let password = formData.get('password');

    axios
    .post(`/check-adminLog`, password)
    .then((response) => {
        if(password == response.data) {
            form.reset();
            window.location.href = `/panel`;
        }else alert('False data');
    })
    .catch((error) => {
        console.error(error);
    });
});