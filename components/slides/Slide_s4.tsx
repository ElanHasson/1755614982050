import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `- **Chronotyp ≠ Faulheit**: Innere Uhr steuert kognitive Hochphasen ("Eule" vs. "Lerche"); falsches Timing kostet Fokus und Code-Qualität
- **Sozialer Jetlag**: Tägliche Diskrepanz zwischen innerer und sozialer Zeit (≈1–2 h); mehr Schläfrigkeit, höhere Fehler- und Bugrate
- **Spätschichten/On-Call**: Verschobener REM, Schlafinertia; nächtliche Commits/Deploys sind im Schnitt fehleranfälliger
- **Praxis für Teams**: Deep-Work nach Chronotyp, rotierende Zeitzonen-Meetings, „No late merges“, Post-Call-Ruhe, helles Tageslicht/gedimmte Abende
\`\`\`js
// Chronotyp-gerechte Planung (vereinfachtes Beispiel)
const PLAN = {
  Lerche: { deepWork: ['09:00-11:00'], meetings: ['13:00-15:00'] },
  Eule: { deepWork: ['11:00-13:00','15:00-18:00'], meetings: ['10:00-11:00'] }
};
function planDay(chronotype='Lerche') {
  const p = PLAN[chronotype] ?? PLAN.Lerche;
  return { ...p, deployCutoff: '18:00' };
}
function shouldMerge(date=new Date()) {
  return date.getHours() < 18; // "No late merges" reduziert Fehlerdruck bei Müdigkeit
}
\`\`\`
\`\`\`mermaid
flowchart TD
C["Chronotyp ('Eule'/'Lerche')"] --> A["Arbeitszeiten (fixe Kernzeiten)"]
S["Spätschichten/On-Call"] --> A
A --> M["Misalignment: Sozialer Jetlag"]
M --> O1["Vigilanz ↓, Microsleeps ↑"]
M --> O2["Arbeitsgedächtnis ↓, Kreativität ↓"]
M --> O3["Bugs/Build‑Fails ↑, Teamspannung ↑"]
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
      <h1>Innere Uhr vs. Arbeitsalltag: Chronotypen, sozialer Jetlag und Spätschichten</h1>
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