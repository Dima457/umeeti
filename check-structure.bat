@echo off
echo Проверка структуры проекта...
dir docker-compose.yml
dir register-service\
dir entrance-service\ 
dir gateway\
echo Если все папки и файл найдены - структура правильная!
pause