import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `- **30-Sekunden-Selbsttest (letzte Woche, Ja/Nein)**
  - Unter 7 h Schlaf an ≥3 Nächten?
  - Späte Commits/On-Call nach 22 Uhr?
  - Fixe Meetings, die in einer Zeitzone nach 21 Uhr liegen?
  - Koffein nach 16 Uhr an ≥3 Tagen?
  - Gereiztheit/mehr Rework nach späten Merges?
- **Score:** Zähle deine Ja-Antworten (0–5)
- **Wenn Score ≥2: wähle 1 Sofortmaßnahme**
  - No‑Late‑Merge‑Cutoff (z. B. 18–19 Uhr)
  - Rotierende Meetingzeiten/mehr Async
  - Post‑Call‑Rest + Buddy bei Nacht‑Changes
- **Teilen:** Zahl 0–5 jetzt in den Chat oder per Handzeichen
- Hinweis: Persistente Tagesschläfrigkeit medizinisch abklären
\`\`\`mermaid
flowchart LR
A["Fragen beantworten"] -->|"Score 0–1"| B["Beobachten & Retro mit Fatigue-Lens"]
A -->|"Score 2–3"| C["Sofortmaßnahme wählen"]
A -->|"Score >=4"| D["FRM-Check, Cutoffs & Escalation"]
\`\`\``;
  const mermaidRef = useRef(0);
  
  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#667eea',
        primaryTextColor: '#fff',
        primaryBorderColor: '#7c3aed',
        lineColor: '#5a67d8',
        secondaryColor: '#764ba2',
        tertiaryColor: '#667eea',
        background: '#1a202c',
        mainBkg: '#2d3748',
        secondBkg: '#4a5568',
        tertiaryBkg: '#718096',
        textColor: '#fff',
        nodeTextColor: '#fff',
      }
    });
    
    // Find and render mermaid diagrams
    const renderDiagrams = async () => {
      const diagrams = document.querySelectorAll('.language-mermaid');
      for (let i = 0; i < diagrams.length; i++) {
        const element = diagrams[i];
        const graphDefinition = element.textContent;
        const id = `mermaid-${mermaidRef.current++}`;
        
        try {
          const { svg } = await mermaid.render(id, graphDefinition);
          element.innerHTML = svg;
          element.classList.remove('language-mermaid');
          element.classList.add('mermaid-rendered');
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      }
    };
    
    renderDiagrams();
  }, [markdown]);
  
  return (
    <div className="slide markdown-slide">
      <h1>Mini‑Selbsttest: Fatigue‑Risiken im eigenen Team erkennen</h1>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            // Handle inline code
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            
            // Handle mermaid diagrams
            if (language === 'mermaid') {
              return (
                <pre className="language-mermaid">
                  <code>{String(children).replace(/\n$/, '')}</code>
                </pre>
              );
            }
            
            // Handle code blocks with syntax highlighting
            if (language) {
              return (
                <SyntaxHighlighter
                  language={language}
                  style={atomDark}
                  showLineNumbers={true}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }
            
            // Default code block without highlighting
            return (
              <pre>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}