let map, userMarker, targetMarker, circle;
let targetLat, targetLng, targetRadius;
let alertActive = false;

function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

function trackLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(updateLocation, handleError);
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

function updateLocation(position) {
    const { latitude, longitude } = position.coords;
    
    if (!userMarker) {
        userMarker = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 13);
    } else {
        userMarker.setLatLng([latitude, longitude]);
    }

    checkProximity(latitude, longitude);
}

function handleError(error) {
    console.error("Error getting location:", error.message);
}

function setTargetPoint() {
    map.once('click', (e) => {
        targetLat = e.latlng.lat;
        targetLng = e.latlng.lng;
        
        if (targetMarker) {
            targetMarker.setLatLng([targetLat, targetLng]);
        } else {
            targetMarker = L.marker([targetLat, targetLng]).addTo(map);
        }
        
        updateCircle();
    });
}

function setRadius() {
    targetRadius = parseFloat(document.getElementById('radius').value);
    if (isNaN(targetRadius) || targetRadius <= 0) {
        alert("Please enter a valid radius (positive number)");
        return;
    }
    updateCircle();
}

function updateCircle() {
    if (!targetLat || !targetLng) {
        alert("Please set a target point first");
        return;
    }
    
    if (circle) {
        map.removeLayer(circle);
    }
    
    circle = L.circle([targetLat, targetLng], {
        radius: targetRadius * 1000, // Convert km to meters
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3
    }).addTo(map);
}

function checkProximity(lat, lng) {
    if (targetLat && targetLng && targetRadius) {
        const distance = map.distance([lat, lng], [targetLat, targetLng]) / 1000; // Convert meters to km
        if (distance <= targetRadius) {
            if (alertActive) {
                document.getElementById('alertMessage').textContent = "You've entered the target area!";
            }
        } else {
            document.getElementById('alertMessage').textContent = "";
        }
    }
}

function setAlert() {
    if (!targetLat || !targetLng || !targetRadius) {
        alert("Please set a target point and radius first");
        return;
    }
    alertActive = true;
    document.getElementById('setAlert').textContent = "Alert Active";
    document.getElementById('setAlert').disabled = true;
}

document.getElementById('setTarget').addEventListener('click', setTargetPoint);
document.getElementById('setRadius').addEventListener('click', setRadius);
document.getElementById('setAlert').addEventListener('click', setAlert);

initMap();
trackLocation();
