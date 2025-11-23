// src/App.jsx (React Web)
import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css'; // Suponiendo que vas a usar CSS
const DigimonContext = createContext();

export default function App() {
  const [tab, setTab] = useState('menu');
  const [digimons, setDigimons] = useState([]);
  const [selectedDigimon, setSelectedDigimon] = useState(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  useEffect(() => {
    fetch('https://digimon-api.vercel.app/api/digimon')
      .then((res) => res.json())
      .then(setDigimons)
      .catch(console.error);
  }, []);

  const filtered = digimons.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) &&
      (levelFilter ? d.level === levelFilter : true)
  );

  const renderTab = () => {
    switch (tab) {
      case 'menu':
        return <Menu />;
      case 'lista':
        return <Lista digimons={digimons} />;
      case 'buscar':
        return (
          <Buscador
            search={search}
            setSearch={setSearch}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            filtered={filtered}
          />
        );
      case 'detalle':
        return <Detalle />;
      case 'original':
        return <Original />;
      case 'info':
        return <Info />;
      default:
        return <Menu />;
    }
  };

  return (
    <DigimonContext.Provider
      value={{ selectedDigimon, setSelectedDigimon, digimons }}
    >
      <div className="container">
        <header className="header">
          <h1 className="title">Digimon Explorer</h1>
          <div className="tabs">
            {['menu', 'lista', 'buscar', 'detalle', 'original', 'info'].map(
              (t) => (
                <button
                  key={t}
                  className={`tab-button ${tab === t ? 'active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t.toUpperCase()}
                </button>
              )
            )}
          </div>
        </header>

        <main className="content">{renderTab()}</main>

        <footer className="footer">
          <small>© 2025 Digimon Explorer — API: digimon-api.vercel.app</small>
        </footer>
      </div>
    </DigimonContext.Provider>
  );
}

// Componentes adaptados:

function Menu() {
  return (
    <div className="menu">
      <h2>Bienvenido al mundo Digimon</h2>
      <p>Explora todos los Digimon disponibles, filtra por nivel, busca tus favoritos y descubre sus detalles. 💜</p>
    </div>
  );
}

function Lista({ digimons }) {
  const { setSelectedDigimon } = useContext(DigimonContext);
  return (
    <div className="grid">
      {digimons.map((d) => (
        <div
          key={d.name}
          className="card"
          onClick={() => setSelectedDigimon(d)}
        >
          <img src={d.img} alt={d.name} className="image" />
          <p className="digimon-name">{d.name}</p>
        </div>
      ))}
    </div>
  );
}

function Buscador({ search, setSearch, levelFilter, setLevelFilter, filtered }) {
  const levels = [
    'Fresh',
    'In Training',
    'Rookie',
    'Champion',
    'Ultimate',
    'Mega',
  ];
  const { setSelectedDigimon } = useContext(DigimonContext);

  return (
    <div className="buscador">
      <input
        type="text"
        placeholder="🔍 Buscar Digimon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input"
      />
      <select
        value={levelFilter}
        onChange={(e) => setLevelFilter(e.target.value)}
        className="select"
      >
        <option value="">Todos los niveles</option>
        {levels.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      <div className="grid">
        {filtered.map((d) => (
          <div
            key={d.name}
            className="card"
            onClick={() => setSelectedDigimon(d)}
          >
            <img src={d.img} alt={d.name} className="image" />
            <p>{d.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Detalle() {
  const { selectedDigimon } = useContext(DigimonContext);
  if (!selectedDigimon)
    return <p className="empty-text">Selecciona un Digimon desde la lista.</p>;

  return (
    <div className="detalle">
      <img
        src={selectedDigimon.img}
        alt={selectedDigimon.name}
        className="detalle-img"
      />
      <h2 className="subtitle">{selectedDigimon.name}</h2>
      <p>Nivel: {selectedDigimon.level}</p>
    </div>
  );
}

function Original() {
  const { digimons } = useContext(DigimonContext);
  const [cantidad, setCantidad] = useState(1);
  const [generados, setGenerados] = useState([]);

  const generar = () => {
    const nuevos = [];
    for (let i = 0; i < cantidad; i++) {
      const random = digimons[Math.floor(Math.random() * digimons.length)];
      nuevos.push(random);
    }
    setGenerados(nuevos);
  };

  return (
    <div className="original">
      <h2>Generador de Digimones</h2>
      <input
        type="number"
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
        className="input-number"
        min="1"
      />
      <button onClick={generar} className="button">
        Generar
      </button>

      <div className="grid">
        {generados.map((d, i) => (
          <div key={i} className="card">
            <img src={d.img} alt={d.name} className="image" />
            <p>{d.name}</p>
            <p className="level">{d.level}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className="info">
      <h2>Sobre la App</h2>
      <p>
        Esta aplicación usa la API pública de Digimon para mostrar información detallada de cada criatura. 🌌
      </p>
      <p className="author">Desarrollado por: RUBEN GONZÁLEZ 💜</p>
    </div>
  );
}
