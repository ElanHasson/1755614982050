import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `**Prinzipien**: schlank, freiwillig, anonymisiert; keine Schlaf‑Überwachung, nur Arbeitsprozess‑Signale
**Einfache Metriken (wöchentlich)**: % Commits 19–07 Uhr; Bugs/Hotfixes nach nächtlichen Changes; Merges außerhalb Kernzeit; Nutzung von Post‑Call‑Rest
**Alltagstaugliche Checks**: KSS‑Selbstcheck (≥7 = Risiko) vor kritischen Tasks; "Two fresh eyes" für riskante PRs; Cutoff 18–19 Uhr + Sunrise‑Merges; Fatigue‑Check im Incident‑Template
**Nutzung**: Trends statt Namen in Retros; kleine Experimente → Policies; Ziel: weniger Müdigkeitsfehler, bessere Code‑Qualität

\`\`\`bash
# .git/hooks/pre-commit (ausführbar machen)
#!/usr/bin/env bash
hour=$(date +%H)
if [ "$hour" -ge 19 ] || [ "$hour" -lt 7 ]; then
  echo "Es ist $hour Uhr. Spätcommit erkannt."
  read -r -p "Commit trotzdem? [y/N] " ans
  if [[ ! "$ans" =~ ^[Yy]$ ]]; then
    echo "Abgebrochen. Erstelle Draft-PR oder warte bis Morgen."
    exit 1
  fi
fi
\`\`\`

\`\`\`python
# late_commits.py – schlanke Teammetrik
import subprocess, datetime
from collections import Counter
log = subprocess.check_output([
    'git','log','--since=14.days','--pretty=format:%ct|%s'
], text=True).splitlines()
if not log:
    raise SystemExit('Keine Commits in den letzten 14 Tagen')
late, total, night_hotfix = 0, 0, 0
for line in log:
    ts_s, msg = line.split('|', 1)
    hour = datetime.datetime.fromtimestamp(int(ts_s)).hour
    total += 1
    is_late = hour >= 19 or hour < 7
    late += is_late
    if is_late and any(k in msg.lower() for k in ('hotfix','rollback')):
        night_hotfix += 1
print(f"Spät‑Commit‑Anteil: {late/total:.0%} (n={late}/{total})")
print(f"Nächtliche Hotfixes/Rollbacks: {night_hotfix}")
\`\`\`

\`\`\`mermaid
flowchart LR
A["Minimale Signale"] --> B["Wöchentliche Retro"]
B --> C["Kleines Experiment"]
C --> D["Policy oder zurückrollen"]
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
      <h1>Schlank messen statt überwachen: einfache Metriken und Checks</h1>
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