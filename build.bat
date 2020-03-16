cd akc
call bash.exe -l -c './build'
@if %errorlevel% neq 0 exit /b %errorlevel%
call docker-build.bat
@if %errorlevel% neq 0 exit /b %errorlevel%
cd ..

cd akc-api
call build.bat
@if %errorlevel% neq 0 exit /b %errorlevel%
cd ..
