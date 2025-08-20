import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

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
                <Mermaid chart={String(children).replace(/\n$/, '')} />
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