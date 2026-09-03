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

No se utilizaron librerías externas de UI ni librerías de iconos.

Toda la interfaz fue construida utilizando componentes propios y un UI Kit SCSS reutilizable que utilizo en otros proyectos, adaptando para este challenge principalmente la paleta de colores.

## Funcionalidades

La aplicación permite:

- Listar superhéroes.
- Buscar héroes por nombre.
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
├── features/
│   └── heroes/
│       ├── components/
│       ├── data-access/
│       ├── models/
│       └── pages/
│
├── layout/
├── pages/
└── shared/
```

### Core

Contiene elementos globales de la aplicación, principalmente:

- Interceptores HTTP.
- Servicios globales.

### Features

Contiene las funcionalidades principales de la aplicación.

La feature `heroes` concentra toda la lógica relacionada con la gestión de superhéroes y se encuentra separada en componentes, acceso a datos, modelos, páginas y rutas.

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

El estado interno de los componentes se resolvió utilizando Signals.

Para estados derivados se utilizó `computed()`.

Un ejemplo es la paginación, donde a partir de la información disponible se calculan los datos necesarios para renderizar solamente los héroes correspondientes a la página actual.

En los componentes con mayor interacción, como el listado y la edición de héroes, también se utilizó:

```ts
ChangeDetectionStrategy.OnPush;
```

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

Se implementaron tests unitarios priorizando las partes principales de la aplicación.

El alcance se centró especialmente en:

- `HeroesService`
  - Obtención de héroes.
  - Búsqueda por nombre.
  - Creación.
  - Edición.
  - Eliminación.
  - Manejo de casos donde el héroe no existe.

- `HeroesList`
  - Carga inicial de datos.
  - Manejo de errores.
  - Paginación.
  - Búsqueda con `debounce`.
  - Navegación hacia creación y edición.
  - Eliminación mediante confirmación.

En la ejecución final se completaron **33 tests distribuidos en 13 archivos**.

`HeroesService` cuenta con 7 tests y `HeroesList` con 15 tests, mientras que el resto de los componentes principales cuentan con smoke tests para validar su correcta creación.

Ambos alcanzan 100% de coverage en statements, branches, functions y lines.

De esta manera se cubre completamente la lógica del servicio encargado del CRUD y búsqueda de héroes, junto con el componente principal responsable del listado, búsqueda, paginación y acciones sobre los héroes.

## Docker

La aplicación fue dockerizada utilizando una estrategia multi-stage.

En la primera etapa se utiliza `node:22-alpine` para instalar las dependencias y generar el build de producción de Angular.

En la segunda etapa se utiliza `nginx:alpine` para servir los archivos estáticos generados.

También se agregó una configuración personalizada de Nginx utilizando:

```bash
nginx
try_files $uri $uri/ /index.html;

```

Esto permite que las rutas internas de Angular funcionen correctamente al acceder directamente a URLs como /heroes/edit/:id, evitando errores 404 del servidor.

La aplicación se expone mediante el puerto 80 del contenedor.

Construcción de la imagen

```bash
docker build -t riu-frontend-challenge .
```

## Ejecución

Instalar las dependencias:

```bash
npm install
```

Iniciar el proyecto:

```bash
npm start
```

Realizar testing:

```bash
npm test -- --watch=false
```

## Uso de IA

No se utilizó IA agéntica para desarrollar o modificar automáticamente el proyecto.

Se utilizó IA como herramienta de apoyo para diagramar el trabajo, agilizar algunas tareas de código repetitivo y analizar decisiones de arquitectura durante el desarrollo.
