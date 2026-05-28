# Plan de Migración: Weather Hub (Android/Java) → weather-rn (Expo/React Native)

> **Documento de análisis y planificación — REVISIÓN 1**  
> **Fecha:** 2026-05-27  
> **Estado:** Pendiente de aprobación  
> **Regla de oro:** Nada se implementa sin aprobación explícita humana, fase por fase.

---

## 0. Observaciones sobre la revisión del plan inicial

Este plan fue revisado contra `AGENTS.md` (raíz) y `react_native_app/weather-rn/AGENTS.md`. Los ajustes principales son:

1. **Fase 1 separada en dos:** la estructura base (`src/`, tipos, constantes) **no requiere dependencias nuevas** y puede hacerse con el `package.json` actual. La instalación de dependencias de navegación/UI pasa a una **Fase 2 independiente**.
2. **Navegación base antes que pantallas completas:** se valida el flujo de tabs con pantallas vacías/plantilla **antes** de implementar lógica de datos. Esto reduce riesgo de refactor masivo.
3. **API key explicitada como riesgo:** `EXPO_PUBLIC_OPENWEATHER_API_KEY` queda **expuesta en el bundle JavaScript**. Se requiere aprobación explícita para aceptar ese riesgo o decidir backend proxy. No se toca `.env` sin autorización.
4. **Estrategia offline simplificada:** por defecto se manejará offline como error de `fetch` (sin dependencia extra). Si el humano aprueba, se puede agregar `@react-native-community/netinfo` en fase posterior.
5. **Reverse geocoding innecesario:** la respuesta de `/forecast` de OWM ya incluye `city.name`. No se requiere reverse geocoding adicional. En la app original, `Geocoder` se usaba para obtener el nombre de la ciudad actual; en RN usaremos `city.name` directamente del JSON.
6. **QA real condicional:** las pruebas con llamadas reales a OpenWeatherMap dependen de que el humano configure una API key. Si no existe, la QA de esa fase queda marcada como **pendiente / bloqueada** y se valida estructura/typings nada más.
7. **Cierre obligatorio por fase:** cada fase incluye explícitamente resumen, archivos modificados, QA, riesgos pendientes y mensaje de commit sugerido, conforme a `AGENTS.md`.
8. **Aprobación fase por fase:** el humano aprueba cada fase individualmente, no el plan completo de una vez.
9. **Expo 56:** antes de escribir código que use APIs de Expo (como `expo-location`), se consultará la documentación versionada en `https://docs.expo.dev/versions/v56.0.0/`.

---

## 1. Inventario real de pantallas y flujos

### 1.1 App original (Weather Hub — Android Nativo)

La app define **3 Fragments** pero solo **2 están activos** en el `ViewPager2` (`CustomerAdapter.java`):

| # | Pantalla | Descripción | Estado en código |
|---|----------|-------------|------------------|
| 0 | **FragmentTwo** ("Today") | Clima actual por ciudad seleccionada | ✅ Activa |
| 1 | **FragmentThree** ("5 Day Forecast") | Pronóstico 5 días / intervalo 3h por GPS | ✅ Activa |
| — | **FragmentOne** ("Historical") | Layout XML existe, nunca instanciado | ❌ Muerto |

### 1.2 Flujos reales identificados

#### Flujo A — Clima por Ciudad (Página 0)
1. Usuario abre la app → carga clima de **"Dhaka"** por defecto (hardcodeado en lógica del Spinner).
2. Spinner con **8 ciudades de Bangladesh** hardcodeadas (`strings.xml`).
3. Al cambiar ciudad → `getWeatherData(cityMethod())` → llama a `/weather?q={city}`.
4. Muestra: temperatura actual, máxima, mínima, presión, humedad, velocidad/dirección del viento, sunrise, sunset.
5. Botón **"5 Day Forecast"** → `viewPager2.setCurrentItem(1)`.
6. **Back press** → muestra `AlertDialog` de confirmación "EXIT".

