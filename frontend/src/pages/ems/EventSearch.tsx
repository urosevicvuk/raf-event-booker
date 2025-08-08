import { Link } from 'react-router-dom';

export const EventSearch: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/ems">← Nazad na Dashboard</Link>
      </div>
      <h1>Pretraga događaja</h1>
      <p>Polje za unos teksta - sistem pretražuje po naslovu ili po opisu događaja.</p>
      <p>Rezultat se prikazuje u tabeli, uz paginaciju, na isti način kao i za "Događaji".</p>
    </div>
  );
};