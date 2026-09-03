# RIU Frontend Challenge

Aplicación desarrollada como parte de un challenge técnico de Frontend.

El proyecto simula un centro de gestión de superhéroes donde es posible visualizar, crear, editar y eliminar héroes según sea necesario.

La implementación fue realizada con Angular 21 LTS, aplicando prácticas de Angular moderno como Signals, `computed`, inputs y outputs, junto con una estructura pensada para mantener el proyecto ordenado y facilitar su crecimiento.

## Tecnologías

- Angular 21 LTS
- TypeScript
- RxJS
- SCSS
- Reactive Forms
- Signals
- npm
- ESLint y Prettier
- Docker y Nginx

No se utilizaron librerías externas de UI ni librerías de iconos.

Toda la interfaz fue construida utilizando componentes propios y un UI Kit SCSS reutilizable que utilizo en otros proyectos, adaptando para este challenge principalmente la paleta de colores.

## Funcionalidades

La aplicación permite:

- Listar superhéroes.
- Búsqueda por nombre con debounceTime, distinctUntilChanged y switchMap.
- Crear nuevos héroes.
- Editar héroes existentes.
- Eliminar héroes.
- Paginar el listado.
- Mantener persistencia de los datos mediante `localStorage`.
- Mostrar estados globales de carga.
- Notificar errores y acciones mediante mensajes visuales.

## Arquitectura

El proyecto está organizado de la siguiente manera:

```text
src/app/
├── core/
│   ├── http-context/
│   ├── interceptors/
│   └── services/
├── features/
│   └── heroes/
│       ├── components/
│       ├── data-access/
│       ├── models/
|       ├── pages/
│       └── validator/
│
├── layout/
├── pages/
└── shared/
```

### Core

Contiene elementos globales de la aplicación, principalmente:

- Interceptores HTTP.
- Contextos HTTP
- Servicios globales de loading y mensajes.

### Feature Heroes

Centraliza la lógica de gestión de superhéroes:

- HeroesService: define el contrato HTTP para las operaciones CRUD.
- mockApiInterceptor: simula una API REST y persiste los datos en localStorage.
- HeroesForm: formulario reutilizable para creación y edición.
- uniqueNameValidator: valida de forma asíncrona que no existan nombres duplicados.

### Layout

Actualmente contiene el `Header` principal de la aplicación.

### Shared

Contiene componentes reutilizables que no dependen directamente de una feature concreta.

Entre ellos:

- Alert
- Button
- Modal
- Spinner
- Toast

## Lazy Loading

La feature de héroes utiliza lazy loading.

Aunque actualmente la aplicación no tiene un tamaño considerable, elegí utilizar esta estrategia para mantener una estructura preparada para una posible ampliación del proyecto y cargar la funcionalidad únicamente cuando sea necesaria.

## Gestión de estado

El estado local de los componentes se gestiona mediante Signals.

Los valores derivados, como páginas disponibles, cantidad total de páginas y héroes visibles, se calculan con computed().

Los componentes de mayor interacción y los componentes compartidos utilizan:

```ts
ChangeDetectionStrategy.OnPush;
```
La validación asíncrona del nombre utiliza un contexto HTTP para evitar mostrar el loading global ante cada pulsación del usuario.

## Persistencia de datos

Los héroes se almacenan en `localStorage` para mantener persistencia entre recargas.

Cuando la aplicación inicia y no existe información almacenada, se utiliza un `hero_mock` como seed inicial con aproximadamente 20 superhéroes.

A partir de ese momento, las operaciones realizadas por el usuario actualizan la información persistida.

## API simulada

En lugar de utilizar `json-server`, elegí simular el backend mediante un `HttpInterceptor`.

La intención fue mantener el flujo de trabajo lo más cercano posible a una aplicación que consume una API real, utilizando `HttpClient` y Observables, pero manteniendo al mismo tiempo el control de la lógica de creación, actualización, eliminación y persistencia en `localStorage`.

De esta forma los componentes y servicios trabajan sobre peticiones HTTP sin depender de un servidor externo para ejecutar el challenge.

## Búsqueda

La búsqueda se realiza mediante el método:

```ts
searchByName();
```

El flujo utiliza operadores de RxJS:

- `debounceTime(300)`
- `distinctUntilChanged()`
- `switchMap()`

El `debounceTime` evita realizar una petición inmediatamente con cada pulsación.

`distinctUntilChanged` evita repetir búsquedas cuando el valor no cambió.

Elegí `switchMap` porque permite trabajar siempre con la última búsqueda ingresada, cancelando la suscripción anterior cuando aparece un nuevo valor.

## Creación y edición

La creación y edición de héroes utilizan el mismo formulario reutilizable.

El modelo de héroe incluye:

- `id`
- `name`
- `superpower`
- `weakness`
- `enemy`

Al crear un héroe, el identificador se genera tomando el valor máximo existente y sumando uno.

