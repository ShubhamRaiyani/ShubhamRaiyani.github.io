let map, userMarker, targetMarker, circle;
let targetLat, targetLng, targetRadius;
let alertActive = false;

function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    trackLocation();
}

function trackLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(updateLocation, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

function updateLocation(position) {
    const { latitude, longitude } = position.coords;
    
    if (!userMarker) {
        userMarker = L.marker([latitude, longitude], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map);
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
    targetRadius = parseInt(document.getElementById('radius').value);
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
        radius: targetRadius
    }).addTo(map);
}

function checkProximity(lat, lng) {
    if (targetLat && targetLng && targetRadius) {
        const distance = map.distance([lat, lng], [targetLat, targetLng]);
        if (distance <= targetRadius) {
            if (alertActive) {
                document.getElementById('alertMessage').textContent = "You've entered the target area!";
                document.getElementById('alertMessage').style.color = "red";
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

// Remove this line as we now have a separate button for setting the radius
// document.getElementById('radius').addEventListener('change', updateCircle);

window.onload = initMap;
