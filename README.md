# Prode Mundial CJM 2026

Web app completa: carga de prodes → resultados reales → ranking automático.

## Stack
- **Frontend**: HTML + CSS + JS vanilla (sin frameworks)
- **DB**: Supabase (Postgres, gratis)
- **Hosting**: Vercel (gratis)

---

## Setup en 4 pasos

### 1. Supabase
1. Crear proyecto en https://supabase.com
2. SQL Editor → pegar `sql/schema.sql` → Run
3. Settings → API → copiar las 3 keys

### 2. Config
Editar `public/js/config.js`:
```js
const SUPABASE_URL         = 'https://xxxx.supabase.co';
const SUPABASE_KEY         = 'anon-public-key';
const SUPABASE_SERVICE_KEY = 'service-role-key';
```

### 3. Contraseña admin
Editar `public/js/admin.js` línea 7:
```js
const ADMIN_PASSWORD = 'tu-clave-secreta';
```

### 4. Vercel
1. Subir a GitHub
2. https://vercel.com → New Project → importar repo
3. Deploy (el `vercel.json` ya configura todo)

---

## Páginas
| URL | Función |
|-----|---------|
| `/` o `/index.html` | Formulario de carga de prodes |
| `/ranking.html` | Ranking público en tiempo real |
| `/admin.html` | Panel admin (requiere contraseña) |

## Panel admin
- **Pestaña "Prodes cargados"**: tabla con todos los prodes, puntaje en tiempo real, barra de completitud, detalle expandible con colores (verde=exacto, amarillo=ganador), exportar CSV
- **Pestaña "Cargar resultados"**: mismo formulario de scores para ingresar los resultados reales partido a partido. Al guardar, el ranking se recalcula instantáneamente.

## Sistema de puntaje
| Logro | Puntos |
|-------|--------|
| Resultado exacto | 5 pts |
| Ganador/empate correcto | 3 pts |
| Campeón acertado | +100 pts |
| Subcampeón acertado | +50 pts |
| 3er puesto acertado | +25 pts |
| Goleador acertado | +100 pts |

## Estructura
```
prode-mundial/
├── public/
│   ├── index.html        ← carga de prodes
│   ├── ranking.html      ← ranking público
│   ├── admin.html        ← panel admin
│   ├── css/style.css
│   └── js/
│       ├── config.js     ← ★ EDITAR con keys Supabase
│       ├── data.js       ← estructura del torneo + motor de puntaje
│       ├── form.js       ← formulario de carga
│       ├── ranking.js    ← ranking público
│       └── admin.js      ← panel admin (cambiar ADMIN_PASSWORD)
├── sql/schema.sql        ← ejecutar en Supabase
└── vercel.json
```
