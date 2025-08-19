import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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