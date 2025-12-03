import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export function Dashboard() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'settings'>('home');

  // Estados das Configurações
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');

  // Carregar configurações salvas
  useEffect(() => {
    const savedMsg = localStorage.getItem('nerf_sys_msg');
    if (savedMsg) setSystemMessage(savedMsg);
    
    const savedNotif = localStorage.getItem('nerf_notif');
    if (savedNotif) setNotificationsEnabled(savedNotif === 'true');
  }, []);

  // Salvar mensagem
  const handleSaveMessage = () => {
    localStorage.setItem('nerf_sys_msg', systemMessage);
    alert('Configuração salva localmente.');
  };

  // Toggle Notificações
  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem('nerf_notif', String(newState));
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-300 flex font-sans">
      {/* Sidebar "Triste" */}
      <aside className="w-64 bg-[#1E293B] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Alfa Nerf <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded ml-2 text-gray-400">v1.0</span>
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setCurrentView('home')}
            className={`w-full text-left px-4 py-2 rounded text-sm transition-colors ${currentView === 'home' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800/50 text-gray-400'}`}
          >
            Visão Geral
          </button>
          <button 
            onClick={() => setCurrentView('settings')}
            className={`w-full text-left px-4 py-2 rounded text-sm transition-colors ${currentView === 'settings' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800/50 text-gray-400'}`}
          >
            Configurações
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 mb-2">Logado como</div>
          <div className="text-sm font-medium text-gray-300 truncate mb-4" title={user?.email || ''}>
            {user?.email}
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="w-full text-xs border border-red-900/50 text-red-400 hover:bg-red-900/20 py-2 rounded transition-colors"
          >
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 bg-[#0F172A] p-8">
        {currentView === 'home' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Visão Geral</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1E293B] p-6 rounded border border-gray-800">
                <div className="text-gray-500 text-sm uppercase tracking-wider mb-1">Status do Sistema</div>
                <div className="text-green-500 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Operacional
                </div>
              </div>
              <div className="bg-[#1E293B] p-6 rounded border border-gray-800">
                <div className="text-gray-500 text-sm uppercase tracking-wider mb-1">Versão</div>
                <div className="text-white font-medium">Production-RC1</div>
              </div>
              <div className="bg-[#1E293B] p-6 rounded border border-gray-800">
                <div className="text-gray-500 text-sm uppercase tracking-wider mb-1">Uptime</div>
                <div className="text-white font-medium">99.9%</div>
              </div>
            </div>

            <div className="mt-8 p-8 border border-dashed border-gray-800 rounded flex flex-col items-center justify-center text-gray-600 h-64">
              <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <p>Nenhuma atividade recente registrada.</p>
            </div>
          </div>
        )}

        {currentView === 'settings' && (
          <div className="max-w-2xl mx-auto">
             <h1 className="text-2xl font-bold text-white mb-6">Configurações do Sistema</h1>
             
             <div className="bg-[#1E293B] rounded border border-gray-800 divide-y divide-gray-800">
               
               {/* Toggle Notifications */}
               <div className="p-6 flex items-center justify-between">
                 <div>
                   <div className="font-medium text-white">Notificações de Alerta</div>
                   <div className="text-sm text-gray-500">Receber alertas críticos por e-mail.</div>
                 </div>
                 <button 
                   onClick={toggleNotifications}
                   className={`w-12 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-blue-600' : 'bg-gray-700'}`}
                 >
                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notificationsEnabled ? 'left-7' : 'left-1'}`} />
                 </button>
               </div>

               {/* Maintenance Mode */}
               <div className="p-6 flex items-center justify-between">
                 <div>
                   <div className="font-medium text-white">Modo de Manutenção</div>
                   <div className="text-sm text-gray-500">Suspende o acesso público temporariamente.</div>
                 </div>
                 <button 
                   onClick={() => setMaintenanceMode(!maintenanceMode)}
                   className={`w-12 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-orange-500' : 'bg-gray-700'}`}
                 >
                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${maintenanceMode ? 'left-7' : 'left-1'}`} />
                 </button>
               </div>

               {/* System Message */}
               <div className="p-6">
                 <div className="font-medium text-white mb-2">Mensagem Global do Sistema</div>
                 <div className="text-sm text-gray-500 mb-3">Esta mensagem será exibida no cabeçalho de todos os usuários.</div>
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={systemMessage}
                     onChange={(e) => setSystemMessage(e.target.value)}
                     className="flex-1 bg-[#0F172A] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500"
                     placeholder="Ex: Manutenção programada às 22h"
                   />
                   <button 
                     onClick={handleSaveMessage}
                     className="bg-white hover:bg-gray-200 text-gray-900 px-4 py-2 rounded text-sm font-medium transition-colors"
                   >
                     Salvar
                   </button>
                 </div>
               </div>

             </div>
          </div>
        )}
      </main>
    </div>
  );
}