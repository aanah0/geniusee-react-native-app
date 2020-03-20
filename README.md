# geniusee-react-native-app
Тестовое задание для Geniusee

## Завершенный функционал:

- Список тасок
- авторизация/регистрация
- редактирование таски
- добавление таски

## Issues:
- ONLINE ONLY (продолжу работу над этим. не смог быстро завести `apollo-cache-persist`)
- бек не возвращает нигде userId, поэтому таски всегда создаются для юзера с `userId = 1`

## TODO
 [ ] типизация apollo
 [ ] доскрол, когда добавляется новая таска
 [ ] `apollo-cache-persist`
 [ ] синхронизация с беком действий, которые были сделаны в offline mode
 [ ] перевести анимацию при добавлении таски на `reanimated`
 
 ## Затраченное время
 ![Image of Time tracker](https://raw.github.com/aanah0/geniusee-react-native-app/master/assets/time-track.jpg)

Было потрачено много времени на изучение react-apollo и знакомство с пятой версией react-navigation + пытался натянуть REST подход на apollo. То есть, это всё единоразово потраченное время :) 