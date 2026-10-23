# SPATIAL CATALOG / ISSUE 001

**HOW SPACE BECOMES COMMERCE.**

Primera fase de una revista editorial inmersiva: dirección gráfica, tipografía cinética, narrativa controlada por scroll y catálogo comercial ilustrativo.

Esta implementación sustituye íntegramente la anterior. No incluye Gaussian Splat todavía.

## Contenido

Portada, índice, manifiesto, Living Room, interludio, Bedroom, interludio, Dining Room y cierre.

- Experiencia de borde a borde y pantalla completa.
- Escenas con la composición visual a 100% del viewport.
- Texto que entra, se puede leer y desaparece de la escena.
- Capas de animación independientes para texto y productos.
- Orientación horizontal para móviles; pantalla de giro en vertical.
- Imágenes de interiorismo temporales y recursos vectoriales de respaldo incluidos en el HTML.

## Ejecutar

El archivo `index.html` es autónomo. Abrir en un navegador o usar un servidor estático local: `python -m http.server 8000`.

## Publicar

GitHub Pages por GitHub Actions mediante `.github/workflows/deploy.yml`.

Sitio: https://inmersoxr.github.io/Catalogo_espacial/

## Próxima etapa

Integración de Gaussian Splat y cámara sincronizada al progreso narrativo.
