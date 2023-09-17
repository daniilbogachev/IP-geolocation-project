import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {validateIp} from './helpers'
import icon from '../images/icon-location.svg'

const ipInput = document.querySelector('.search-bar__input');
const btn = document.querySelector('button');

const ipInfo = document.querySelector('#ip');
const locationInfo = document.querySelector('#location');
const timezoneInfo = document.querySelector('#timezone');
const ispInfo = document.querySelector('#isp');

btn.addEventListener('click', getData);
ipInput.addEventListener('keydown', handleKey);

const markerIcon = L.icon({
    iconUrl: icon,
    iconSize: [30, 40],
})

const mapArea = document.querySelector('.map');
const map = L.map(mapArea, {
    center: [51.505, -0.09],
    zoom: 13,
});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
L.marker([51.505, -0.09], {icon: markerIcon}).addTo(map);


function getData() {
    if (validateIp(ipInput.value)){
        fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_o1mItwZxrRAkqbiouiK2qmEWBkF2l&ipAddress=${ipInput.value}`)
            .then(response => response.json())
            .then(setInfo)
    }

}

function handleKey(e) {
    if (e.key === 'Enter') {
        getData();
    }
}

function addOffset(map) {
    const offsetY = map.getSize().y * 0.15;
    map.panBy([0, -offsetY], {animate: false});
}

function setInfo(mapData) {
    const {lat, lng, country, region, timezone} = mapData.location;

    console.log(mapData);
    ipInfo.innerText = mapData.ip;
    locationInfo.innerText = country + ' ' + region;
    timezoneInfo.innerText = timezone;
    ispInfo.innerText = mapData.isp;

    map.setView([lat, lng]);
    L.marker([lat, lng], {icon: markerIcon}).addTo(map);

    if (matchMedia("(max-width: 1023px)").matches) {
        addOffset(map);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getAddress('102.22.22.1').then(setInfo);
});
