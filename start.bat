@echo off
echo ========================================
echo    RepoSwipe - Demarrage automatique
echo ========================================
echo.

REM Verifier si Node.js est installe
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Node.js n'est pas installe !
    echo Telecharge-le sur : https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js detecte
node --version
echo.

REM Verifier si les dependances sont installees
if not exist "node_modules\" (
    echo [INFO] Installation des dependances...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERREUR] Echec de l'installation
        pause
        exit /b 1
    )
    echo [OK] Dependances installees
    echo.
)

REM Verifier si .env existe
if not exist ".env" (
    echo [INFO] Creation du fichier .env...
    copy .env.exemple .env >nul
    echo [ATTENTION] Configure ton fichier .env avec tes cles Supabase et GitHub !
    echo Appuie sur une touche pour ouvrir .env dans le bloc-notes...
    pause >nul
    notepad .env
    echo.
)

REM Verifier Docker
echo [INFO] Verification de Docker...
docker --version >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Docker detecte
    echo [INFO] Demarrage de Redis avec Docker...
    docker-compose up -d redis
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Redis demarre avec Docker
    ) else (
        echo [ATTENTION] Docker est installe mais ne fonctionne pas
        echo Redis sera desactive (sessions en memoire)
    )
) else (
    echo [INFO] Docker non detecte - Redis desactive
    echo L'application fonctionnera avec des sessions en memoire
    echo Pour installer Docker : https://www.docker.com/products/docker-desktop
)
echo.

echo ========================================
echo    Demarrage de RepoSwipe...
echo ========================================
echo.
echo Application disponible sur : http://localhost:3000
echo Appuie sur Ctrl+C pour arreter
echo.

REM Demarrer le serveur
npm start
