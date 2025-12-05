import { AlertTriangle, Terminal } from 'lucide-react';

export function ConfigErrorScreen() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
            <div className="max-w-xl w-full bg-card border rounded-xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 text-destructive mb-6">
                    <AlertTriangle className="w-10 h-10" />
                    <h1 className="text-2xl font-bold">Configuração Ausente</h1>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                    O aplicativo não conseguiu se conectar ao Firebase porque as chaves de API não foram encontradas no build atual.
                </p>

                <div className="bg-background rounded-lg p-4 border font-mono text-sm mb-6 overflow-x-auto">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <Terminal className="w-4 h-4" />
                        <span>Diagnóstico:</span>
                    </div>
                    <p className="text-muted-foreground">VITE_FIREBASE_API_KEY: <span className="text-destructive">undefined</span></p>
                    <p className="text-muted-foreground">VITE_FIREBASE_PROJECT_ID: <span className="text-destructive">undefined</span></p>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <h3 className="text-primary font-semibold mb-2">Como corrigir (GitHub Pages):</h3>
                    <p className="text-sm text-primary/80 mb-3">
                        O GitHub Actions ou o ambiente onde o build foi gerado não tinha acesso ao arquivo <code className="bg-primary/20 px-1 py-0.5 rounded text-primary">.env</code>.
                    </p>
                    <ol className="list-decimal list-inside text-sm text-primary/80 space-y-2">
                        <li>No seu computador local (onde está o .env), rode:</li>
                        <code className="block bg-secondary p-2 rounded mt-1 select-all cursor-pointer hover:bg-secondary/80 transition-colors">npm run build:docs</code>
                        <li>Faça commit e push da pasta <code className="bg-primary/20 px-1 py-0.5 rounded text-primary">docs/</code> gerada.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
