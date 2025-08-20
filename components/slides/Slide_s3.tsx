import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

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