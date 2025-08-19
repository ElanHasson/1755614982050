import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `- **Schlafbedarf**: Erwachsene brauchen 7–9 h/Nacht (AASM); <7 h erhöht Leistungs- und Gesundheitsrisiken; 14 Tage mit 6 h ≈ eine durchwachte Nacht; 17 h wach ≈ 0,05% BAC
- **Schlafarchitektur**: NREM (N1/N2/**N3**=Tiefschlaf) festigt Wissen & Synapsen; **REM** verknüpft weit, fördert Kreativität & emotionale Integration – beides direkt relevant fürs Coden
- **Auswirkung auf Dev-Leistung**: Weniger Vigilanz → mehr Null-Checks/Off-by-One-Fehler; schwächeres Arbeitsgedächtnis → Kontextverluste; weniger REM → weniger „Aha“-Momente beim Debugging
- **Rhythmus & Timing**: Chronotypen („Eule“/„Lerche“) beachten; anspruchsvolle Aufgaben zu Hochphasen; späte Commits/Deploys meiden – nachts steigt Bug-Wahrscheinlichkeit
- **Powernap**: 10–20 min (vor 15 Uhr) steigern Wachheit ohne starke Schlafinertia; länger = Risiko für Benommenheit

\`\`\`mermaid
flowchart TD
  Sleep[Schlaf] --> NREM[NREM]
  NREM --> N3["N3 (Tiefschlaf)"]
  N3 --> Learn["Deklaratives Lernen/Konsolidierung"]
  Learn --> DevMem["Code-Verständnis/Architektur im Kopf"]
  Sleep --> REM[REM]
  REM --> Assoc["Assoziatives Denken/Kreativität"]
  Assoc --> DevInsight["Debugging-Insights/Design-Ideen"]
  Lack["Schlafmangel"] --> Effects["Vigilanz↓ • Fehler↑ • Stimmungsschwankungen"]
  Effects --> Outcomes["PR-Rework/Bug-Rate↑"]
\`\`\`

\`\`\`sh
# .git/hooks/pre-commit (Beispiel): Warnen vor späten Commits
#!/bin/sh
hour=$(date +%H)
if [ "$hour" -ge 19 ] || [ "$hour" -lt 7 ]; then
  echo "Hinweis: Späte Commits sind im Schnitt fehleranfälliger. Review am Morgen?"
  printf "Trotzdem committen? [y/N] "
  read ans
  case "$ans" in
    [yY]*) exit 0 ;;
    *) echo "Commit abgebrochen. Schlaf zuerst."; exit 1 ;;
  esac
fi
exit 0
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
      <h1>Schlaf 101 für Entwickler:innen: Bedarf, Architektur, REM vs. Tiefschlaf</h1>
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