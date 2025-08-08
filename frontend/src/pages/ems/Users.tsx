import { Link } from 'react-router-dom';

export const Users: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/ems">← Nazad na Dashboard</Link>
      </div>
      <h1>Upravljanje korisnicima (Admin only)</h1>
      <p>Ovde će biti implementirana tabela korisnika sa akcijama:</p>
      <ul>
        <li>Dodaj novog korisnika (forma sa ime, prezime, email, tip, lozinka)</li>
        <li>Izmeni korisnika</li>
        <li>Aktiviraj/Deaktiviraj (samo za event creatore)</li>
      </ul>
    </div>
  );
};