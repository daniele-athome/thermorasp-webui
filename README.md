 Raspberry PI Smart Thermostat Web interface
===========================================

Completely client-side web interface for the thermostat API based on AngularJS.


## Build instructions

* Clone this repository
* Clone [Adminator](https://github.com/puikinsh/Adminator-admin-dashboard)
* Apply `adminator.patch` to the Adminator directory
* Run `npm install && npm run build` in Adminator directory
* Copy the following files/directories from Adminator `build` directory into our `app/assets/adminator` directory:
  - fonts/
  - bundle.js
  - vendor.js
  - style.css
