# Mapper Formulario - Extensión para Rellenar Formularios de Obras Sociales

## Descripción

**Mapper Formulario** es una extensión de Chrome diseñada para **automatizar el llenado de formularios web** en sitios de obras sociales. Permite mapear campos de un formulario usando **valores únicos de prueba**, guardar los selectores de cada input y luego **rellenar automáticamente** los campos con datos reales desde un archivo JSON.  

La extensión soporta distintos tipos de inputs: `text`, `number`, `date`, `select`, `radio`, `checkbox` y `textarea`.

---

## Funcionalidades

1. **Mapear Campos**  
   - Detecta los inputs de la página donde el usuario escribió los **valores de prueba**.  
   - Guarda para cada campo: selector único, tipo de input y valor de prueba.  
   - El mapeo se guarda por dominio y se reutiliza cada vez que se abra la misma web.

2. **Rellenar Formulario**  
   - Utiliza los datos reales del paciente almacenados en `datosPrueba.json`.  
   - Coloca los valores correctos en los inputs usando los selectores guardados.  
   - Soporta todos los tipos de inputs mencionados anteriormente.

3. **Limpiar Mapeo**  
   - Borra todos los datos de mapeo guardados para la web actual.  

---

## Estructura de Archivos

```
mapper-extension/
 ├── manifest.json       # Configuración de la extensión
 ├── popup.html          # Popup de la extensión (botones Mapear, Rellenar, Limpiar)
 ├── popup.js            # Script del popup
 ├── content.js          # Script que interactúa con la página
 ├── referencia.js       # Valores de prueba para mapear campos
 └── datosPrueba.json    # Datos reales para rellenar el formulario
```

---

## Configuración de Referencia y Datos

###
Define los **valores de prueba únicos** que permiten mapear cada campo del formulario:

```javascript
const referencia = {
  nroAfiliado: "123456",
  nombre: "nom",
  apellido: "ape",
  dni: "1",
  fechaNacimiento: "01/01/2000",
  fechaConsulta: "02/01/2024",
  sexo: "M",
  email: "email@prueba.com",
  telefono: "3511234567",
  obraSocial: "OSDE",
  tipoAutorizacion: "Consulta",
  observaciones: "obsPrueba",
  terminos: "true",
  prioridad: "alta"
};
```

> Estos valores deben ser únicos para que la extensión los identifique correctamente en el formulario.

### `datosPrueba.json`  
Contiene los **datos reales del paciente** que se colocarán en los inputs al rellenar el formulario:

```json
{
  "nroAfiliado": "654321",
  "nombre": "Juan",
  "apellido": "Pérez",
  "dni": "12345678",
  "fechaNacimiento": "1990-05-15",
  "fechaConsulta": "2025-09-15",
  "sexo": "M",
  "email": "juan.perez@mail.com",
  "telefono": "3519876543",
  "obraSocial": "SwissMedical",
  "tipoAutorizacion": "Procedimiento",
  "observaciones": "Paciente con turno programado",
  "terminos": true,
  "prioridad": "media"
}
```

---

## Instalación

1. Abre Chrome y ve a `chrome://extensions/`.  
2. Activa el **Modo Desarrollador** (arriba a la derecha).  
3. Haz clic en **Cargar descomprimida** y selecciona la carpeta `mapper-extension/`.  
4. Ahora la extensión aparecerá en la barra de Chrome con el nombre **Mapper Formulario**.

---

## Uso Paso a Paso

1. **Preparar la página**
   - Abre el formulario de la web de la obra social.  
   - Escribe en cada input el **valor de prueba** correspondiente definido en referencia. 
     - Ejemplo: en "Nombre" escribe `nom`, en "DNI" escribe `1`, en "Fecha de nacimiento" escribe `01/01/2000`, etc.

2. **Mapear campos**
   - Haz clic en el ícono de la extensión → **Mapear**.  
   - La extensión detectará los inputs donde pusiste los valores de prueba y guardará el **selector, tipo y valor de prueba** para cada campo.  
   - Se guardará automáticamente para el dominio de la web actual.

3. **Rellenar formulario**
   - Borra los valores de prueba de la página.  
   - Haz clic en **Rellenar** en el popup.  
   - La extensión tomará los datos de `datosPrueba.json` y los colocará automáticamente en los inputs correctos según el mapeo guardado.

4. **Limpiar mapeo**
   - Si quieres borrar los datos guardados para la web actual, haz clic en **Limpiar mapeo**.  

---

## Compatibilidad

- Navegador: Chrome (versión moderna, soporte Manifest V3)  
- Inputs soportados: `text`, `number`, `date`, `select`, `radio`, `checkbox`, `textarea`.  
- Archivos locales: `datosPrueba.json`  deben estar dentro de la carpeta de la extensión.

---

## Personalización

- **Añadir campos nuevos**: Agrega el campo en referencia con un valor único de prueba y en `datosPrueba.json` con el dato real.  
- **Cambiar valores de prueba**: Edita referencia.  
- **Cambiar datos reales**: Edita `datosPrueba.json`.  

---

## Advertencias

- Cada valor de prueba debe ser **único en la página**, para evitar conflictos al mapear.  
- El mapeo depende de los selectores de los inputs; si la web cambia su estructura, es posible que necesites mapear de nuevo.