#### Flujo B — Pronóstico por GPS (Página 1)
1. Al entrar, solicita permisos `ACCESS_FINE_LOCATION` + `ACCESS_COARSE_LOCATION`.
2. Obtiene `FusedLocationProviderClient.getLastLocation()`.
3. Geocodifica lat/lng vía `Geocoder` para obtener nombre de ciudad.
4. Llama a `/forecast?lat={lat}&lon={lon}` → lista en `RecyclerView`.
5. Cada item muestra: fecha formateada (`convertUnixToDate`), descripción del clima, temperatura.
6. Botón **"Today"** → `viewPager2.setCurrentItem(0)`.
7. **Back press** → vuelve a página 0.

#### Flujo C — Sin conexión
- En ambas pantallas: verifica `ConnectivityManager`.
- Si no hay red: `Snackbar` rojo **"Turn on internet connection"** × 10 segundos.
- `ProgressBar` se oculta.

#### Flujo D — Manejo de suscripciones RxJava
- Usa `CompositeDisposable` para limpiar suscripciones en `onStop` / `onDestroy`.

---

## 2. Datos / API y modelos necesarios

### 2.1 Endpoints de OpenWeatherMap

| Endpoint | Método | Parámetros | Respuesta |
|----------|--------|------------|-----------|
| `/weather` | GET | `q={cityName}`, `appid={key}`, `units=metric` | `WeatherResult` |
| `/weather` | GET | `lat={lat}`, `lon={lon}`, `appid={key}`, `units=metric` | `WeatherResult` |
| `/forecast` | GET | `lat={lat}`, `lon={lon}`, `appid={key}`, `units=metric` | `WeatherForecastResult` |

**Base URL:** `https://api.openweathermap.org/data/2.5/`

### 2.2 Modelos TypeScript a definir

Ubicación sugerida: `src/types/weather.ts`

```typescript
// Primitivos
interface Coord      { lon: number; lat: number; }
interface Weather    { id: number; main: string; description: string; icon: string; }
interface Main       { temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number; sea_level?: number; grnd_level?: number; }
interface Wind       { speed: number; deg: number; gust?: number; }
interface Clouds     { all: number; }
interface Sys        { country?: string; sunrise: number; sunset: number; }
interface Rain       { "3h"?: number; }
interface City       { id: number; name: string; coord: Coord; country: string; population: number; timezone: number; sunrise: number; sunset: number; }
interface ForecastItem { dt: number; main: Main; weather: Weather[]; clouds: Clouds; wind: Wind; visibility: number; pop: number; rain?: Rain; sys: Sys; dt_txt: string; }

// Agregados
interface WeatherResult {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface WeatherForecastResult {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: City;
}
```

### 2.3 Constantes

- **Ciudades hardcodeadas** (`src/constants/cities.ts`): Dhaka, Barishal, Chittagong, Mymensingh, Khulna, Rajshahi, Rangpur, Sylhet.
- **API Key:** en la app original está hardcodeada en `Common.java`. En RN se propone usar variable de entorno (`EXPO_PUBLIC_OPENWEATHER_API_KEY`), con la advertencia de que **queda expuesta en el bundle**.

---

## 3. Propuesta de navegación y UI Material 3

### 3.1 Decisión de navegación

La app original usa un `ViewPager2` con swipe horizontal entre 2 páginas. Para mantener la familiaridad pero modernizar, se propone:

**Bottom Tabs Navigator** (`@react-navigation/bottom-tabs`) con estilo Material 3.

| Tab | Icono (MaterialCommunityIcons) | Pantalla |
|-----|-------------------------------|----------|
| 🌤️ **Today** | `weather-sunny` / `cloud-outline` | `CurrentWeatherScreen` |
| 📅 **Forecast** | `calendar-range` | `ForecastScreen` |

**Justificación:**
- Material 3 nativo en móviles.
- Acceso directo sin gestos de swipe (más descubrible).
- Escalable si en el futuro se reactiva "Historical".

### 3.2 Estructura de carpetas propuesta

