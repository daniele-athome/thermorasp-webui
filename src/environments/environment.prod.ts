export const environment = {
  production: true,
  api_url: '/api',
  mqtt_host: window.location.hostname,
  mqtt_port: window.location.port ? Number(window.location.port) : 80,
  mqtt_path: '/mqtt/',
  sensor_validity: 600
};
