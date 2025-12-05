import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { AlertTriangle, Terminal } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

function ConfigErrorScreen() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 text-amber-500 mb-6">
                    <AlertTriangle className="w-10 h-10" />
                    <h1 className="text-2xl font-bold">Configuração Ausente</h1>
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">
                    O aplicativo não conseguiu se conectar ao Firebase porque as chaves de API não foram encontradas no build atual.
                </p>

                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 font-mono text-sm mb-6 overflow-x-auto">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                        <Terminal className="w-4 h-4" />
                        <span>Diagnóstico:</span>
                    </div>
                    <p className="text-slate-400">VITE_FIREBASE_API_KEY: <span className="text-red-400">undefined</span></p>
                    <p className="text-slate-400">VITE_FIREBASE_PROJECT_ID: <span className="text-red-400">undefined</span></p>
                </div>

                <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4">
                    <h3 className="text-blue-200 font-semibold mb-2">Como corrigir (GitHub Pages):</h3>
                    <p className="text-sm text-blue-300/80 mb-3">
                        O GitHub Actions ou o ambiente onde o build foi gerado não tinha acesso ao arquivo <code className="bg-blue-950 px-1 py-0.5 rounded text-white">.env</code>.
                    </p>
                    <ol className="list-decimal list-inside text-sm text-blue-300/80 space-y-2">
                        <li>No seu computador local (onde está o .env), rode:</li>
                        <code className="block bg-black/30 p-2 rounded mt-1 select-all cursor-pointer hover:bg-black/50 transition-colors">npm run build:docs</code>
                        <li>Faça commit e push da pasta <code className="bg-blue-950 px-1 py-0.5 rounded text-white">docs/</code> gerada.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (!isFirebaseConfigured) {
      return <ConfigErrorScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
