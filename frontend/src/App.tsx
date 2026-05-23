
import './App.css'
function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white gap-4">
      <h1 className="text-4xl font-extrabold text-blue-500 animate-bounce">
        Tailwind Test!
      </h1>
      <p className="px-4 py-2 text-sm font-medium bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/50">
        If this button is purple with a rounded layout, Tailwind is 100% active.
      </p>
    </div>
  );
}

export default App;