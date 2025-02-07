// Fetch names from the server
// Fetch names from the server
async function fetchNames() {
    try {
        const response = await fetch('https://data-nqxizh8rm-aditya-waghmare1s-projects.vercel.app//fetch-names');
        const data = await response.json();
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';

        data.forEach((user, index) => {
            const li = document.createElement('li');
            li.className = 'chat-item';
            li.textContent = `${index + 1}. ${user.name}`;
            li.addEventListener('click', () => {
                // Fetch output based on clicked name
                fetchOutput(user.email);
                // Clear names list after selecting
                userList.innerHTML = '';
            });
            userList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching names:', error);
    }
}

// Fetch output based on email
async function fetchOutput(email) {
    try {
        const response = await fetch(`http://localhost:4000/fetch-output/${email}`);
        const data = await response.json();
        const outputDiv = document.getElementById('output');
        outputDiv.textContent = data.output || 'No output available.';
    } catch (error) {
        console.error('Error fetching output:', error);
    }
}

// Initialize by fetching names
fetchNames();

// Menu toggle functionality for mobile view
document.querySelector('.menu-toggle').addEventListener('click', () => {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('active');
});

// Fetch output based on email
async function fetchOutput(email) {
    try {
        const response = await fetch(`http://localhost:4000/fetch-output/${email}`);
        const data = await response.json();
        const outputDiv = document.getElementById('output');
        outputDiv.textContent = data.output || 'No output available.';
    } catch (error) {
        console.error('Error fetching output:', error);
    }
}

// Initialize by fetching names
fetchNames();

// Menu toggle functionality for mobile view
document.querySelector('.menu-toggle').addEventListener('click', () => {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('active');
});
