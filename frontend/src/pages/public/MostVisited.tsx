import { PublicNavBar } from '../../components/common/PublicNavBar';

export const MostVisited: React.FC = () => {
  return (
    <div>
      <PublicNavBar />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Najposećeniji događaji</h1>
        <p>Ovde će biti prikazanih 10 događaja sa najvećim brojem pregleda u poslednjih 30 dana.</p>
      </div>
    </div>
  );
};