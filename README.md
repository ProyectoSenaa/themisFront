## 🏛️ THEMIS - Sistema de Gestión de Novedades Académicas

THEMIS es una plataforma para gestionar, seguir y administrar novedades académicas dentro del SENA.

## 📌 Tabla de Contenido
¿Qué es THEMIS?

Arquitectura

Stack Tecnológico

Instalación y Configuración

Características Principales

Documentación Técnica

## ¿Qué es THEMIS?
THEMIS es un sistema diseñado para digitalizar y optimizar la gestión de novedades académicas como:

✅ Retiros voluntarios

⚠️ Deserción

🔄 Condicionamiento de matrícula

❌ Cancelación

🔀 Traslados

⏸️ Aplazamientos

🔙 Reingresos

## Principales funcionalidades
- **Registro de novedades académicas dese cialquier dispositivo**
- **Consuta del estado de sus solicitudes en tiempo real(24/7)**
- **Recepcion de noticaciones automáticas por correo electrónico**
- **Acceso transparente al seguimiento completo de sus procesos**
- **Procesamiento y respuesta de solicitudes de novedades**
- **Gestón centralizada de todos los procesos académicos**
- **Generacion de reportes**
  
## Requisitos del sistema

### Backend
- **Java 17+**
- **Spring Boot**
- **Base de datos relacional** (ej. MySQL, PostgreSQL)
- **Gradle** para la gestión de dependencias

### Frontend
- **Node.js 18+**
- **Next.js**
- **React**
- **Tailwind CSS**
- **Axios** para las solicitudes HTTP al backend
- **react-toastify** para la gestión de notificaciones
  
### Configuracióm del entorno


1. Clonar el repositorio del frontend: 
    ```bash
    git clone https://github.com/senaFactory/aquilesApp.git](https://github.com/senaFactory/themisFront.git)
    ```

    
 Clonar el repositorio del back: 
  ```bash
    git clone https://github.com/senaFactory/aquilesApp.git](https://github.com/senaFactory/themisFront.git)](https://github.com/senaFactory/themisBack.git)
  ```
    
2. Instalar las dependencias:
    ```bash
     npm install
    ```
3. Ejecutar la aplicación:
    ```bash
    npm run dev
    ```
4. Configurar el archivo application.properties o application.yml con los detalles de la base de datos y el servidor de correos electrónicos:
 ```properties
    log4j.rootLogger=DEBUG, stdout

# Redirect log messages to console
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.target=System.out
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%d{ISO8601} [%t] %-5p %c %x - %m%n

# Log level for specific packages
log4j.logger.co.sena.edu.themis.Business=DEBUG


# URL de la API GraphQL externa
external.graphql.url=https://circular-plasma-kelkoo-inflation.trycloudflare.com/graphql

# Timeouts para conexiones externas (en milisegundos)
external.api.connect.timeout=5000
external.api.read.timeout=10000


```
## Agradecimientos
Queremos agradecer a todos los desarrolladores, instructores y aprendices que han colaborado en este proyecto, aportando ideas y feedback constante. Su contribución ha sido fundamental para el desarrollo de Themis.

## Contribuciones
Este es un proyecto en constante evolución, por lo que cualquier aportación es bienvenida. Si encuentras errores, tienes sugerencias o deseas colaborar en nuevas funcionalidades, no dudes en abrir un issue o enviar un pull request. ¡Tu ayuda es siempre apreciada!
