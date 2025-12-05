import { render } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { describe, it, expect, vi } from 'vitest';

describe('LoginForm', () => {
  it('should have an input of type text for the email/username field to allow usernames', () => {
    const { getByLabelText } = render(
      <LoginForm
        onSwitchToRegister={vi.fn()}
        onGoogleLogin={vi.fn()}
        onLogin={vi.fn()}
        onForgotPassword={vi.fn()}
        loading={false}
        error=""
      />
    );

    const input = getByLabelText(/Email ou Usuário/i);
    // It is currently 'email', which prevents plain usernames.
    // We expect it to be 'text' to allow both.
    expect(input).toHaveAttribute('type', 'text');
  });
});
