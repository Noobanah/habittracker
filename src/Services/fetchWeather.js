import axios from 'axios';

export function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                console.error("Error getting location:", error.message);
                reject(error);
            }
        );
    });
}

export async function getLocationName(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    try {
        const response = await axios.get(url);
        const location = response.data.display_name;
        console.log("📍 สถานที่:", location);
        return location;
    } catch (error) {
        console.error("❌ เกิดข้อผิดพลาด:", error.message);
        return null; // ✅ ป้องกัน undefined ถ้า API ล้มเหลว
    }
}