const { useState } = React;

function App() {
    const [mode, setMode] = useState('manual'); // 'manual' or 'import'
    const [importText, setImportText] = useState('');
    const [semesters, setSemesters] = useState([
        {
            id: 1,
            name: 'Semestre 1',
            courses: [{ id: 1, name: '', credits: '', grade: '' }]
        }
    ]);

    const addSemester = () => {
        const newId = Math.max(...semesters.map(s => s.id), 0) + 1;
        setSemesters([
            ...semesters,
            {
                id: newId,
                name: `Semestre ${newId}`,
                courses: [{ id: 1, name: '', credits: '', grade: '' }]
            }
        ]);
    };

    const removeSemester = (semesterId) => {
        setSemesters(semesters.filter(s => s.id !== semesterId));
    };

    const addCourse = (semesterId) => {
        setSemesters(semesters.map(semester => {
            if (semester.id === semesterId) {
                const newId = Math.max(...semester.courses.map(c => c.id), 0) + 1;
                return {
                    ...semester,
                    courses: [...semester.courses, { id: newId, name: '', credits: '', grade: '' }]
                };
            }
            return semester;
        }));
    };

    const removeCourse = (semesterId, courseId) => {
        setSemesters(semesters.map(semester => {
            if (semester.id === semesterId) {
                return {
                    ...semester,
                    courses: semester.courses.filter(c => c.id !== courseId)
                };
            }
            return semester;
        }));
    };

    const updateCourse = (semesterId, courseId, field, value) => {
        setSemesters(semesters.map(semester => {
            if (semester.id === semesterId) {
                return {
                    ...semester,
                    courses: semester.courses.map(course =>
                        course.id === courseId
                            ? { ...course, [field]: value }
                            : course
                    )
                };
            }
            return semester;
        }));
    };

    const calculateGPA = () => {
        let totalWeightedGrades = 0;
        let totalCredits = 0;

        semesters.forEach(semester => {
            semester.courses.forEach(course => {
                const credits = parseFloat(course.credits);
                const grade = parseFloat(course.grade);

                if (!isNaN(credits) && !isNaN(grade) && credits > 0) {
                    totalWeightedGrades += grade * credits;
                    totalCredits += credits;
                }
            });
        });

        return totalCredits > 0 ? (totalWeightedGrades / totalCredits).toFixed(2) : '0.00';
    };

    const getTotalCredits = () => {
        return semesters.reduce((total, semester) => {
            return total + semester.courses.reduce((semTotal, course) => {
                const credits = parseFloat(course.credits);
                return semTotal + (isNaN(credits) ? 0 : credits);
            }, 0);
        }, 0);
    };

    const parseImportedData = (text) => {
        const lines = text.trim().split('\n').filter(line => line.trim());
        const semesterMap = new Map();

        lines.forEach(line => {
            // Split by tabs
            const parts = line.split(/\t/).map(p => p.trim()).filter(p => p);
            
            if (parts.length >= 7) {
                // Expected format: CODE\tNAME\tCREDITS\t?\tSEMESTER YEAR\tSTATUS\tGRADE
                const code = parts[0];
                const courseName = parts[1];
                const credits = parts[2];
                
                // Find semester (looking for patterns like "II 2024", "I 2024", "III 2023")
                let semesterPart = '';
                for (let i = 3; i < parts.length - 2; i++) {
                    if (/^(I|II|III|IV)\s+\d{4}$/.test(parts[i])) {
                        semesterPart = parts[i];
                        break;
                    }
                }

                if (!semesterPart) return;

                const grade = parts[parts.length - 1];

                if (!semesterMap.has(semesterPart)) {
                    semesterMap.set(semesterPart, []);
                }

                semesterMap.get(semesterPart).push({
                    name: `${code} - ${courseName}`,
                    credits: credits,
                    grade: grade
                });
            }
        });

        // Convert map to semesters array
        const parsedSemesters = [];
        let semesterId = 1;
        
        // Sort semesters chronologically
        const sortedSemesters = Array.from(semesterMap.entries()).sort((a, b) => {
            const [semA, yearA] = a[0].split(' ');
            const [semB, yearB] = b[0].split(' ');
            
            if (yearA !== yearB) return yearA.localeCompare(yearB);
            
            const semOrder = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 };
            return (semOrder[semA] || 0) - (semOrder[semB] || 0);
        });

        sortedSemesters.forEach(([semesterName, courses]) => {
            parsedSemesters.push({
                id: semesterId++,
                name: semesterName,
                courses: courses.map((course, idx) => ({
                    id: idx + 1,
                    ...course
                }))
            });
        });

        return parsedSemesters.length > 0 ? parsedSemesters : null;
    };

    const handleImport = () => {
        const parsed = parseImportedData(importText);
        if (parsed) {
            setSemesters(parsed);
            setMode('manual');
        } else {
            alert('No se pudo procesar el texto. Por favor verifica el formato.');
        }
    };

    return (
        <div className="container">
            <h1>📚 Calculadora de Promedio Ponderado</h1>

            <div className="mode-toggle">
                <button 
                    className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
                    onClick={() => setMode('manual')}
                >
                    ✏️ Entrada Manual
                </button>
                <button 
                    className={`mode-btn ${mode === 'import' ? 'active' : ''}`}
                    onClick={() => setMode('import')}
                >
                    📋 Importar Datos
                </button>
            </div>

            {mode === 'import' ? (
                <div className="import-section">
                    <h3>Pega tus datos aquí</h3>
                    <div className="import-info" style={{marginBottom: '12px'}}>
                        💡 Puedes ir a tu expediente académico y seleccionar los cursos que necesites de esta forma:
                    </div>
                    <div className="import-example-image">
                        <img src="./image.png" alt="Ejemplo de selección de cursos desde expediente académico" />
                    </div>
                    <textarea
                        placeholder="Ejemplo:\nTM6100\tTALLER DE MULTIMEDIA\t3\t3\tII 2024\tAPROBADO\t10.0\nTM6102\tPROGRAMACIÓN AVANZADA CON ASP.NET\t4\t2\tII 2024\tAPROBADO\t10.0"
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                    />
                    <button className="import-btn" onClick={handleImport}>
                        📥 Importar Cursos
                    </button>
                    <div className="import-info">
                        Formato esperado: CÓDIGO NOMBRE CRÉDITOS ... SEMESTRE ESTADO NOTA<br/>
                        Los datos deben estar separados por tabulaciones o múltiples espacios.
                    </div>
                </div>
            ) : (
                <>
                    {semesters.map(semester => (
                <div key={semester.id} className="semester">
                    <div className="semester-header">
                        <div className="semester-title">{semester.name}</div>
                        {semesters.length > 1 && (
                            <button
                                className="remove-semester-btn"
                                onClick={() => removeSemester(semester.id)}
                            >
                                Eliminar Semestre
                            </button>
                        )}
                    </div>

                    {semester.courses.map(course => (
                        <div key={course.id} className="course">
                            <div className="course-inputs">
                                <div className="input-group">
                                    <label>Nombre del Curso</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Cálculo I"
                                        value={course.name}
                                        onChange={(e) => updateCourse(semester.id, course.id, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Créditos</label>
                                    <input
                                        type="number"
                                        placeholder="Ej: 3"
                                        min="0"
                                        step="0.5"
                                        value={course.credits}
                                        onChange={(e) => updateCourse(semester.id, course.id, 'credits', e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Nota Final</label>
                                    <input
                                        type="number"
                                        placeholder="Ej: 9.5"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={course.grade}
                                        onChange={(e) => updateCourse(semester.id, course.id, 'grade', e.target.value)}
                                    />
                                </div>
                                {semester.courses.length > 1 && (
                                    <button
                                        className="remove-course-btn"
                                        onClick={() => removeCourse(semester.id, course.id)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        className="add-course-btn"
                        onClick={() => addCourse(semester.id)}
                    >
                        + Agregar Curso
                    </button>
                </div>
            ))}

                    <button className="add-semester-btn" onClick={addSemester}>
                        + Agregar Semestre
                    </button>
                </>
            )}

            <div className="result">
                <h2>Promedio Ponderado</h2>
                <div className="gpa-value">{calculateGPA()}</div>
                <div className="details">
                    Total de créditos cursados: {getTotalCredits()}
                </div>
            </div>

            <footer className="footer">
                <div className="footer-content">
                    <p className="footer-name">Desarrollado por Jeremy Guzmán Vargas</p>
                    <div className="footer-links">
                        <a href="mailto:jeremyu4231@gmail.com" target="_blank" rel="noopener noreferrer" title="Email">
                            📧 Email
                        </a>
                        <a href="https://www.linkedin.com/in/jeremygzm" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                            💼 LinkedIn
                        </a>
                        <a href="https://github.com/Jeranguz" target="_blank" rel="noopener noreferrer" title="GitHub">
                            🐙 GitHub
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
