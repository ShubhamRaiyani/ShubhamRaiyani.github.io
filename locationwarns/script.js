let map, userMarker, targetMarker, circle;
let targetLat, targetLng, alertRadius;
const alertSound = document.getElementById('alertSound');

function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    requestLocationPermission();
}

function requestLocationPermission() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                updateLocation(position);
                startLocationTracking();
            },
            handleLocationError,
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

function startLocationTracking() {
    navigator.geolocation.watchPosition(updateLocation, handleLocationError, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
    });
}

function updateLocation(position) {
    const { latitude, longitude } = position.coords;
    
    if (!userMarker) {
        userMarker = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 13);
    } else {
        userMarker.setLatLng([latitude, longitude]);
    }
    
    checkProximityAlert(latitude, longitude);
}

function handleLocationError(error) {
    console.error("Error getting location:", error.message);
    alert("Unable to retrieve your location. Please check your device settings and reload the page.");
}

function checkProximityAlert(lat, lng) {
    if (targetLat && targetLng && alertRadius) {
        const distance = calculateDistance(lat, lng, targetLat, targetLng);
        if (distance <= alertRadius) {
            playAlertSound();
            showAlertMessage("You have entered the alert zone!");
        } else {
            showAlertMessage("");
        }
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Implement distance calculation using Haversine formula
    // For now, returning a placeholder value
    return 0;
}

function playAlertSound() {
    alertSound.play().catch(e => console.error("Error playing sound:", e));
}

function showAlertMessage(message) {
    document.getElementById('alertMessage').textContent = message;
}

// Event listeners
document.getElementById('setTarget').addEventListener('click', setTargetPoint);
document.getElementById('setRadius').addEventListener('click', setAlertRadius);
document.getElementById('setAlert').addEventListener('click', setProximityAlert);
document.getElementById('testSound').addEventListener('click', () => {
    alertSound.play().catch(e => console.error("Error playing sound:", e));
});

// Initialize map when the page loads
window.addEventListener('load', initMap);

// Placeholder functions (implement these according to your requirements)
function setTargetPoint() {
    // Implement setting target point
}

function setAlertRadius() {
    // Implement setting alert radius
}

function setProximityAlert() {
    // Implement setting proximity alert
}
