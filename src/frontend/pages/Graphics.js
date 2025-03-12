import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Menu, User } from "lucide-react";

const dataBar = [
  { name: "", value1: 60, value2: 40 },
  { name: "", value1: 50, value2: 50 },
  { name: "", value1: 55, value2: 48 }
];

const dataLine = [
  { name: "", value1: 70, value2: 50 },
  { name: "", value1: 80, value2: 60 },
  { name: "", value1: 90, value2: 55 }
];

const Graphics = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col p-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="StudyBot Logo" className="w-12 h-12" />
          <h1 className="text-lg font-bold">STUDYBOT</h1>
        </div>
        <nav className="mt-6">
          <button className="block w-full text-left px-4 py-2 bg-teal-600 rounded mb-2">Inicio</button>
          <button className="block w-full text-left px-4 py-2 bg-teal-600 rounded mb-2">Calendario</button>
          <button className="block w-full text-left px-4 py-2 bg-teal-400 rounded mb-2">Tareas Pendientes</button>
          <button className="block w-full text-left px-4 py-2 bg-teal-600 rounded mb-2">Exámenes</button>
          <button className="block w-full text-left px-4 py-2 bg-teal-600 rounded">Progreso Académico</button>
        </nav>
        <div className="mt-auto flex items-center space-x-2 p-4">
          <User className="w-6 h-6" />
          <span>Jofesina Sanchez</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-xl font-semibold mb-4">Progreso Académico</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Calificaciones */}
          <Card className="p-4">
            <h3 className="text-md font-medium">Calificaciones</h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={dataBar}>
                <XAxis hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value1" fill="#48b4ac" />
                <Bar dataKey="value2" fill="#c28989" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          {/* Rendimiento */}
          <Card className="p-4">
            <h3 className="text-md font-medium">Rendimiento</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={dataLine}>
                <XAxis hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value1" stroke="#48b4ac" />
                <Line type="monotone" dataKey="value2" stroke="#c28989" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          {/* Tiempo dedicado */}
          <Card className="p-4">
            <h3 className="text-md font-medium">Tiempo dedicado</h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={dataBar}>
                <XAxis hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value1" fill="#48b4ac" />
                <Bar dataKey="value2" fill="#c28989" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          {/* Asistencia a clases */}
          <Card className="p-4">
            <h3 className="text-md font-medium">Asistencia a clases</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={dataLine}>
                <XAxis hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value1" stroke="#48b4ac" />
                <Line type="monotone" dataKey="value2" stroke="#c28989" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Graphics;
