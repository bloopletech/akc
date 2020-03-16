docker build -t bloopletech/akc .
@if %errorlevel% neq 0 exit /b %errorlevel%
docker push bloopletech/akc
@if %errorlevel% neq 0 exit /b %errorlevel%
