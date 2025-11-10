# GPA Calculator

A React web application to calculate weighted GPA (Grade Point Average) based on course credits.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jeranguz/gpa-calculator
   cd gpa-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

### Production Build

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## 📖 How to Use

1. Enter your course information:
   - **Course Name**: The name or code of the course
   - **Credits**: Number of credits for the course
   - **Final Grade**: The grade received
2. Click **"+ Add Course"** to add more courses to a semester
3. Click **"+ Add Semester"** to add additional semesters
4. The weighted GPA is calculated automatically in real-time

## 📊 Calculation Method

The application calculates the weighted GPA using the formula:

```
GPA = (Σ(Grade × Credits)) / (Σ Credits)
```

Where:
- Multiply the final grade of each course by its credit hours
- Sum all the products
- Divide the total by the total number of credits

## ✨ Features

- ✅ Add multiple courses per semester
- ✅ Add multiple semesters
- ✅ Delete courses and semesters
- ✅ Real-time automatic calculation
- ✅ Modern and responsive interface
- ✅ No backend required (runs entirely in the browser)

## 🛠️ Technologies

- React 19
- Vite 7
- HTML5
- CSS3
- JavaScript (ES6+)

## 📝 License

This project is open source and available for personal and educational use.
