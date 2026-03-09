import { getUser, setUser } from '@/lib/authStorage';
import type { AuthUser } from '@/types/auth';
import { useState } from 'react';

type UseDefaultPasswordPromptResult = {
  user: AuthUser | null;
  showChangePassword: boolean;
  handlePasswordChanged: () => void;
};

export function useDefaultPasswordPrompt(): UseDefaultPasswordPromptResult {
  const [user, setLayoutUser] = useState<AuthUser | null>(() => getUser());
  const [showChangePassword, setShowChangePassword] = useState(() => {
    if (!user) return false;
    const eligibleRole = user.namaRole === 'DOSEN' || user.namaRole === 'MAHASISWA';
    return eligibleRole && user.isDefaultPassword === true;
  });

  const handlePasswordChanged = () => {
    setShowChangePassword(false);
    if (!user) return;

    const nextUser = { ...user, isDefaultPassword: false };
    setUser(nextUser);
    setLayoutUser(nextUser);
  };

  return {
    user,
    showChangePassword,
    handlePasswordChanged,
  };
}
