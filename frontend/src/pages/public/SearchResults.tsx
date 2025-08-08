import { useSearchParams } from 'react-router-dom';
import { PublicNavBar } from '../../components/common/PublicNavBar';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div>
      <PublicNavBar />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Rezultati pretrage za: "{query}"</h1>
        <p>Ovde će biti prikazani rezultati pretrage sa paginacijom.</p>
      </div>
    </div>
  );
};