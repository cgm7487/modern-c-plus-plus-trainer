import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Code, ChevronRight, Play } from 'lucide-react';
import MarkdownRenderer, { categoryNames } from '../components/MarkdownRenderer';
import CodeEditor from '../components/CodeEditor';
import { topics } from '../data/topics';

function TopicPage() {
  const { id } = useParams();
  const topic = topics.find((t) => String(t.id) === id);

  if (!topic) {
    return (
      <div className="not-found">
        <h2>找不到此主題</h2>
        <p>
          您所尋找的主題不存在。
          <Link to="/"> 返回首頁</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="topic-page">
      <div className="topic-page-header">
        <div className="breadcrumb">
          <Link to="/">首頁</Link>
          <ChevronRight size={14} />
          <span>{categoryNames[topic.category] || topic.category}</span>
          <ChevronRight size={14} />
          <span>{topic.title}</span>
        </div>
        <h1>{topic.title}</h1>
        <div className="topic-meta">
          <span className="topic-card-badge" data-category={topic.category}>
            {categoryNames[topic.category] || topic.category}
          </span>
          <span
            className={`topic-card-difficulty ${topic.difficulty}`}
            style={{ fontSize: '0.85rem' }}
          >
            {topic.difficulty === 'beginner'
              ? '入門'
              : topic.difficulty === 'intermediate'
              ? '中等'
              : '進階'}
          </span>
        </div>
      </div>

      <div className="topic-page-content">
        {/* Content Section */}
        <section className="topic-section">
          <h2 className="topic-section-title">
            <BookOpen size={20} />
            教學內容
          </h2>
          <MarkdownRenderer content={topic.content} />
        </section>

        {/* Code Example Section */}
        {topic.codeExample && (
          <section className="topic-section">
            <h2 className="topic-section-title">
              <Code size={20} />
              程式範例
            </h2>
            <CodeEditor initialCode={topic.codeExample} />
          </section>
        )}

        {/* Exercise Link */}
        {topic.exercise && (
          <section className="topic-section">
            <h2 className="topic-section-title">
              <Play size={20} />
              動手練習
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {topic.exercise.description || '透過實作練習來鞏固所學的概念。'}
            </p>
            <Link
              to={`/exercise/${topic.id}`}
              className="btn-run"
              style={{ display: 'inline-flex', textDecoration: 'none' }}
            >
              <Play size={14} />
              前往練習
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

export default TopicPage;
