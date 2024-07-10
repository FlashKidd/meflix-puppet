document.getElementById('ccForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    fetch(form.action, {
        method: form.method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(responseText => {
        if (responseText.includes('Dead') || responseText.includes('Error')) {
            document.getElementById('status').innerText = responseText;
            document.getElementById('status').classList = 'response--danger';
        }
        else {
            document.getElementById('status').innerText = responseText;
            document.getElementById('status').classList = 'response--success';
        }
    })
    .catch(error => {
        document.getElementById('status').innerText = `Warning: Contact Developer'`;
        document.getElementById('status').classList = 'response--warning';
    });
});

document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.remove('deep-dark-mode');
    document.body.classList.remove('light-mode');
});

document.getElementById('deepDarkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('deep-dark-mode');
    document.body.classList.remove('dark-mode');
    document.body.classList.remove('light-mode');
});
