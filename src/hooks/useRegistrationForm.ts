import { useState } from 'react';
import { formatPhoneNumber } from '@/lib/utils';

export interface RegisterFormData {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  dob: string;
  referralCode: string;
}

interface UseRegistrationFormProps {
  onRegister: (data: RegisterFormData) => void;
}

export function useRegistrationForm({ onRegister }: UseRegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    referralCode: '',
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
    if (localError) setLocalError(null);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'email':
        if (!value) return 'Preencha este campo';
        if (!validateEmail(value)) return 'Email inválido';
        return null;
      case 'password':
        if (!value) return 'Preencha este campo';
        if (value.length < 6) return 'A senha deve ter no mínimo 6 caracteres';
        return null;
      case 'confirmPassword':
        if (!value) return 'Preencha este campo';
        if (value !== formData.password) return 'As senhas não coincidem';
        return null;
      case 'username':
        if (!value) return 'Preencha este campo';
        if (value.length < 3) return 'O usuário deve ter no mínimo 3 caracteres';
        return null;
      case 'phone':
        if (!value) return 'Preencha este campo';
        const phoneNumbers = value.replace(/\D/g, '');
        if (phoneNumbers.length < 10) return 'Telefone inválido';
        return null;
      case 'dob':
        if (!value) return 'Preencha este campo';
        return null;
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    const errors: Record<string, string | null> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof RegisterFormData] || '');
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      setLocalError(firstError || 'Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('As senhas não coincidem!');
      return;
    }

    if (!validateEmail(formData.email)) {
      setLocalError('Por favor, insira um email válido');
      return;
    }

    setLocalError(null);
    onRegister(formData);
  };

  return {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    localError,
    touched,
    setTouched,
    hasSubmitted,
    handlePhoneChange,
    validateField,
    handleSubmit,
  };
}
