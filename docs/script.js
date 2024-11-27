// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');

    // Function to parse URL query parameters
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        for (let pair of pairs) {
            if (pair) {
                const [key, value] = pair.split('=');
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        }
        return params;
    }

    // Get the 'times' parameter
    const params = getQueryParams();
    let times = [30, 60, 90]; // Default times

    if (params.times) {
        times = params.times.split(',').map(time => parseInt(time)).filter(time => !isNaN(time) && time > 0);
        if (times.length === 0) {
            times = [30, 60, 90];
        }
    }

    // Create clickable areas based on times
    times.forEach(time => {
        const area = document.createElement('div');
        area.classList.add('area');
        area.textContent = `${time}s`;
        area.dataset.originalTime = time;
        area.dataset.remainingTime = time;
        container.appendChild(area);
    });

    // Handle click events
    container.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('area') && !target.classList.contains('running')) {
            startTimer(target);
        }
    });

    // Function to start the countdown timer
    function startTimer(area) {
        let remaining = parseInt(area.dataset.remainingTime);
        if (isNaN(remaining) || remaining <= 0) {
            remaining = parseInt(area.dataset.originalTime);
        }

        area.classList.add('running');
        area.style.backgroundColor = '#e74c3c'; // Change color to indicate running

        const intervalId = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(intervalId);
                resetArea(area);
            } else {
                area.textContent = `${remaining}s`;
            }
        }, 1000);

        // Store the interval ID so it can be cleared if needed
        area.dataset.intervalId = intervalId;
    }

    // Function to reset the area after countdown
    function resetArea(area) {
        const originalTime = area.dataset.originalTime;
        area.textContent = `${originalTime}s`;
        area.classList.remove('running');
        area.style.backgroundColor = '#3498db'; // Reset to original color
        delete area.dataset.intervalId;
    }

    // Optional: Handle page visibility change to pause timers when not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause all running timers
            document.querySelectorAll('.area.running').forEach(area => {
                clearInterval(area.dataset.intervalId);
            });
        } else {
            // Optionally, restart timers or handle as needed
        }
    });
});
