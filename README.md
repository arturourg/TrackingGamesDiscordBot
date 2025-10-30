# TrackingGamesDiscordBot

Bot de Discord (Node.js + TypeScript) para rastrear progreso de juegos y trofeos/logros en Steam y PlayStation Network.

## Requisitos
- Node.js 18.17+
- PostgreSQL 14+
- Redis 6+

## Configuración rápida
1. Copiar `.env.example` a `.env` y completar variables obligatorias.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar migraciones y seed:
   ```bash
   npm run db:push
   npm run seed
   ```
4. Levantar en modo desarrollo:
   ```bash
   npm run dev
   ```

## Scripts principales
- `npm run dev`: inicia el bot con recarga en caliente.
- `npm run build`: compila a JavaScript.
- `npm run start`: ejecuta la build en producción.
- `npm run lint`: linting con ESLint.
- `npm run test`: pruebas unitarias con Vitest.
- `npm run test:e2e`: pruebas e2e (stub).
- `npm run db:migrate`: aplica migraciones.
- `npm run seed`: datos de ejemplo.

## Estructura
Ver carpeta `src/` para capas `config`, `discord`, `services`, `db`, `jobs` y `tests`.
