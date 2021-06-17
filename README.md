# Challenge Avalith

## Pre requisitos

 - Tener instalado NodeJS. https://nodejs.org/es/download/
 - Tener instalado yarn. https://classic.yarnpkg.com/en/docs/install
 - Tener instalado MySQL. https://dev.mysql.com/downloads/installer/
 - Tener instalado MongoDB.  https://www.mongodb.com/try/download/community
 - Tener instalado git. https://git-scm.com/

## Cómo correr el proyecto

 - Clonar el repositorio con el comando `git clone https://github.com/urtubeycarlos/challenge-avalith.git`
 - Crear una base de datos MySQL y correr el script ubicado en la carpeta `sql` del proyecto para crear las tablas.
 - Instalar las dependencias con el comando `yarn`.
 - Crear un archivo llamado `.env` en el directorio de proyecto y definir las variables globales siguiendo el contenido del archivo `.env-template` .
 - Para iniciar el proyecto ejecutar el comando `yarn start` .
 - Para correr los tests ejecutar el comando `yarn test` .