import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PublicNavBar } from '../../components/common/PublicNavBar';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch event details from API
    // For now, just simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [id]);

  return (
    <div>
      <PublicNavBar />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Detalji događaja #{id}</h1>
        {loading ? (
          <p>Učitavanje...</p>
        ) : (
          <div>
            <p>Ovde će biti prikazani detalji događaja, komentari, dugme za RSVP, itd.</p>
            <p>Implementirati prema specifikaciji: naslov, opis, datum, lokaciju, autor, kategoriju, tagove, komentare...</p>
          </div>
        )}
      </div>
    </div>
  );
};