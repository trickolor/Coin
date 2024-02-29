Проект - дипломная работа "Coin"

    Перед началом работы в папке BACKEND вводим в терминал команду npm start для запуска сервера 

    Чтоб запустить проект в режиме dev, в папке FRONTEND вводим в терминал npm run dev

    Чтоб собрать build, в папке FRONTEND вводим в терминал npm run build. Итоговая сборка - в папке dist

    Реализованы все технические требования, а так же все дополнительные задания:
        - Адаптив 320, 768 и 1200 пикселей.
        - Отображение типа платёжной системы карты для систем VISA, MASTERCARD и MIR
        - Кэширование данных (упрощенное, см. файл cache.js)
        - Кастомизация выкладки страницы пользователем (см. файл dragCustomization.js)

    Реализованы юнит тесты через Jest, а так же e2e тесты через Cypress:
        - Для запуска юнит тестов в папке FRONTEND запустить команду npm test
        - Для запуска е2е тестов в папке FRONTEND запустить npm cypress:run для тестирования через терминал и npm cypress:open для тестирования через spec окно cypress
        * Список тестов отобразится при использовании соответсвующих команд, в случае непрохождения каких либо тестов, пожалуйста, сообщите, отправив логи (!)

    Приложение выполнено как SPA. Маршрутеризация выполнена через URLSearchParams.


    

    