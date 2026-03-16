import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Terminal, Code } from 'lucide-react';

function CodeEditor({ initialCode = '', onOutput }) {
  const [code, setCode] = useState(initialCode);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  async function handleCompile() {
    setIsRunning(true);
    setOutput('');
    setIsError(false);

    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, input }),
      });

      const data = await response.json();

      if (data.compilationError) {
        setOutput(data.compilationError);
        setIsError(true);
        if (onOutput) onOutput({ stdout: '', stderr: data.compilationError, success: false });
      } else if (data.stderr && data.stderr.trim()) {
        setOutput(data.stderr);
        setIsError(true);
        if (onOutput) onOutput({ stdout: data.stdout || '', stderr: data.stderr, success: false });
      } else {
        setOutput(data.stdout || '(無輸出)');
        setIsError(false);
        if (onOutput) onOutput({ stdout: data.stdout || '', stderr: '', success: true });
      }
    } catch (err) {
      setOutput('編譯伺服器連線失敗: ' + err.message);
      setIsError(true);
      if (onOutput) onOutput({ stdout: '', stderr: err.message, success: false });
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="code-editor-section">
      <div className="editor-wrapper">
        <div className="editor-toolbar">
          <div className="editor-toolbar-left">
            <Code size={16} />
            <span>C++ 編輯器</span>
          </div>
          <button
            className={`btn-run ${isRunning ? 'running' : ''}`}
            onClick={handleCompile}
            disabled={isRunning}
          >
            <Play size={14} />
            {isRunning ? '編譯中...' : '編譯並執行'}
          </button>
        </div>
        <Editor
          height="360px"
          language="cpp"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
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
      </div>

      <div className="input-section">
        <label>標準輸入 (stdin)</label>
        <textarea
          className="input-textarea"
          placeholder="在此輸入程式的標準輸入資料..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
        />
      </div>

      <div className="output-panel">
        <div className="output-header">
          <Terminal size={16} />
          <span>執行結果</span>
        </div>
        <div
          className={`output-body ${isError ? 'error' : ''} ${!output ? 'empty' : ''}`}
        >
          {output || '點擊「編譯並執行」查看輸出結果'}
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
