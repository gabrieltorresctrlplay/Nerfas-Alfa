import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { OnboardingForm } from '@/components/auth/OnboardingForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

type AuthView = 'login' | 'register' | 'forgot' | 'onboarding';

export function Login() {
  const [view, setView] = useState<AuthView>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<any>(null);

  const navigate = useNavigate();

  // Helper: Save user profile to Firestore with better error handling
  const saveUserProfile = async (uid: string, data: any) => {
    try {
        await setDoc(doc(db, "users", uid), {
            username: data.username,
            email: data.email,
            phone: data.phone,
            dob: data.dob,
            referralCode: data.referralCode || "",
            createdAt: new Date().toISOString(),
            role: 'user' // default role
        });
    } catch (err: any) {
        console.error("Critical: Failed to save user profile.", err);
        // We throw the error up so the calling function knows it failed,
        // OR we handle it if we want to allow 'zombie' users (not recommended).
        // For now, let's identify if it's a blocking issue.
        if (err.message && (err.message.includes("offline") || err.message.includes("network") || err.code === "unavailable")) {
             throw new Error("Erro de conexão com o banco de dados. Verifique sua internet ou se algum bloqueador de anúncios está impedindo o acesso.");
        }
        throw err;
    }
  };

  // Helper: Resolve email from username if needed
  const resolveEmail = async (identifier: string): Promise<string | null> => {
    if (identifier.includes('@')) return identifier;

    try {
        // It's a username, query firestore
        const q = query(collection(db, "users"), where("username", "==", identifier));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data().email;
        }
        return null;
    } catch (err: any) {
         console.error("Failed to resolve username:", err);
         if (err.code === "unavailable" || err.message?.includes("offline")) {
             throw new Error("Erro de conexão ao verificar usuário. Verifique se bloqueadores de anúncios estão ativos.");
         }
         return null;
    }
  };

  // HANDLERS

  const handleLogin = async (identifier: string, password: string, remember: boolean) => {
    if (!identifier || !password) {
        setError('Preencha todos os campos.');
        return;
    }
    setError('');
    setLoading(true);
    try {
      // Set persistence
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);

      // Resolve username to email if necessary
      let email = identifier;
      if (!identifier.includes('@')) {
         const resolved = await resolveEmail(identifier);
         if (!resolved) {
            // Note: If resolveEmail failed due to network error, it threw.
            // If it returned null, it means user not found.
            throw new Error("Usuário não encontrado ou identificador inválido.");
         }
         email = resolved;
      }

      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("Usuário não encontrado") || err.message.includes("bloqueadores"))) {
          setError(err.message);
      } else if (err.code === 'auth/invalid-credential') {
        setError('Usuário/Email ou senha incorretos.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Conta não encontrada.');
      } else {
        setError('Falha ao entrar. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    if (!data.username || !data.email || !data.password || !data.phone || !data.dob) {
        setError('Preencha todos os campos obrigatórios.');
        return;
    }
    setError('');
    setLoading(true);
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 2. Update Display Name
      await updateProfile(user, {
        displayName: data.username
      });

      // 3. Create Firestore Profile
      await saveUserProfile(user.uid, data);

      navigate('/');
    } catch (err: any) {
      console.error("Registration Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está sendo usado.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha é muito fraca (mínimo 6 caracteres).');
      } else if (err.code === 'auth/invalid-email') {
        setError('Formato de email inválido.');
      } else if (err.message && err.message.includes("bloqueadores")) {
          // If profile creation failed due to adblock, the user IS created in Auth.
          // We might want to warn them.
          setError("Conta criada, mas houve um erro ao salvar seu perfil (bloqueador de anúncios detectado?). Tente fazer login.");
          // Ideally, we would rollback (delete user), but let's keep it simple for now as per instructions.
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Already has profile
        navigate('/');
      } else {
        // Needs onboarding
        setGoogleUser(user);
        setView('onboarding');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
          setError('Login cancelado.');
      } else {
          setError('Erro ao conectar com Google. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (data: any) => {
    if (!googleUser) return;
    if (!data.username || !data.phone || !data.dob) {
        setError('Preencha todos os campos obrigatórios.');
        return;
    }
    setError('');
    setLoading(true);
    try {
      await saveUserProfile(googleUser.uid, {
        ...data,
        email: googleUser.email,
        displayName: googleUser.displayName
      });

      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("bloqueadores")) {
           setError(err.message);
      } else {
           setError('Erro ao salvar perfil.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email) {
        setError('Digite seu email.');
        return;
    }
    setError('');
    setMessage(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Link de redefinição enviado para o seu email!');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('Email não encontrado.');
      } else {
        setError('Erro ao enviar email.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render Logic
  return (
    <AuthLayout>
      {view === 'login' && (
        <LoginForm
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          onSwitchToRegister={() => setView('register')}
          onForgotPassword={() => setView('forgot')}
          loading={loading}
          error={error}
        />
      )}

      {view === 'register' && (
        <RegisterForm
          onRegister={handleRegister}
          onGoogleLogin={handleGoogleLogin}
          onSwitchToLogin={() => setView('login')}
          loading={loading}
          error={error}
        />
      )}

      {view === 'onboarding' && (
        <OnboardingForm
          onSubmit={handleOnboardingSubmit}
          loading={loading}
          email={googleUser?.email}
        />
      )}

      {view === 'forgot' && (
        <ForgotPasswordForm
          onSubmit={handleForgotPassword}
          onBack={() => { setView('login'); setMessage(null); setError(''); }}
          loading={loading}
          message={message}
          error={error}
        />
      )}
    </AuthLayout>
  );
}