```
react_native_app/weather-rn/src/
├── navigation/
│   └── AppNavigator.tsx          # BottomTabNavigator + tema Material 3
├── screens/
│   ├── CurrentWeatherScreen.tsx  # Ex-FragmentTwo
│   └── ForecastScreen.tsx        # Ex-FragmentThree
├── components/
│   ├── WeatherCard.tsx
│   ├── MetricRow.tsx
│   ├── CitySelector.tsx
│   ├── ForecastListItem.tsx
│   ├── LoadingSpinner.tsx
│   ├── OfflineBanner.tsx
│   ├── ScreenHeader.tsx
│   └── ErrorMessage.tsx
├── hooks/
│   ├── useWeather.ts             # Lógica de fetch /weather
│   └── useLocation.ts            # Permisos + geolocalización
├── services/
│   └── weatherApi.ts             # Wrapper de fetch
├── types/
│   └── weather.ts                # Interfaces de 2.2
├── constants/
│   └── cities.ts                 # Array de 8 ciudades
└── utils/
    └── dateUtils.ts              # convertUnixToDate, convertUnixToHour
```

### 3.3 Dependencias pendientes de aprobación

Se instalarán **fase por fase**, nunca de una sola vez.

| Dependencia | Motivo | Fase de instalación |
|-------------|--------|---------------------|
| `@react-navigation/native` | Navegación base | Fase 2 |
| `@react-navigation/bottom-tabs` | Bottom tabs Material 3 | Fase 2 |
| `react-native-screens` | Requerido por React Navigation | Fase 2 |
| `react-native-safe-area-context` | Safe areas | Fase 2 |
| `react-native-paper` | Componentes Material 3 | Fase 2 |
| `expo-location` | Reemplazo de `FusedLocationProviderClient` | Fase 5 |

**Dependencias opcionales (requieren aprobación explícita):**

| Dependencia | Motivo | Cuándo decidir |
|-------------|--------|----------------|
| `@react-native-community/netinfo` | Detección de conectividad más confiable que `fetch` | Fase 6 (offline UX) |

---

## 4. Lista de componentes reutilizables

| Componente | Props | Uso |
|------------|-------|-----|
| `WeatherCard` | `title: string; value: string; icon?: string` | Tarjeta de métrica individual |
| `MetricRow` | `icon: string; label: string; value: string` | Fila icono + label + valor |
| `CitySelector` | `cities: string[]; selected: string; onSelect: (city: string) => void` | Reemplazo del Spinner nativo |
| `ForecastListItem` | `date: string; temp: string; description: string` | Item del `FlatList` de pronóstico |
| `LoadingSpinner` | `visible: boolean` | Indicador de carga central |
| `OfflineBanner` | `visible: boolean` | Banner/snackbar "sin internet" |
| `ScreenHeader` | `title: string; leftAction?: () => void; rightAction?: () => void` | Header consistente Material 3 |
| `ErrorMessage` | `message: string; onRetry?: () => void` | Estado de error con reintentar |

---

## 5. Fases revisadas y ordenadas

> **Regla:** una fase = un objetivo concreto. No mezclar feature + refactor.
> **Regla:** antes de escribir código Expo (ej. `expo-location`), consultar `https://docs.expo.dev/versions/v56.0.0/`.

---

### Fase 1 — Estructura, tipos y constantes (sin dependencias nuevas)

**Objetivo:** Crear el esqueleto del proyecto (`src/`) y todo el código TypeScript que no requiere librerías externas.

**Tareas:**
- Crear estructura de carpetas `src/{types,constants,utils,components,screens,hooks,services}/`.
- Definir todas las interfaces TypeScript en `src/types/weather.ts`.
- Crear constante de ciudades en `src/constants/cities.ts`.
- Crear utilidades de fecha en `src/utils/dateUtils.ts` (`convertUnixToDate`, `convertUnixToHour`).
- Crear stubs/placeholders de screens (`src/screens/CurrentWeatherScreen.tsx`, `ForecastScreen.tsx`) que rendericen `<Text>Placeholder</Text>`.
- No instalar ninguna dependencia nueva.
- No tocar `.env` ni crearlo.

**QA:**
- `npx tsc --noEmit` debe pasar sin errores.
- Metro bundler debe levantar sin crash.
- Screens placeholders visibles al navegar manualmente (si hay navegación; si no, renderizar el placeholder directo en `App.tsx` temporalmente).

