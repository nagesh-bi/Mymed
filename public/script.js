document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const number = document.getElementById('number').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;

    const appointmentData = {
        name,
        number,
        email,
        date
    };

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while booking the appointment.');
    }
});

