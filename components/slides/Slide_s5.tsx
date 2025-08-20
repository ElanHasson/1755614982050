import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

export default function Slide() {
  const markdown = `- Nacht-Commit, On-Call-Fix, globale Meetings: drei typische Müdigkeits-Fallen im Dev-Alltag
- Wirkung von Schlafmangel: Vigilanz↓, Arbeitsgedächtnis↓, Fehler↑ – direkte Folgen für Code-Qualität & Patientensicherheit
- Demo: Bug aus Nacht-Commit, 03:00-Fatigue-Gate im On-Call, Meeting-Rotation als Schlafschutz
- Maßnahmen: No‑late‑merge, Two‑person rule nachts, Feature-Flags & Rollback, Follow‑the‑Sun/Rotation
- Healthcare-Kontext: Alarme/Workflows dürfen nicht an Müdigkeitsfehlern scheitern
\`\`\`javascript
// Nacht-Commit (01:13): Müdigkeitsfehler – Zuweisung statt Vergleich, Alarm wird nie gesendet
function isCritical(bp) {
  return bp.systolic > 180 || bp.diastolic > 120;
}
function triage(patient, bp) {
  if (patient = null) { // BUG: setzt patient auf null, Bedingung ist false → keine Alarmierung
    if (isCritical(bp)) {
      notifyCareTeam(patient.id, "CRITICAL BP");
    }
  }
}

// Fix am Morgen: klarer Null-Check und frühes Fail-Fast, dann Alarm-Logik
function triageFixed(patient, bp) {
  if (!patient) throw new Error("Patient missing");
  if (isCritical(bp)) {
    notifyCareTeam(patient.id, "CRITICAL BP");
  }
}
\`\`\`
\`\`\`bash
#!/usr/bin/env bash
# On-Call 03:00: kleines Fatigue-Gate (Karolinska Skala)
KSS=\${KSS:-8}
if [ "$KSS" -ge 7 ]; then
  echo "Fatigue risk hoch: Buddy-Review + Feature-Flag erforderlich"; exit 1
fi
echo "OK für Hotfix (KSS=$KSS)"
\`\`\`
\`\`\`mermaid
flowchart TD
A["Fixe 22-Uhr-Meetings über Zeitzonen"] --> B["Chronischer Schlafmangel in Region A"]
B --> C["Aufmerksamkeit sinkt, Fehler steigen"]
D["Rotation + asynchrone Updates"] --> E["Schlaffenster geschützt"]
E --> F["Qualität stabil, Stimmung besser"]
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>Praxisfälle aus dem Dev-Alltag: Nacht‑Commit, On‑Call‑Fix, globale Meetings</h1>
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