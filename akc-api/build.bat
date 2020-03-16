docker build -t bloopletech/akc-api .
@if %errorlevel% neq 0 exit /b %errorlevel%
docker push bloopletech/akc-api
@if %errorlevel% neq 0 exit /b %errorlevel%
