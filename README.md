# 🚛 IKEA Logistics Optimizer

![IKEA Logistics Optimizer](https://picsum.photos/seed/ikea-logistics/1200/400)

**IKEA Logistics Optimizer** es un simulador de arquitectura de soluciones diseñado para optimizar la logística de envíos de IKEA. Este proyecto demuestra cómo aplicar patrones de integración de **Make.com** para reducir costes operativos mediante la fragmentación inteligente de bultos.

---

## 🔒 Auditoría de Seguridad

Como parte de las mejores prácticas de desarrollo, se ha realizado un escaneo de seguridad en el repositorio:

- **Secretos y Claves:** No se han detectado API Keys, contraseñas o tokens "hardcoded" en el código fuente (`App.tsx`, `main.tsx`, etc.).
- **Gestión de Entorno:** Todas las variables sensibles (como `GEMINI_API_KEY`) se inyectan a través de variables de entorno y están protegidas por el archivo `.gitignore`.
- **Exposición de Variables:** El archivo `vite.config.ts` utiliza el prefijo `process.env` solo para claves configuradas explícitamente, evitando la exposición accidental de todas las variables del sistema al cliente.
- **Protección Git:** Se ha implementado un `.gitignore` robusto que bloquea archivos `.env`, logs y carpetas de editores para evitar fugas de información.

---

## 🚀 Características

- **Simulador Bento Grid:** Interfaz modular y profesional inspirada en patrones de diseño modernos.
- **Optimización Dinámica:** Algoritmo que compara en tiempo real el coste de consolidación vs. fragmentación.
- **Rules Engine:** Implementación exacta de las reglas de negocio de IKEA (Peso > 30kg, Distancia > 100km).
- **Tooling para Make.com:** Documentación técnica integrada para replicar la lógica en escenarios reales de automatización.

## ⚖️ Reglas de Negocio

| Concepto | Valor | Detalle |
| :--- | :--- | :--- |
| **Tarifa Base** | 15.00€ | Aplicada por cada bulto generado. |
| **Límite de Peso** | 30.0 kg | Por encima de este límite: +1.00€ / kg extra. |
| **Límite Distancia** | 100 km | Por encima de este límite: +0.50€ / km extra. |

## 🏗️ Arquitectura de la Solución (Make.com)

El sistema emula un flujo de automatización profesional:

1.  **Iterator:** Recibe el JSON de entrada y separa los productos para su evaluación individual.
2.  **Filter/Router:** Evalúa si el peso acumulado permite seguir agregando items al bulto actual.
3.  **Array Aggregator:** Cierra el paquete cuando se alcanza el límite de eficiencia (punto de corte de 45kg).

## 🛠️ Stack Técnico

- **Frontend:** React 19, TypeScript, Vite.
- **Estilos:** Tailwind CSS 4.
- **Iconos:** Lucide React.
- **Movimiento:** Framer Motion (Motion for React).

## 💻 Instalación & Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar entorno local
npm run dev

# Construir para producción
npm run build
```

---

Desarrollado con un enfoque en **seguridad y eficiencia logística**.