**Cierre de fase (obligatorio):**
- **Resumen:** Esqueleto del proyecto con tipos, constantes y utilidades base listos.
- **Archivos modificados:** Nuevos archivos en `src/`; posible cambio temporal en `App.tsx`.
- **Comandos ejecutados:** `npx tsc --noEmit`.
- **Resultado de QA:** Compilación limpia.
- **Riesgos pendientes:** Ninguno.
- **Commit sugerido:** `feat: add project skeleton, TypeScript types and constants`

---

### Fase 2 — Instalación de dependencias y navegación base

**Objetivo:** Instalar dependencias de navegación y UI, y configurar el `BottomTabNavigator` con pantallas vacías/plantilla.

**Tareas:**
- Instalar: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`, `react-native-paper`.
- Configurar `src/navigation/AppNavigator.tsx` con `BottomTabNavigator`.
- Conectar los dos placeholders de Fase 1 a las tabs.
- Configurar tema Material 3 básico (colores primarios, tipografía).
- Actualizar `App.tsx` para renderizar `AppNavigator`.

**QA:**
- App levanta sin errores.
- Se ven 2 tabs funcionales (cambian de placeholder).
- Estilos Material 3 aplicados (AppBar, colores, tipografía).

**Cierre de fase (obligatorio):**
- **Resumen:** Navegación base con 2 tabs y tema Material 3 funcionando.
- **Archivos modificados:** `package.json`, `package-lock.json`, `App.tsx`, `src/navigation/AppNavigator.tsx`, `src/screens/*.tsx`.
- **Comandos ejecutados:** `npm install ...`, `npx expo start` (verificación visual).
- **Resultado de QA:** Navegación fluida entre tabs; sin errores en consola.
- **Riesgos pendientes:** Si alguna dependencia rompe compatibilidad con Expo 56, se debe resolver antes de avanzar.
- **Commit sugerido:** `feat: add bottom tab navigation and Material 3 theme`

---

### Fase 3 — Capa de datos (API)

**Objetivo:** Implementar el servicio de datos con `fetch` nativo.

**Tareas:**
- Crear `src/services/weatherApi.ts` con los 3 endpoints.
- Usar `fetch` nativo (sin Axios por ahora).
- Manejar errores HTTP básicos (throw en `!response.ok`).
- No hardcodear API key en el archivo; usar `process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY` con fallback a `''`.
- Documentar que la QA real depende de que el humano configure la variable de entorno.

**QA:**
- Si el humano proporcionó API key: verificar que `fetch` devuelve JSON válido para `/weather?q=Dhaka`.
- Si no hay API key: validar que el código compila, que la URL se construye correctamente, y que el manejo de error cubre el caso de key vacía.

**Cierre de fase (obligatorio):**
- **Resumen:** Servicio de API funcional con `fetch` y tipado estricto.
- **Archivos modificados:** `src/services/weatherApi.ts`.
- **Comandos ejecutados:** `npx tsc --noEmit`.
- **Resultado de QA:** Con key → JSON válido. Sin key → compilación limpia + manejo de error.
- **Riesgos pendientes:** Sin API key, esta fase queda incompleta funcionalmente; se requiere key para QA real.
- **Commit sugerido:** `feat: add weather API service with typed fetch`

---

### Fase 4 — Pantalla "Today" (`CurrentWeatherScreen`)

**Objetivo:** Implementar la pantalla de clima actual con datos reales.

**Tareas:**
- Implementar UI con `react-native-paper` (Cards, Text, ActivityIndicator).
- Integrar `services/weatherApi.getWeatherByCity()`.
- Mostrar: temp actual, máxima, mínima, presión, humedad, viento, sunrise, sunset.
- Agregar `CitySelector` (dropdown/menu de 8 ciudades).
- Manejar estados: `loading`, `error`.
- **Offline:** manejar por error de `fetch` (sin `netinfo` por ahora).

**QA:**
- Cambiar ciudad → datos actualizan.
- Loading spinner visible durante fetch.
- Error visible si la API falla o no hay key.

**Cierre de fase (obligatorio):**
- **Resumen:** Pantalla Today funcional con selector de ciudad y métricas.
- **Archivos modificados:** `src/screens/CurrentWeatherScreen.tsx`, `src/components/CitySelector.tsx`, `src/components/MetricRow.tsx`, `src/components/LoadingSpinner.tsx`, `src/components/ErrorMessage.tsx`.
- **Comandos ejecutados:** Prueba manual en dispositivo/emulador.
- **Resultado de QA:** Cambio de ciudad actualiza datos; estados de carga y error visibles.
- **Riesgos pendientes:** Si no hay API key, esta pantalla no muestra datos reales.
- **Commit sugerido:** `feat: add CurrentWeather screen with city selector`

---

### Fase 5 — Pantalla "Forecast" (`ForecastScreen`)

**Objetivo:** Implementar la pantalla de pronóstico con GPS.

**Tareas:**
- Instalar `expo-location`.
- Implementar `src/hooks/useLocation.ts` (solicitar permisos, obtener lat/lng).
- Implementar `ForecastScreen` con `FlatList`.
- Integrar `services/weatherApi.getWeatherForecastByLatLng()`.
- Mostrar items con: fecha formateada, descripción, temperatura.
- Usar `city.name` de la respuesta de OWM (no reverse geocoding extra).
- Manejar permisos denegados con mensaje al usuario.

**QA:**
- Con permiso de ubicación concedido: lista de pronóstico visible.
- Con permiso denegado: mensaje instructivo visible.
- Loading y error states funcionan.

**Cierre de fase (obligatorio):**
- **Resumen:** Pantalla Forecast funcional con GPS y lista de pronóstico.
- **Archivos modificados:** `package.json`, `package-lock.json`, `src/screens/ForecastScreen.tsx`, `src/components/ForecastListItem.tsx`, `src/hooks/useLocation.ts`.
- **Comandos ejecutados:** Prueba manual en dispositivo/emulador.
- **Resultado de QA:** GPS obtiene coordenadas; lista renderiza items; permiso denegado manejado.
- **Riesgos pendientes:** `expo-location` en iOS requiere configuración adicional en `Info.plist` (documentar si se testea en iOS).
- **Commit sugerido:** `feat: add Forecast screen with GPS and 5-day list`

---

### Fase 6 — UX polish y estados edge

**Objetivo:** Manejar offline, errores de API, estados vacíos y mejorar la experiencia.

**Tareas:**
- Implementar `OfflineBanner` / Snackbar con `react-native-paper` cuando `fetch` falle por red.
- Manejar errores de API: ciudad no encontrada, rate limit, timeout.
- Estados vacíos (lista vacía, sin datos).
- Loading states consistentes en ambas pantallas.
- Si el humano aprueba: instalar `@react-native-community/netinfo` para detección proactiva de red.

**QA:**
- Modo avión: banner/snackbar visible.
- Ciudad inexistente: mensaje de error claro.
- Timeout: reintentar o mensaje de error.

**Cierre de fase (obligatorio):**
- **Resumen:** Estados edge cubiertos; UX robusta.
- **Archivos modificados:** `src/components/OfflineBanner.tsx`, `src/screens/*.tsx`, posiblemente `package.json`.
- **Comandos ejecutados:** Pruebas manuales en modo avión y con API key inválida.
- **Resultado de QA:** Todos los estados edge visibles y comprensibles.
- **Riesgos pendientes:** Sin `netinfo`, la detección de offline es reactiva (por error de fetch), no proactiva.
- **Commit sugerido:** `feat: add offline handling and error states`

---

### Fase 7 — QA final, revisión y documentación

**Objetivo:** Validar regresiones, revisar diff y actualizar documentación.

**Tareas:**
- Pruebas manuales en Android (y iOS si aplica).
- Verificar responsividad en diferentes tamaños.
- Revisar diff con `git-guardian`.
- Actualizar `docs/PROJECT_STATE.md` con estado actual del proyecto.
- Verificar que no quedaron credenciales hardcodeadas.

**QA:**
- Checklist de regresión: flujo completo ciudad → forecast → ciudad.
- No errores en consola.
- Sin fugas de memoria obvias (suscripciones limpiadas).

**Cierre de fase (obligatorio):**
- **Resumen:** Proyecto migrado, documentado y validado.
- **Archivos modificados:** `docs/PROJECT_STATE.md`.
- **Comandos ejecutados:** `git diff` (revisión), pruebas manuales finales.
- **Resultado de QA:** Checklist de regresión pasado.
- **Riesgos pendientes:** Ninguno (o documentados como deuda técnica futura).
- **Commit sugerido:** `docs: update project state and finalize migration`

---

## 6. Riesgos y decisiones pendientes

| Riesgo / Decisión | Impacto | Propuesta | ¿Requiere aprobación? |
|-------------------|---------|-----------|----------------------|
| **API Key expuesta en bundle** | Alta | `EXPO_PUBLIC_OPENWEATHER_API_KEY` funciona en Expo Go pero **queda visible en el JS bundle**. Aceptar riesgo para prototipo, o usar backend proxy. | ✅ **Sí — antes de Fase 3** |
| **Detección de red offline** | Media | Por defecto: manejar offline por errores de `fetch`. Opcional: `@react-native-community/netinfo` para detección proactiva. | ✅ **Sí — antes de Fase 6** |
| **Iconos de clima** | Media | Opción A: iconos dinámicos de OWM (`https://openweathermap.org/img/wn/{icon}.png`). Opción B: iconos locales estáticos (como la app original). | ✅ **Sí — antes de Fase 4** |
| **Reverse geocoding** | Baja | **No necesario.** La respuesta de `/forecast` incluye `city.name`. Se usará eso directamente. | ❌ No — ya resuelto |
| **Fetch vs Axios** | Baja | `fetch` nativo, sin dependencia extra. | ❌ No — `fetch` por defecto |
| **Estado global** | Baja | Solo 2 pantallas → `useState` + props/context local. No Redux/Zustand. | ❌ No — KISS |

---

## 7. Fuera de alcance (por ahora)

- ❌ **FragmentOne / Historical Weather Data** — layout XML existe pero nunca fue instanciado.
- ❌ **Búsqueda libre de ciudad** — la original solo permite 8 ciudades hardcodeadas.
- ❌ **Configuración de unidades** — siempre `metric` (°C).
- ❌ **Push notifications / alertas climáticas**.
- ❌ **Persistencia local / cache offline** — cada apertura hace fetch fresco.
- ❌ **Tests unitarios automatizados** — se prioriza migración funcional.
- ❌ **Dark mode dinámico** — se puede agregar en fase futura con Material 3.

---

## 8. Checklist de aprobación fase por fase

> El humano aprueba **cada fase individualmente**. No se avanza a la siguiente sin aprobación explícita.

### Antes de Fase 1
- [ ] Aprobar alcance general (2 pantallas, sin Historical).
- [ ] Aprobar que la Fase 1 no instala dependencias nuevas.

### Antes de Fase 2
- [ ] Aprobar lista de dependencias: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`, `react-native-paper`.

### Antes de Fase 3
- [ ] **Decidir estrategia de API key:** ¿aceptar `EXPO_PUBLIC_OPENWEATHER_API_KEY` expuesta en bundle, o preferís backend proxy?
- [ ] Confirmar que existe API key configurada por el humano, o aceptar que la QA será estructural (sin llamadas reales).

### Antes de Fase 4
- [ ] Aprobar estrategia de iconos de clima: ¿iconos dinámicos de OWM o iconos locales estáticos?

### Antes de Fase 5
- [ ] Aprobar instalación de `expo-location`.

### Antes de Fase 6
- [ ] Aprobar si se instala `@react-native-community/netinfo` para detección proactiva de red, o se mantiene manejo reactivo por errores de `fetch`.

### Antes de Fase 7
- [ ] Aprobar inicio de QA final y revisión de diff.

---

> **Resumen ejecutivo:**  
> Se migrará la funcionalidad real de Weather Hub (2 pantallas activas) a una app Expo/React Native con UI Material 3 y navegación por bottom tabs. El plan se divide en **7 fases independientes**, cada una con cierre obligatorio según `AGENTS.md`. No se instala ninguna dependencia ni se toca `.env` sin aprobación explícita previa. La primera fase es puramente estructural (carpetas, tipos, constantes) y no requiere dependencias nuevas.
