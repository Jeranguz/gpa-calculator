# Calculadora de Promedio Ponderado

Una aplicación web en React para calcular el promedio ponderado de notas universitarias basado en créditos.

## 🚀 Cómo usar

1. Abre el archivo `index.html` en tu navegador
2. Ingresa los datos de tus cursos:
   - **Nombre del Curso**: El nombre o código de la materia
   - **Créditos**: Cantidad de créditos de la materia
   - **Nota Final**: La calificación obtenida
3. Usa el botón **"+ Agregar Curso"** para añadir más materias al semestre
4. Usa el botón **"+ Agregar Semestre"** para añadir más semestres
5. El promedio ponderado se calcula automáticamente

## 📊 Cálculo

La aplicación calcula el promedio ponderado usando la fórmula:

```
Promedio = (Σ(Nota × Créditos)) / (Σ Créditos)
```

Donde:
- Multiplica la nota final de cada curso por su cantidad de créditos
- Suma todos los resultados de esos productos
- Divide la suma total entre el número total de créditos cursados

## ✨ Características

- ✅ Agregar múltiples cursos por semestre
- ✅ Agregar múltiples semestres
- ✅ Eliminar cursos y semestres
- ✅ Cálculo automático en tiempo real
- ✅ Interfaz moderna y responsiva
- ✅ Sin necesidad de instalación (funciona directo en el navegador)

## 🛠️ Tecnologías

- React 18
- HTML5
- CSS3
- JavaScript (ES6+)
