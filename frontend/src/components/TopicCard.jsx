import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Code } from 'lucide-react';
import { categoryNames } from './MarkdownRenderer';

const difficultyLabels = {
  beginner: '入門',
  intermediate: '中等',
  advanced: '進階',
};

function TopicCard({ topic }) {
  return (
    <Link to={`/topic/${topic.id}`} className="topic-card">
      <div className="topic-card-header">
        <span className="topic-card-badge" data-category={topic.category}>
          {categoryNames[topic.category] || topic.category}
        </span>
        <span className={`topic-card-difficulty ${topic.difficulty}`}>
          {difficultyLabels[topic.difficulty] || topic.difficulty}
        </span>
      </div>
      <h3>{topic.title}</h3>
      <p>{topic.description}</p>
      <div className="topic-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            <BookOpen size={13} />
            教學
          </span>
          {topic.exercise && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              <Code size={13} />
              練習
            </span>
          )}
        </div>
        <span className="topic-card-action">
          開始學習 <ChevronRight size={14} />
        </span>
      </div>
    </Link>
  );
}

export default TopicCard;
