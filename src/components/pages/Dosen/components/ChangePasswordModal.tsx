import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useChangePassword } from '../../SuperAdmin/Users/hooks/useChangePassword';

type Props = {
  open: boolean;
  nrp: string;
  userName?: string;
  onSuccess: () => void;
};

const toastIconSuccess = <Icon icon='lets-icons:check-fill' className='text-white text-lg shrink-0 mt-0.5' />;
const toastIconError = <Icon icon='lets-icons:check-fill' className='text-white text-lg shrink-0 mt-0.5 rotate-45' />;
const styleSuccess = { background: '#16a34a', color: '#fff', border: 'none', alignItems: 'flex-start' };
const styleError = { background: '#dc2626', color: '#fff', border: 'none', alignItems: 'flex-start' };

const REQUIREMENTS = [
  { test: (p: string) => p.length >= 8, label: 'Minimal 8 karakter' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'Mengandung huruf kapital (A–Z)' },
  { test: (p: string) => /[0-9]/.test(p), label: 'Mengandung angka (0–9)' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'Mengandung karakter spesial (!@#$...)' },
];

export default function ChangePasswordModal({ open, nrp, userName, onSuccess }: Props) {
  const { changePassword, loading } = useChangePassword();

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = useMemo(() => REQUIREMENTS.filter((r) => r.test(newPass)).length, [newPass]);

  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-500', 'bg-emerald-500'][strength];
  const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'][strength];
  const strengthText = ['', 'text-red-500', 'text-amber-500', 'text-blue-600', 'text-emerald-600'][strength];

  const passwordsMatch = confirmPass === '' || newPass === confirmPass;

  // Minimal harus "Kuat" (score >= 3) + cocok + tidak sama dengan NRP
  const canSubmit = !loading && strength >= 3 && newPass === confirmPass && newPass !== nrp;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      await changePassword({ passwordLama: nrp, passwordBaru: newPass });
      toast.success('Password Berhasil Diubah!', {
        description: 'Gunakan password baru kamu untuk login berikutnya.',
        icon: toastIconSuccess,
        style: styleSuccess,
        descriptionClassName: '!text-white/90',
        duration: 5000,
      });
      onSuccess();
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg: string = errorResponse?.response?.data?.message ?? errorResponse?.message ?? 'Terjadi kesalahan saat mengubah password.';
      const msgLower = msg.toLowerCase();
      let title = 'Gagal Mengubah Password!';
      let description = msg;
      if (msgLower.includes('password lama') || msgLower.includes('tidak cocok')) {
        title = 'Password Lama Tidak Cocok!';
        description = 'Password default (NRP) tidak cocok. Mungkin password sudah pernah diganti sebelumnya.';
      } else if (msgLower.includes('network') || msgLower.includes('timeout') || msgLower.includes('econnrefused')) {
        title = 'Koneksi Bermasalah!';
        description = 'Tidak dapat terhubung ke server. Periksa koneksi internet kamu.';
      }
      toast.error(title, {
        description,
        icon: toastIconError,
        style: styleError,
        descriptionClassName: '!text-white/90',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className='max-w-sm p-0 overflow-hidden rounded-2xl gap-0 [&>button]:hidden'>
        {/* Header */}
        <div className='px-8 pt-8 pb-5 text-center border-b'>
          <div className='w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4'>
            <Icon icon='mdi:lock-reset' className='text-2xl text-blue-700' />
          </div>
          <DialogTitle className='text-lg font-bold text-gray-900 text-center'>Ganti Password</DialogTitle>
          <DialogDescription className='text-sm text-gray-500 mt-1 leading-relaxed text-center'>Halo{userName ? `, ${userName}` : ''}! Demi keamanan akun, harap ganti password default kamu sekarang.</DialogDescription>
        </div>

        {/* Form */}
        <div className='px-8 py-6 space-y-4'>
          <div className='flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5'>
            <Icon icon='mdi:information-outline' className='text-amber-500 shrink-0' />
            <p className='text-xs text-amber-800'>
              Password default kamu adalah <strong>NRP ({nrp})</strong>
            </p>
          </div>

          {/* New password */}
          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-gray-700'>
              Password Baru <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <Input type={showNew ? 'text' : 'password'} value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder='Minimal kuat (3/4 kriteria)' className='pr-10' autoComplete='new-password' />
              <button
                type='button'
                onClick={() => setShowNew((v) => !v)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                tabIndex={-1}
                aria-label={showNew ? 'Sembunyikan password baru' : 'Tampilkan password baru'}
              >
                <Icon icon={showNew ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} />
              </button>
            </div>

            {/* Strength bar */}
            {newPass && (
              <div className='space-y-1 pt-0.5'>
                <div className='flex gap-1'>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-gray-200'}`} />
                  ))}
                </div>
                <div className='flex items-center justify-between'>
                  <p className={`text-xs font-semibold ${strengthText}`}>{strengthLabel}</p>
                  {strength < 3 && (
                    <p className='text-xs text-gray-400'>
                      Minimal harus <span className='font-semibold text-blue-600'>Kuat</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-gray-700'>
              Konfirmasi Password <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <Input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder='Ulangi password baru'
                className={`pr-10 transition-colors ${!passwordsMatch ? 'border-red-400 focus-visible:ring-red-300' : confirmPass && newPass === confirmPass ? 'border-emerald-400 focus-visible:ring-emerald-300' : ''}`}
                autoComplete='new-password'
              />
              <button
                type='button'
                onClick={() => setShowConfirm((v) => !v)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                tabIndex={-1}
                aria-label={showConfirm ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
              >
                <Icon icon={showConfirm ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} />
              </button>
            </div>
            {confirmPass && (
              <p className={`text-xs flex items-center gap-1 font-medium ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                <Icon icon={passwordsMatch ? 'mdi:check-circle' : 'mdi:close-circle'} />
                {passwordsMatch ? 'Password cocok' : 'Password tidak cocok'}
              </p>
            )}
          </div>

          {/* Requirements checklist */}
          <div className='rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 space-y-1.5'>
            {REQUIREMENTS.map((req, i) => {
              const ok = req.test(newPass);
              return (
                <div key={i} className='flex items-center gap-2 text-xs'>
                  <Icon icon={ok ? 'mdi:check-circle' : 'mdi:circle-outline'} className={`text-sm shrink-0 transition-colors ${ok ? 'text-emerald-500' : 'text-gray-300'}`} />
                  <span className={ok ? 'text-gray-700' : 'text-gray-400'}>{req.label}</span>
                </div>
              );
            })}
          </div>

          <Button onClick={handleSubmit} disabled={!canSubmit} className='w-full border-2 border-black shadow-[3px_3px_0_0_#000] gap-2 h-11 font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>
            {loading ? (
              <>
                <Icon icon='mdi:loading' className='animate-spin' />
                Menyimpan...
              </>
            ) : (
              <>
                <Icon icon='mdi:lock-check-outline' />
                Simpan Password Baru
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
