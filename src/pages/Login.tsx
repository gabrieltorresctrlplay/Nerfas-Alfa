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

  // Helper: Save user profile to Firestore
  const saveUserProfile = async (uid: string, data: any) => {
    await setDoc(doc(db, "users", uid), {
      username: data.username,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      referralCode: data.referralCode || "",
      createdAt: new Date().toISOString(),
      role: 'user' // default role
    });
  };

  // Helper: Resolve email from username if needed
  const resolveEmail = async (identifier: string): Promise<string | null> => {
    if (identifier.includes('@')) return identifier;

    // It's a username, query firestore
    const q = query(collection(db, "users"), where("username", "==", identifier));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().email;
    }
    return null;
  };

  // HANDLERS

  const handleLogin = async (identifier: string, password: string, remember: boolean) => {
    setError('');
    setLoading(true);
    try {
      // Set persistence
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);

      // Resolve username to email if necessary
      const email = await resolveEmail(identifier);
      if (!email) {
        throw new Error("Usuário não encontrado ou identificador inválido.");
      }

      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.message === "Usuário não encontrado ou identificador inválido.") {
        setError(err.message);
      } else if (err.code === 'auth/invalid-credential') {
        setError('Usuário/Email ou senha incorretos.');
      } else {
        setError('Falha ao entrar. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
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
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está sendo usado.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha é muito fraca (mínimo 6 caracteres).');
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
      setError('Erro ao conectar com Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (data: any) => {
    if (!googleUser) return;
    setError('');
    setLoading(true);
    try {
      await saveUserProfile(googleUser.uid, {
        ...data,
        email: googleUser.email,
        displayName: googleUser.displayName // Use google name or allow override? data has username logic.
        // We save username from form as 'username'. DisplayName can stay as Google's or update.
      });

      // Optional: Update auth profile with chosen username if desired
      // await updateProfile(auth.currentUser!, { displayName: data.username });

      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
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
