import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Play,
  CheckCircle,
  XCircle,
  Terminal,
  Code,
} from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { topics } from '../data/topics';

function ExercisePage() {
  const { id } = useParams();
  const topic = topics.find((t) => String(t.id) === id);

  const [testResults, setTestResults] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeValue, setCodeValue] = useState('');

  const exercise = topic?.exercise;
  const testCases = exercise?.testCases || [];

  const handleSubmit = useCallback(async () => {
    if (!exercise || testCases.length === 0) return;

    setIsSubmitting(true);
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      try {
        const response = await fetch('/api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: codeValue,
            input: tc.input || '',
          }),
        });
        const data = await response.json();
        const actualOutput = (data.stdout || '').trim();
        const expectedOutput = (tc.expectedOutput || '').trim();
        const passed = actualOutput === expectedOutput;

        results.push({
          index: i,
          input: tc.input || '',
          expectedOutput,
          actualOutput,
          stderr: data.stderr || '',
          passed,
        });
      } catch (err) {
        results.push({
          index: i,
          input: tc.input || '',
          expectedOutput: (tc.expectedOutput || '').trim(),
          actualOutput: '',
          stderr: '編譯伺服器連線失敗: ' + err.message,
          passed: false,
        });
      }
    }

    setTestResults(results);
    setIsSubmitting(false);
  }, [exercise, testCases, codeValue]);

  if (!topic || !exercise) {
    return (
      <div className="not-found">
        <h2>找不到此練習</h2>
        <p>
          您所尋找的練習不存在。
          <Link to="/"> 返回首頁</Link>
        </p>
      </div>
    );
  }

  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  const initialCode = exercise.starterCode || topic.codeExample || '';

  return (
    <div className="exercise-page">
      <div className="exercise-page-header">
        <div className="breadcrumb">
          <Link to="/">首頁</Link>
          <ChevronRight size={14} />
          <Link to={`/topic/${topic.id}`}>{topic.title}</Link>
          <ChevronRight size={14} />
          <span>練習</span>
        </div>
        <h1>{exercise.title || `${topic.title} - 練習`}</h1>
        <p>{exercise.description}</p>
      </div>

      <div className="exercise-layout">
        {/* Exercise Description */}
        {exercise.instructions && (
          <div className="exercise-description">
            <h2 className="topic-section-title">
              <Terminal size={20} />
              題目說明
            </h2>
            <MarkdownRenderer content={exercise.instructions} />
          </div>
        )}

        {/* Code Editor */}
        <div className="exercise-editor-area">
          <div className="topic-section">
            <h2 className="topic-section-title">
              <Code size={20} />
              程式碼編輯
            </h2>
            <CodeEditorWithRef
              initialCode={initialCode}
              onCodeChange={setCodeValue}
            />
          </div>

          <div className="exercise-actions">
            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !codeValue.trim()}
            >
              <CheckCircle size={16} />
              {isSubmitting ? '驗證中...' : '提交驗證'}
            </button>
          </div>
        </div>

        {/* Test Cases */}
        <div className="test-cases-section">
          <h2 className="test-cases-title">
            <Terminal size={20} />
            測試案例 ({testCases.length} 個)
          </h2>

          {testCases.map((tc, index) => {
            const result = testResults.find((r) => r.index === index);
            const statusClass = result
              ? result.passed
                ? 'pass'
                : 'fail'
              : '';

            return (
              <div key={index} className={`test-case ${statusClass}`}>
                <div className="test-case-header">
                  <span className="test-case-label">測試 #{index + 1}</span>
                  {result && (
                    <span
                      className={`test-case-status ${
                        result.passed ? 'pass' : 'fail'
                      }`}
                    >
                      {result.passed ? (
                        <>
                          <CheckCircle size={14} /> 通過
                        </>
                      ) : (
                        <>
                          <XCircle size={14} /> 失敗
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="test-case-row">
                  <div className="test-case-field">
                    <div className="test-case-field-label">輸入</div>
                    <div className="test-case-field-value">
                      {tc.input || '(無輸入)'}
                    </div>
                  </div>
                  <div className="test-case-field">
                    <div className="test-case-field-label">預期輸出</div>
                    <div className="test-case-field-value">
                      {tc.expectedOutput}
                    </div>
                  </div>
                </div>

                {result && !result.passed && (
                  <div className="test-case-actual">
                    <div className="test-case-field">
                      <div className="test-case-field-label">實際輸出</div>
                      <div className="test-case-field-value wrong">
                        {result.actualOutput || result.stderr || '(無輸出)'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {totalCount > 0 && (
            <div className="test-summary">
              <span
                className={`test-summary-text ${
                  allPassed ? 'all-pass' : 'has-fail'
                }`}
              >
                {allPassed ? (
                  <>
                    <CheckCircle
                      size={16}
                      style={{ verticalAlign: 'middle', marginRight: '0.4rem' }}
                    />
                    全部通過！({passedCount}/{totalCount})
                  </>
                ) : (
                  <>
                    <XCircle
                      size={16}
                      style={{ verticalAlign: 'middle', marginRight: '0.4rem' }}
                    />
                    通過 {passedCount}/{totalCount} 個測試案例
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper around CodeEditor that tracks code changes
 * and exposes the current code value to the parent.
 */
function CodeEditorWithRef({ initialCode, onCodeChange }) {
  const [code, setCode] = useState(initialCode);

  React.useEffect(() => {
    setCode(initialCode);
    onCodeChange(initialCode);
  }, [initialCode]);

  return (
    <div>
      <div className="editor-wrapper">
        <div className="editor-toolbar">
          <div className="editor-toolbar-left">
            <Code size={16} />
            <span>C++ 編輯器</span>
          </div>
        </div>
        <EditorOnly
          code={code}
          onChange={(val) => {
            setCode(val);
            onCodeChange(val);
          }}
        />
      </div>
    </div>
  );
}

const LazyEditor = React.lazy(() => import('@monaco-editor/react'));

/** Minimal Monaco editor (no compile button, used in exercise page) */
function EditorOnly({ code, onChange }) {
  return (
    <React.Suspense fallback={<div className="loading-spinner">載入編輯器...</div>}>
      <LazyEditor
        height="360px"
        language="cpp"
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value || '')}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          lineNumbers: 'on',
          roundedSelection: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
        }}
      />
    </React.Suspense>
  );
}

export default ExercisePage;
