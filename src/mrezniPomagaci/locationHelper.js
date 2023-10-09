import axios from "axios";
const locationHelper = {
    checkIfBrowserSupportsGeolocationApi() {
      if ("geolocation" in navigator) {
        return true;
      } else {
        return false;
      }
    },
    requestLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Success callback - position object contains latitude and longitude
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            // Fetch user's country based on their IP address
            this.isUserInSerbia(latitude,longitude);
          },
          (error) => {
            // Error callback - handle errors here
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not available in this browser.");
      }
    },
    isUserInSerbia(lat, long){
        const minLatitude = 42.23;
        const maxLatitude = 46.18;
        const minLongitude = 18.84;
        const maxLongitude = 23.00; 
        if (lat >= minLatitude && 
            lat <= maxLatitude && 
            long >= minLongitude && 
            long <= maxLongitude) {
            console.log("user in serbia");
        }else{
            console.log("international user");
        }
    }
  };
  
  export default locationHelper;
  