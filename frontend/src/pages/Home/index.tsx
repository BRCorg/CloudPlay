import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/templates/MainLayout';
import { Header } from '../../components/organismes/Header';
import { Footer } from '../../components/organismes/Footer';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import { Badge } from '../../components/atoms/Badge';
import './home.scss';

const FEATURED_GAME = {
  title: 'Cyber Legends 2077',
  description: 'Dive into a neon-lit dystopian future where technology and humanity collide. Experience the ultimate cyberpunk adventure.',
  image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=600&fit=crop',
  genres: ['Action', 'RPG', 'Open World'],
  rating: 4.8,
  players: '2.5M+'
};

const POPULAR_GAMES = [
  {
    id: 1,
    title: 'Space Warriors',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=500&fit=crop',
    genre: 'Action',
    players: '1.2M',
    rating: 4.5
  },
  {
    id: 2,
    title: 'Fantasy Realms',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=500&fit=crop',
    genre: 'RPG',
    players: '980K',
    rating: 4.7
  },
  {
    id: 3,
    title: 'Racing Thunder',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=500&fit=crop',
    genre: 'Racing',
    players: '750K',
    rating: 4.3
  },
  {
    id: 4,
    title: 'Battle Royale Pro',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=500&fit=crop',
    genre: 'Battle Royale',
    players: '3.5M',
    rating: 4.9
  },
  {
    id: 5,
    title: 'Mystery Manor',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=500&fit=crop',
    genre: 'Puzzle',
    players: '450K',
    rating: 4.4
  },
  {
    id: 6,
    title: 'Galactic Empire',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=500&fit=crop',
    genre: 'Strategy',
    players: '1.8M',
    rating: 4.6
  }
];

const CATEGORIES = [
  { name: 'Action', icon: '⚔️', count: 127 },
  { name: 'RPG', icon: '🎭', count: 89 },
  { name: 'Strategy', icon: '♟️', count: 64 },
  { name: 'Racing', icon: '🏎️', count: 45 },
  { name: 'Puzzle', icon: '🧩', count: 156 },
  { name: 'Sports', icon: '⚽', count: 78 }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout
      header={
        <Header
          onLogoClick={() => navigate('/')}
        />
      }
      footer={<Footer />}
      className="home"
    >
      {/* Hero Section */}
      <section className="home__hero">
        <div className="home__hero-bg">
          <div className="home__hero-overlay"></div>
        </div>

        <div className="home__hero-content">
          <Badge variant="warning" solid>🔥 Plateforme de Cloud Gaming</Badge>
          <Text as="h1" size="5xl" weight="bold" className="home__hero-title">
            CloudPlay
          </Text>
          <Text size="lg" color="secondary" className="home__hero-description">
            Jouez à vos jeux préférés depuis n'importe où, sans téléchargement.
            Partagez vos expériences et connectez-vous avec la communauté gaming.
          </Text>

          <div className="home__hero-tags">
            <Badge variant="info">☁️ Cloud Gaming</Badge>
            <Badge variant="secondary">🎮 Tous les jeux</Badge>
            <Badge variant="secondary">👥 Communauté</Badge>
          </div>

          <div className="home__hero-actions">
            <Button variant="primary" size="large" onClick={() => navigate('/signup')}>
              Commencer gratuitement
            </Button>
            <Button variant="outline" size="large" onClick={() => navigate('/login')}>
              Se connecter
            </Button>
          </div>
        </div>

        <div className="home__hero-visual">
          <div className="home__hero-cards">
            {POPULAR_GAMES.slice(0, 3).map((game, index) => (
              <div
                key={game.id}
                className="home__hero-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img src={game.image} alt={game.title} />
                <div className="home__hero-card-overlay">
                  <Text weight="bold">{game.title}</Text>
                  <Badge variant="success" size="small">⭐ {game.rating}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home__section">
        <div className="home__container">
          <Text as="h2" size="3xl" weight="bold" className="home__section-title">
            Browse by Genre
          </Text>

          <div className="home__categories">
            {CATEGORIES.map((category) => (
              <div key={category.name} className="home__category">
                <div className="home__category-icon">{category.icon}</div>
                <Text as="h3" weight="semibold" className="home__category-name">
                  {category.name}
                </Text>
                <Text size="sm" color="muted" className="home__category-count">
                  {category.count} games
                </Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Games */}
      <section className="home__section">
        <div className="home__container">
          <div className="home__section-header">
            <Text as="h2" size="3xl" weight="bold" className="home__section-title">
              Popular Games
            </Text>
            <Button variant="ghost">View All →</Button>
          </div>

          <div className="home__games-grid">
            {POPULAR_GAMES.map((game) => (
              <div
                key={game.id}
                className="home__game-card"
                onClick={() => navigate('/posts')}
              >
                <div className="home__game-image">
                  <img src={game.image} alt={game.title} />
                  <div className="home__game-overlay">
                    <Button variant="primary">Découvrir</Button>
                  </div>
                </div>

                <div className="home__game-info">
                  <Text as="h3" weight="semibold" className="home__game-title">
                    {game.title}
                  </Text>
                  <Text size="sm" color="muted" className="home__game-genre">
                    {game.genre}
                  </Text>

                  <div className="home__game-meta">
                    <Badge variant="success" size="small">⭐ {game.rating}</Badge>
                    <Badge variant="secondary" size="small">👥 {game.players}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
