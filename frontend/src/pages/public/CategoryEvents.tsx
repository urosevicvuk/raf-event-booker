import { useParams } from 'react-router-dom';
import { PublicNavBar } from '../../components/common/PublicNavBar';

export const CategoryEvents: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <PublicNavBar />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Događaji u kategoriji #{id}</h1>
        <p>Ovde će biti prikazani svi događaji iz određene kategorije sa paginacijom.</p>
      </div>
    </div>
  );
};