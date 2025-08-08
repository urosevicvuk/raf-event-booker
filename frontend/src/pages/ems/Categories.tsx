import { Link } from 'react-router-dom';

export const Categories: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/ems">← Nazad na Dashboard</Link>
      </div>
      <h1>Upravljanje kategorijama</h1>
      <p>Ovde će biti implementirana tabela kategorija sa opcijama dodavanja, izmene i brisanja.</p>
      <p>Prema specifikaciji: tabela sa nazivom i opisom, akcije za dodavanje/izmenu/brisanje.</p>
    </div>
  );
};