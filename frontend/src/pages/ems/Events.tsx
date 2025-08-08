import { Link } from 'react-router-dom';

export const Events: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/ems">← Nazad na Dashboard</Link>
      </div>
      <h1>Upravljanje događajima</h1>
      <p>Ovde će biti implementirana tabela događaja sa paginacijom, sortirana po datumu kreiranja.</p>
      <p>Dugme "Dodaj novi događaj" i forme za kreiranje/izmenu događaja.</p>
      <p>Klik na naslov vodi na javnu platformu u novom tabu.</p>
    </div>
  );
};