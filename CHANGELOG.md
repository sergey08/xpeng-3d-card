# Changelog / Historial de cambios

All notable changes are recorded here using Semantic Versioning. / Los cambios relevantes se registran aquí con versionado semántico.

## [Unreleased] / [Sin publicar]

Changes in main are not automatically HACS releases. / Los cambios en main no se publican automáticamente en HACS.

## [0.3.3] - 2026-10-25

### Fixed / Corregido
- Move door panels outward during animated opening so the visible body geometry does not obscure them. / Desplaza las puertas hacia fuera durante la apertura para evitar que la carrocería las oculte.

## [0.3.2] - 2026-10-25

### Fixed / Corregido
- Add contrasting door recesses and exterior door seams to show open states clearly. / Añade huecos oscuros y juntas para distinguir las puertas abiertas.
- Adjust door pivot and outward swing direction. / Ajusta las bisagras y la dirección de apertura.

## [0.3.1] - 2026-10-25

### Fixed / Corregido
- Moved the charge flap, plug and 3D cable to the opposite rear side of the vehicle. / Tapa de carga, conector y manguera colocados en el lado posterior contrario del vehículo.
- Version label inside the card. / Identificación de la versión dentro de la tarjeta.

## [0.3.0] - 2026-10-25

### Added / Añadido
- Animated live state for four doors, boot and bonnet. / Estados animados para cuatro puertas, maletero y capó.
- Charge flap animation, visible hose when plugged in and illuminated plug when charging. / Tapa de carga, manguera al enchufar e iluminación durante la carga.
- Aggregate window status representation. / Representación del estado conjunto de ventanillas.

## [0.2.0] - 2026-10-25

- Early procedural 3D preview with 360-degree camera and color customization. / Prototipo 3D inicial, giro 360 grados y personalización del color.

## Version policy / Política de versiones

- Stable releases: `vMAJOR.MINOR.PATCH`. / Lanzamientos estables.
- Previews: same version tagged as prerelease on GitHub. / Versiones preliminares marcadas como prerelease.
- Hotfixes increment PATCH; new backward-compatible features increment MINOR; breaking changes increment MAJOR. / Las correcciones incrementan PATCH, nuevas funciones compatibles MINOR y cambios incompatibles MAJOR.
- Every release ships the root `xpeng-3d-card.js` asset generated from `dist/xpeng-3d-card.js`. / Cada versión incluye el JavaScript de instalación generado desde dist.
