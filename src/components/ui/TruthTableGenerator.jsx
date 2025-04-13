import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const logicalSymbols = {
  "¬": "Negación (NOT)",
  "∧": "Conjunción (AND)",
  "∨": "Disyunción (OR)",
  "→": "Implicación (IF-THEN)",
  "↔": "Doble Implicación (IF AND ONLY IF)",
  "(": "Abrir Paréntesis",
  ")": "Cerrar Paréntesis",
};

export default function TruthTableGenerator() {
  const [expression, setExpression] = useState("");
  const [variables, setVariables] = useState(["p"]);
  const [truthTable, setTruthTable] = useState([]);

  const validateExpression = (expr) => {
    if (!expr) {
      alert("Por favor, ingresa una expresión lógica");
      return false;
    }

    // Verificar caracteres sno permitidos
    if (!/^[a-zA-Z¬∧∨→↔()\s]+$/.test(expr)) {
      alert("Expresión inválida: contiene caracteres no permitidos");
      return false;
    }

    // Verificar balance de paréntesis
    let balance = 0;
    for (let char of expr) {
      if (char === "(") balance++;
      if (char === ")") balance--;
      if (balance < 0) {
        alert("Error: paréntesis desbalanceados");
        return false;
      }
    }
    if (balance !== 0) {
      alert("Error: paréntesis desbalanceados");
      return false;
    }

    return true;
  };

  const addVariable = () => {
    if (variables.length < 12) {
      const nextVariable = String.fromCharCode(variables[variables.length - 1].charCodeAt(0) + 1);
      setVariables([...variables, nextVariable]);
    }
  };

  const addSymbol = (symbol) => {
    setExpression(expression + " " + symbol);
  };

  const deleteInput = () => {
    setExpression("");
  };

  const generateTruthTable = async () => {
    if (!validateExpression(expression)) return;
    if (!expression) return alert("Por favor, ingresa una expresión lógica");

    try {
      const response = await fetch("https://generador-tablas-back.vercel.app/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression }),
      });

      const truthTable = await response.json();
      setTruthTable(truthTable);
    } catch (error) {
      console.error("Error al generar la tabla de verdad:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Generador de Tablas de Verdad</h1>

      <Card className="w-full max-w-lg p-6">
        <Input 
          value={expression} 
          onChange={(e) => setExpression(e.target.value)} 
          placeholder="Escribe tu expresión lógica"
        />

        <div className="grid grid-cols-4 gap-2 mt-4">
          {Object.keys(logicalSymbols).map((symbol) => (
            <Button key={symbol} onClick={() => addSymbol(symbol)}>
              {symbol}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {variables.map((variable) => (
            <Button key={variable} onClick={() => addSymbol(variable)}>
              {variable}
            </Button>
          ))}
        </div>

        <Button onClick={addVariable} className="bg-green-600 mt-4">
          + Agregar Variable
        </Button>

        <Button onClick={generateTruthTable} className="bg-blue-600 mt-4">
          Generar Tabla de Verdad
        </Button>

        <Button onClick={deleteInput} className="bg-blue-600 mt-4">
          Borrar
        </Button>

        {truthTable.length > 0 && (
          <table className="truth-table mt-4 border-collapse border border-gray-300">
            <thead>
              <tr>
                {(() => {
                  const allKeys = Object.keys(truthTable[0]);

                  // 🔹 Separar variables y expresiones
                  const variableKeys = allKeys.filter(key => /^[a-zA-Z]$/.test(key)).sort();
                  const expressionKeys = allKeys.filter(key => !/^[a-zA-Z]$/.test(key));

                  // 🔹 Identificar la expresión completa ingresada por el usuario
                  const mainResult = expressionKeys.includes(expression) ? expression : expressionKeys[expressionKeys.length - 1];

                  // 🔹 Ordenar subexpresiones basándose en la cantidad de operadores lógicos
                  const filteredExpressions = expressionKeys.filter(exp => exp !== mainResult).sort((a, b) => a.length - b.length);

                  // 🔹 Orden final: Variables -> Expresiones intermedias -> Resultado final
                  const orderedKeys = [...variableKeys, ...filteredExpressions, mainResult];

                  return orderedKeys.map((key) => (
                    <th key={key} className="border border-gray-300 p-2 text-center font-semibold">
                      {key
                        .replace(/not\s*\(([^)]+)\)/g, "¬$1")  // 🔹 Convierte "not(p)" en "¬p"
                        .replace(/\s*or\s*/g, " ∨ ")  // 🔹 Convierte "or" en "∨"
                        .replace(/\s*and\s*/g, " ∧ ") // 🔹 Convierte "and" en "∧"
                        .replace(/\s*->\s*/g, " → ")  // 🔹 Convierte "->" en "→"
                        .replace(/\s*<->\s*/g, " ↔ ") // 🔹 Convierte "<->" en "↔"
                        .replace(/\(\s*([^)]*)\s*\)/g, "($1)") // 🔹 Elimina paréntesis innecesarios
                      }
                    </th>
                  ));
                })()}
              </tr>
            </thead>
            <tbody>
              {truthTable.map((row, index) => (
                <tr key={index}>
                  {(() => {
                    const allKeys = Object.keys(row);
                    const variableKeys = allKeys.filter(key => /^[a-zA-Z]$/.test(key));
                    const expressionKeys = allKeys.filter(key => !/^[a-zA-Z]$/.test(key));

                    const mainResult = expressionKeys.find(exp => exp === expression) || expressionKeys[expressionKeys.length - 1];
                    const filteredExpressions = expressionKeys.filter(exp => exp !== mainResult).sort((a, b) => a.length - b.length);

                    const orderedKeys = [...variableKeys, ...filteredExpressions, mainResult];

                    return orderedKeys.map((key, i) => (
                      <td key={i} className="border border-gray-300 p-2 text-center">
                        {row[key]}
                      </td>
                    ));
                  })()}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}