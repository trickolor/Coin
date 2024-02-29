import { el, setChildren } from 'redom';

import './map.scss'
import { RequestAPI } from '../../helpers/requests';

function loadYandexMapsAPI(apiKey) {
    const script = el('script.ymaps__script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=en_US`;
    script.type = 'text/javascript';
    script.async = true;
    script.onload = initializeMap;

    if (!document.head.querySelector('.ymaps__script')) {
        document.head.appendChild(script);
    } else {
        initializeMap();
    }
}

function initializeMap() {
    ymaps.ready(init);

    async function init() {
        let myMap = new ymaps.Map("map__container", {
            center: [55.751244, 37.618423],
            zoom: 11
        });

        const data = await RequestAPI.mapRequest();
        const coordinates = data.map(item => [item.lat, item.lon]);

        coordinates.forEach((c) => {
            let myPlacemark = new ymaps.Placemark(c, {}, {
                iconLayout: 'default#image',
                iconImageSize: [30, 42],
                iconImageOffset: [-3, -42]
            });

            myMap.geoObjects.add(myPlacemark);
        });
    }
}

export function map() {

    const main = document.querySelector('.main');

    const container = el('div', { id: 'map__container' });

    const title = el('h1', { class: 'map__title', textContent: 'Карта банкоматов' });

    setChildren(main, [title, container]);

    const apiKey = '1da63759-41cf-45ab-9fa0-5a750afce7a2';

    loadYandexMapsAPI(apiKey);
}

