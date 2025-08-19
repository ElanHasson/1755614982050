import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `**Was Schlafmangel direkt kostet**
- Aufmerksamkeit/Vigilanz: mehr Lapses und Microsleeps; im Code: übersehene Null-Checks, Off-by-one-Fehler
- Arbeitsgedächtnis/Exekutive: weniger Kontext im Kopf; mehr Re-Reads, längere PR-Durchlaufzeiten, mehr Rework
- Kreativität/Insight: weniger neue Lösungswege; REM-Schlaf fehlt für Mustererkennung und „Aha“-Momente
- Emotion/Risiko: mehr Reizbarkeit, verzerrte Risikobewertung; härtere Reviews, schnellere Eskalationen
- Harte Fakten: 14 Tage à 6h → Leistungsdefizite ~ durchwachte Nacht; 17h wach ≈ 0,05% „BAC“-Äquivalent; späte Commits sind fehleranfälliger

\`\`\`python
# Beispiel: Null-Check übersehen bei Müdigkeit
# 02:13 Uhr-Commit – Crash in Produktion

def apply_discount(user):
    # BUG: kein Guard für user == None
    if user.is_premium and user.cart.total > 100:
        return user.cart.total * 0.9
    return user.cart.total  # AttributeError, wenn user None ist
\`\`\`

\`\`\`mermaid
flowchart TD
SL["Schlafmangel"] --> A["Aufmerksamkeit ↓ (Microsleeps, Lapses)"]
A --> WM["Arbeitsgedächtnis ↓ (Kontextverlust)"]
WM --> K["Kreativität/Insight ↓"]
K --> E["Emotionsregulation ↓ (Reizbarkeit, Risiko)"]
E --> O["Outcomes: Bugrate ↑, Codequalität ↓, Teamkonflikte ↑"]
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
      <h1>Was fehlt, wenn Schlaf fehlt: Aufmerksamkeit, Gedächtnis, Kreativität und Emotion unter Druck</h1>
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