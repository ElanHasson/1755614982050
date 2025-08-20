import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

export default function Slide() {
  const markdown = `- Individuell: 7–9 h Schlaf priorisieren; Abendlicht dimmen/Night-Shift; Koffein ≥6–8 h vor dem Schlaf stoppen; Powernap 10–20 min; bei Insomnie/Tagesschläfrigkeit medizinisch abklären (CBT‑I, STOP‑Bang)
- Team: Sustainable Pace; Merge/Deploy‑Cutoff am Abend; „Two fresh eyes“ für heikle PRs; faire On‑Call‑Rotation mit Post‑Call‑Rest; rotierende Zeitzonen‑Meetings & asynchrone Updates
- Policy & Kultur: Right to Disconnect; Fatigue Risk Management (Schulung, Protokolle, blameless Reporting); schlaffreundliche Benefits (CBT‑I, Lichttherapie, Ruheräume); Datenethik statt Schlaf‑Überwachung
- Monitoring: Spät‑Commit/Deploy‑Metriken, Bug‑Rückläufe nach Nacht‑Changes; Retros mit Fatigue‑Lens; kurze Schläfrigkeitsskala (z. B. KSS) vor kritischen Aufgaben
- Nächste Schritte (14 Tage): Meeting‑Rotation starten, „Sunrise‑Merges“ testen, Nap‑Pilot; Erfolg messen: weniger nächtliche Changes, kürzere PR‑Durchlaufzeit, bessere subjektive Wachheit

\`\`\`bash
# .git/hooks/pre-push (ausführbar machen)
HOUR=$(date +%H)
if [ "$HOUR" -ge 19 ] || [ "$HOUR" -lt 7 ]; then
  echo "Warnung: Später Push erkannt. 'Sunrise-Merges' bevorzugen. Override mit PUSH_ANYWAY=1."
  if [ "$PUSH_ANYWAY" != "1" ]; then exit 1; fi
fi
\`\`\`

\`\`\`mermaid
flowchart LR
A["Individuell"] --> B["Team"]
B --> C["Policy & Organisation"]
C --> D["Messung & Feedback"]
D --> A
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>Handlungsplan für nachhaltige Produktivität: individuelle, Team‑ und Policy‑Schritte</h1>
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