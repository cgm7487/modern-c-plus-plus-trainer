import React, { useState, useMemo } from 'react';
import { Layers, Shield, Settings, Code, Cpu } from 'lucide-react';
import TopicCard from '../components/TopicCard';
import { topics } from '../data/topics';

const categories = [
  { key: 'all', label: '全部主題', icon: Layers },
  { key: 'cpp11-syntax', label: 'C++11 語法', icon: Code },
  { key: 'cpp14-17-20', label: 'C++14/17/20', icon: Cpu },
  { key: 'best-practices', label: 'Best Practices', icon: Shield },
  { key: 'design-patterns', label: 'Design Patterns', icon: Settings },
  { key: 'system-programming', label: '系統程式設計', icon: Settings },
];

function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTopics = useMemo(() => {
    if (activeCategory === 'all') return topics;
    return topics.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>Modern C++ 學習平台</h1>
        <p>
          從 C++11 到 C++20，透過互動式教學與即時編譯練習，全面掌握現代 C++ 程式設計
        </p>
      </div>

      <div className="category-filters">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              className={`category-btn ${activeCategory === cat.key ? 'active' : ''}`}
              data-category={cat.key}
              onClick={() => setActiveCategory(cat.key)}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {filteredTopics.length > 0 ? (
        <div className="topics-grid">
          {filteredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="not-found">
          <h2>尚無主題</h2>
          <p>此分類目前沒有可用的學習主題</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