En edición también se valida si realmente hubo cambios antes de realizar la actualización. Si no existen modificaciones, se muestra un Toast informativo evitando ejecutar una operación innecesaria.

## Loading y manejo de errores

La aplicación centraliza los estados globales mediante interceptores.

### LoadingInterceptor

Trabaja junto con `LoadingService` para controlar el estado de carga global mientras existen peticiones HTTP activas.

### ErrorInterceptor

Trabaja junto con `MessageService` para comunicar los errores al usuario mediante las notificaciones de la aplicación.

Esto permite evitar repetir la misma lógica de loading y errores en cada componente.

## UI Kit

La aplicación utiliza un UI Kit SCSS propio que reutilizo entre distintos proyectos.

Para este challenge se mantuvo la estructura y los componentes del kit, modificando principalmente la paleta de colores para adaptarla a la temática de superhéroes.

También se utilizaron componentes compartidos propios para evitar depender de librerías externas de interfaz.

## Navegación

La aplicación cuenta con una página Home que funciona como presentación antes de ingresar a la gestión de superhéroes.

Desde allí se accede a la feature de héroes, que contiene las vistas necesarias para:

- Listado.
- Creación.
- Edición.

## Diseño

El challenge no requería una implementación responsive, por lo que el foco estuvo puesto en la funcionalidad, arquitectura y experiencia de uso en escritorio.

## Testing

Se implementaron tests unitarios priorizando las partes principales de la aplicación y los requerimientos funcionales del challenge.

El alcance se centró especialmente en:

- `HeroesService`
  - Obtención de todos los héroes.
  - Obtención de un héroe por ID.
  - Búsqueda por nombre.
  - Validación de existencia de nombre.
  - Validación de existencia de nombre excluyendo un héroe por ID.
  - Creación.
  - Edición.
  - Eliminación.

- `HeroesList`
  - Carga inicial de datos.
  - Manejo de errores.
  - Paginación.
  - Navegación entre páginas.
  - Búsqueda con `debounce`.
  - Reinicio de paginación al realizar búsquedas.
  - Navegación hacia creación y edición.
  - Apertura del modal de confirmación.
  - Eliminación de héroes.
  - Manejo de errores durante la eliminación.

En la ejecución final se completaron **46 tests distribuidos en 15 archivos**, todos finalizados correctamente.

`HeroesService` cuenta con **9 tests** y alcanza **100% de coverage en statements, branches, functions y lines**.

`HeroesList` cuenta con **21 tests**. La lógica TypeScript de `heroes-list.ts` alcanza **100% de coverage en statements, branches, functions y lines**, mientras que el conjunto completo del componente, incluyendo su template, alcanza:

- **96.18%** en statements.
- **93.33%** en branches.
- **86.2%** en functions.
- **100%** en lines.

El resto de los componentes principales cuentan con smoke tests orientados a validar su correcta creación e integración básica.

De esta manera se cubre completamente la lógica del servicio encargado del CRUD, búsqueda y validación de nombres, junto con la lógica principal del componente responsable del listado, búsqueda, paginación, navegación y eliminación de héroes.

## Docker

La aplicación fue dockerizada utilizando una estrategia multi-stage.

En la primera etapa se utiliza `node:22-alpine` para instalar las dependencias y generar el build de producción de Angular.

En la segunda etapa se utiliza `nginx:alpine` para servir los archivos estáticos generados.

También se agregó una configuración personalizada de Nginx utilizando:

```bash
nginx
try_files $uri $uri/ /index.html;

```
Esto permite que las rutas internas de Angular funcionen correctamente al acceder directamente a URLs como /heroes/:id/edit/, evitando errores 404 del servidor.

La aplicación se expone mediante el puerto 80 del contenedor.

Construcción de la imagen:
```bash
docker build -t riu-frontend-challenge .
```
Ejecutar el contenedor:
```bash
docker run --rm -p 8080:80 riu-frontend-challenge
```
La aplicación estará disponible en:
```bash
http://localhost:8080
```
## Requisitos previos

- Node.js 22 o superior.

- npm 10 o superior.

- Docker opcional, para ejecutar la aplicación mediante contenedor.

## Ejecución local

Instalar dependencias:

```bash
npm ci
```
Iniciar la aplicación:

```bash
npm start
```

La aplicación estará disponible en:

```bash
http://localhost:4200
```
Generar un build de producción:
```bash
npm run build
```

## Calidad de código

Ejecutar ESLint:
```bash
npm run lint
```

Verificar formato:
```bash
npm run format:check
```
Formatear el proyecto:
```bash
npm run format
```

## Testing

Ejecutar tests:
```bash
npm test -- --watch=false
```
Ejecutar tests con reporte de coverage:
```bash
npm test -- --watch=false --coverage
```
## Uso de IA

No se utilizó IA agéntica para desarrollar o modificar automáticamente el proyecto.

Se utilizó IA como herramienta de apoyo para diagramar el trabajo, agilizar algunas tareas de código repetitivo y analizar decisiones de arquitectura durante el desarrollo.
