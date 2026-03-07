import { useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { useImportUsers } from "../hooks/useImportUsers";
import { useRoles } from "../hooks/useRoles";
import { useProgramStudi } from "../../ProgramStudi/hooks/useProgramStudi";
import type { CreateUserPayload, JenisKelamin, UserStatusBE } from "../types/user";

// ─── Types ────────────────────────────────────────────────────────────────────

type PreviewRow = {
  nrp: string;
  nama: string;
  angkatan: string;
  email: string;
  prodi: string;
  role: string;
  jenisKelamin: string;
  status: string;
  alamat: string;
  idProdi?: string;
  idRole?: string;
  errors: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type Step = "upload" | "preview" | "result";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLUMN_ALIASES: Record<string, keyof PreviewRow> = {
  nrp: "nrp",
  "no induk": "nrp",
  nama: "nama",
  "nama lengkap": "nama",
  angkatan: "angkatan",
  tahun: "angkatan",
  email: "email",
  "e-mail": "email",
  "program studi": "prodi",
  prodi: "prodi",
  "prog studi": "prodi",
  jurusan: "prodi",
  role: "role",
  jabatan: "role",
  "jenis kelamin": "jenisKelamin",
  jk: "jenisKelamin",
  kelamin: "jenisKelamin",
  status: "status",
  alamat: "alamat",
  address: "alamat",
};

// ─── Toast helpers ────────────────────────────────────────────────────────────

const toastIconSuccess = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />
);
const toastIconError = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const toastIconWarning = (
  <Icon icon="mdi:alert" className="text-white text-lg shrink-0 mt-0.5" />
);

const styleSuccess = { background: "#16a34a", color: "#fff", border: "none", alignItems: "flex-start" };
const styleError   = { background: "#dc2626", color: "#fff", border: "none", alignItems: "flex-start" };
const styleWarning = { background: "#d97706", color: "#fff", border: "none", alignItems: "flex-start" };

// ─── Parse helpers ────────────────────────────────────────────────────────────

const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();

function normalizeRow(rawRow: Record<string, any>): Partial<PreviewRow> {
  const result: Partial<PreviewRow> = {};
  for (const [rawKey, value] of Object.entries(rawRow)) {
    const mappedKey = COLUMN_ALIASES[norm(rawKey)];
    if (mappedKey) (result as any)[mappedKey] = String(value ?? "").trim();
  }
  return result;
}

function validateAndResolve(
  row: Partial<PreviewRow>,
  prodiList: any[],
  roleList: any[],
): PreviewRow {
  const errors: string[] = [];
  const nrp          = row.nrp ?? "";
  const nama         = row.nama ?? "";
  const angkatan     = row.angkatan ?? "";
  const email        = row.email ?? "";
  const prodi        = row.prodi ?? "";
  const role         = row.role ?? "";
  const jenisKelamin = row.jenisKelamin ?? "";
  const status       = row.status ?? "aktif";
  const alamat       = row.alamat ?? "";

  if (!nrp)      errors.push("NRP kosong");
  if (!nama)     errors.push("Nama kosong");
  if (!angkatan) errors.push("Angkatan kosong");
  if (!email)    errors.push("Email kosong");

  let idProdi: string | undefined;
  if (!prodi) {
    errors.push("Program Studi kosong");
  } else {
    const match = prodiList.find(
      (p) => norm(p.namaProdi ?? p.namaProgramStudi ?? p.nama ?? "") === norm(prodi),
    );
    idProdi = match ? String(match._id ?? match.id ?? "") : undefined;
    if (!idProdi) errors.push(`Prodi "${prodi}" tidak ditemukan`);
  }

  let idRole: string | undefined;
  if (!role) {
    errors.push("Role kosong");
  } else {
    const match = roleList.find((r) => norm(r.nama ?? r.name ?? "") === norm(role));
    idRole = match ? String(match._id ?? match.id ?? "") : undefined;
    if (!idRole) errors.push(`Role "${role}" tidak ditemukan`);
  }

  const jkNorm = norm(jenisKelamin);
  const resolvedJK =
    jkNorm === "pria" || jkNorm === "laki" || jkNorm === "l" || jkNorm === "male"
      ? "pria"
      : jkNorm === "wanita" || jkNorm === "perempuan" || jkNorm === "p" || jkNorm === "female"
      ? "wanita"
      : jenisKelamin;

  if (!resolvedJK || (resolvedJK !== "pria" && resolvedJK !== "wanita"))
    errors.push("Jenis kelamin tidak valid (isi: pria / wanita)");

  const statusNorm = norm(status);
  const resolvedStatus =
    statusNorm === "aktif" || statusNorm === "active"
      ? "aktif"
      : statusNorm === "tidak aktif" || statusNorm === "nonaktif" || statusNorm === "inactive"
      ? "tidak aktif"
      : status;

  return {
    nrp, nama, angkatan, email, prodi, role,
    jenisKelamin: resolvedJK, status: resolvedStatus,
    alamat, idProdi, idRole, errors,
  };
}

function downloadTemplate() {
  const headers = ["nrp","nama","angkatan","email","program studi","role","jenis kelamin","status","alamat"];
  const example = ["2272001","Budi Santoso","2022","budi@kampus.ac.id","Teknik Informatika","Mahasiswa","pria","aktif","Jl. Contoh No. 1"];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  ws["!cols"] = headers.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, ws, "Import Users");
  XLSX.writeFile(wb, "template_import_user.xlsx");
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ImportUserModal({ open, onClose, onSuccess }: Props) {
  const { importUsers, loading } = useImportUsers();
  const { programStudi } = useProgramStudi();
  const { roles } = useRoles();

  const fileRef    = useRef<HTMLInputElement>(null);
  const [step, setStep]             = useState<Step>("upload");
  const [fileName, setFileName]     = useState("");
  const [rows, setRows]             = useState<PreviewRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    error: number;
    errorDetails: { nrp: string; nama: string; message?: string }[];
  }>({ success: 0, error: 0, errorDetails: [] });

  const prodiList   = programStudi ?? [];
  const roleList    = roles ?? [];
  const validRows   = rows.filter((r) => r.errors.length === 0);
  const invalidRows = rows.filter((r) => r.errors.length > 0);

  const handleClose = () => {
    setStep("upload");
    setFileName("");
    setRows([]);
    setImportResults({ success: 0, error: 0, errorDetails: [] });
    onClose();
  };

  // ── Parse file ──
  const parseFile = useCallback(
    (file: File) => {
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      if (![".xlsx", ".xls", ".csv"].includes(ext)) {
        toast.error("Format Tidak Didukung!", {
          description: "Harap upload file dengan format .xlsx, .xls, atau .csv",
          icon: toastIconError, style: styleError, descriptionClassName: "!text-white/90",
        });
        return;
      }

      setFileName(file.name);
      const loadingId = toast.loading("Membaca file...", { description: `Memproses ${file.name}` });

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb   = XLSX.read(e.target?.result, { type: "binary" });
          const ws   = wb.Sheets[wb.SheetNames[0]];
          const json: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

          toast.dismiss(loadingId);

          if (!json.length) {
            toast.error("File Kosong!", {
              description: "Tidak ada data dalam file. Pastikan sheet pertama berisi data.",
              icon: toastIconError, style: styleError, descriptionClassName: "!text-white/90",
            });
            setFileName("");
            return;
          }

          const parsed     = json.map((raw) => validateAndResolve(normalizeRow(raw), prodiList, roleList));
          const errCount   = parsed.filter((r) => r.errors.length > 0).length;
          const validCount = parsed.filter((r) => r.errors.length === 0).length;

          setRows(parsed);
          setStep("preview");

          if (errCount === 0) {
            toast.success("File Berhasil Dibaca!", {
              description: `${validCount} baris data valid dan siap untuk diimport.`,
              icon: toastIconSuccess, style: styleSuccess, descriptionClassName: "!text-white/90",
            });
          } else if (validCount === 0) {
            toast.error("Semua Baris Mengandung Error!", {
              description: `${errCount} baris bermasalah. Periksa dan perbaiki data terlebih dahulu.`,
              icon: toastIconError, style: styleError, descriptionClassName: "!text-white/90",
            });
          } else {
            toast.warning(`${errCount} Baris Bermasalah`, {
              description: `${validCount} baris valid, ${errCount} baris akan dilewati karena error.`,
              icon: toastIconWarning, style: styleWarning, descriptionClassName: "!text-white/90",
            });
          }
        } catch {
          toast.dismiss(loadingId);
          toast.error("Gagal Membaca File!", {
            description: "Pastikan format file benar dan tidak rusak.",
            icon: toastIconError, style: styleError, descriptionClassName: "!text-white/90",
          });
          setFileName("");
        }
      };
      reader.onerror = () => {
        toast.dismiss(loadingId);
        toast.error("Gagal Membaca File!", {
          description: "Terjadi kesalahan saat membaca file.",
          icon: toastIconError, style: styleError, descriptionClassName: "!text-white/90",
        });
        setFileName("");
      };
      reader.readAsBinaryString(file);
    },
    [prodiList, roleList],
  );

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  };

  // ── Import ──
  const handleImport = async () => {
    if (!validRows.length) return;

    const importingId = toast.loading("Mengimport data...", {
      description: `Memproses ${validRows.length} user, mohon tunggu...`,
    });

    const payloads: CreateUserPayload[] = validRows.map((r) => ({
      nrp: r.nrp, nama: r.nama, angkatan: r.angkatan, email: r.email,
      idProdi: r.idProdi!, idRole: r.idRole!,
      jenisKelamin: r.jenisKelamin as JenisKelamin,
      status: (r.status || "aktif") as UserStatusBE,
      alamat: r.alamat || undefined,
      password: r.nrp,
      fotoProfil: "",
    }));

    try {
      const results      = await importUsers(payloads);
      toast.dismiss(importingId);

      const successCount = results.filter((r) => r.status === "success").length;
      const errorCount   = results.filter((r) => r.status === "error").length;
      const errorDetails = results
        .filter((r) => r.status === "error")
        .map((r) => ({ nrp: r.nrp, nama: r.nama, message: r.message }));

      setImportResults({ success: successCount, error: errorCount, errorDetails });
      setStep("result");

      if (errorCount === 0) {
        toast.success("Import Berhasil! 🎉", {
          description: `${successCount} user berhasil ditambahkan ke sistem.`,
          icon: toastIconSuccess, style: styleSuccess,
          descriptionClassName: "!text-white/90", duration: 5000,
        });
      } else if (successCount === 0) {
        toast.error("Import Gagal Total!", {
          description: `Semua ${errorCount} user gagal diimport. Periksa data dan coba lagi.`,
          icon: toastIconError, style: styleError,
          descriptionClassName: "!text-white/90", duration: 6000,
        });
      } else {
        toast.warning("Import Selesai dengan Sebagian Error", {
          description: `${successCount} berhasil · ${errorCount} gagal diimport.`,
          icon: toastIconWarning, style: styleWarning,
          descriptionClassName: "!text-white/90", duration: 6000,
        });
      }

      if (successCount > 0) onSuccess?.();
    } catch (err: any) {
      toast.dismiss(importingId);
      const msg = err?.response?.data?.message ?? err?.message ?? "Terjadi kesalahan saat import.";
      toast.error("Import Gagal!", {
        description: msg,
        icon: toastIconError, style: styleError, descriptionClassName: "!text-white/90",
      });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-6xl w-[95vw] h-[92vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl">

        {/* ── HEADER ── */}
        <DialogHeader className="px-8 pt-7 pb-5 border-b bg-gradient-to-r from-blue-50/80 to-white shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shadow-sm shrink-0">
                <Icon icon="mdi:file-excel" className="text-2xl text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Import User dari Excel / CSV
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Upload file lalu review data sebelum disimpan ke sistem
                </p>
              </div>
            </div>

            {/* Step indicator */}
            <div className="hidden sm:flex items-center gap-2 mr-8">
              {(["upload", "preview", "result"] as Step[]).map((s, i) => {
                const stepIndex = ["upload", "preview", "result"].indexOf(step);
                const isDone    = i < stepIndex;
                const isActive  = step === s;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isActive ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : isDone  ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-400"
                    }`}>
                      {isDone ? <Icon icon="mdi:check" className="text-xs" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${
                      isActive ? "text-blue-700" : isDone ? "text-emerald-600" : "text-gray-400"
                    }`}>
                      {s === "upload" ? "Upload" : s === "preview" ? "Preview" : "Hasil"}
                    </span>
                    {i < 2 && <Icon icon="mdi:chevron-right" className="text-gray-300 text-base" />}
                  </div>
                );
              })}
            </div>
          </div>
        </DialogHeader>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0">

          {/* ══ STEP 1: UPLOAD ══ */}
          {step === "upload" && (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 group ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 scale-[1.01]"
                    : "border-gray-200 bg-gray-50/80 hover:border-blue-400 hover:bg-blue-50/40"
                }`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
              >
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFileInputChange} />
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isDragging ? "bg-blue-100 scale-110" : "bg-green-100 group-hover:bg-green-200"
                }`}>
                  <Icon
                    icon={isDragging ? "mdi:file-arrow-up-down" : "mdi:file-excel"}
                    className={`text-5xl transition-colors ${isDragging ? "text-blue-500" : "text-green-600"}`}
                  />
                </div>
                <div className="text-center space-y-1.5">
                  <p className="text-base font-semibold text-gray-700">
                    {isDragging ? "Lepaskan file di sini..." : (
                      <>Drag & drop file di sini, atau{" "}
                        <span className="text-blue-600 underline underline-offset-2">klik untuk memilih</span>
                      </>
                    )}
                  </p>
                  <p className="text-sm text-gray-400">
                    Mendukung <span className="font-medium text-gray-500">.xlsx</span>,{" "}
                    <span className="font-medium text-gray-500">.xls</span>,{" "}
                    <span className="font-medium text-gray-500">.csv</span>
                  </p>
                </div>
              </div>

              {/* Guide */}
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                    <Icon icon="mdi:clipboard-list-outline" className="text-lg text-blue-600" />
                    Panduan Import
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-700 hover:bg-blue-100 gap-1.5 text-xs shrink-0"
                    onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
                    type="button"
                  >
                    <Icon icon="mdi:microsoft-excel" className="text-green-600" />
                    Download Template
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: "mdi:table-column",         text: "Kolom wajib: nrp, nama, angkatan, email, program studi, role, jenis kelamin" },
                    { icon: "mdi:gender-male-female",    text: "Jenis kelamin: isi pria atau wanita (huruf kecil)" },
                    { icon: "mdi:toggle-switch-outline", text: "Status: aktif atau tidak aktif (default aktif jika kosong)" },
                    { icon: "mdi:school-outline",        text: "Nama prodi & role harus sesuai dengan data yang ada di sistem" },
                    { icon: "mdi:lock-outline",          text: "Password default user = NRP masing-masing" },
                    { icon: "mdi:check-circle-outline",  text: "Baris error otomatis dilewati, hanya yang valid yang diimport" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-blue-800">
                      <Icon icon={item.icon} className="text-blue-500 text-base shrink-0 mt-0.5" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 2: PREVIEW ══ */}
          {step === "preview" && (
            <div className="flex flex-col gap-5">
              {/* File info bar */}
              <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white px-5 py-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <Icon icon="mdi:file-excel" className="text-xl text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{fileName}</p>
                  <p className="text-xs text-gray-400">{rows.length} baris ditemukan</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                    <Icon icon="mdi:check-circle" className="text-emerald-500 text-sm" />
                    <span className="text-xs font-semibold text-emerald-700">{validRows.length} valid</span>
                  </div>
                  {invalidRows.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                      <Icon icon="mdi:close-circle" className="text-red-500 text-sm" />
                      <span className="text-xs font-semibold text-red-700">{invalidRows.length} error</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Warning banner */}
              {invalidRows.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5 flex items-start gap-3">
                  <Icon icon="mdi:alert-circle-outline" className="text-xl shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      {invalidRows.length} baris tidak akan diimport
                    </p>
                    <p className="text-xs mt-0.5 text-amber-700">
                      Baris error ditandai merah. Hover badge <b>Error</b> untuk melihat detail masalah.
                      Hanya <b>{validRows.length} baris valid</b> yang akan diproses.
                    </p>
                  </div>
                </div>
              )}

              <PreviewTable rows={rows} />
            </div>
          )}

          {/* ══ STEP 3: RESULT ══ */}
          {step === "result" && (
            <div className="flex flex-col items-center gap-8 py-8 max-w-lg mx-auto">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${
                importResults.error === 0
                  ? "bg-gradient-to-br from-emerald-400 to-green-500"
                  : importResults.success === 0
                  ? "bg-gradient-to-br from-red-400 to-rose-500"
                  : "bg-gradient-to-br from-amber-400 to-orange-500"
              }`}>
                <Icon
                  icon={
                    importResults.error === 0 ? "mdi:check-circle-outline"
                    : importResults.success === 0 ? "mdi:close-circle-outline"
                    : "mdi:alert-circle-outline"
                  }
                  className="text-6xl text-white"
                />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-800">
                  {importResults.error === 0
                    ? "Semua Berhasil Diimport! 🎉"
                    : importResults.success === 0
                    ? "Import Gagal"
                    : "Import Selesai"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {importResults.error === 0
                    ? `${importResults.success} user berhasil ditambahkan ke sistem.`
                    : importResults.success === 0
                    ? "Tidak ada user yang berhasil diimport."
                    : `${importResults.success} berhasil · ${importResults.error} gagal`}
                </p>
              </div>

              <div className="flex gap-4 w-full max-w-xs">
                <div className="flex-1 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-5 text-center">
                  <p className="text-4xl font-black text-emerald-600">{importResults.success}</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-1.5 uppercase tracking-wide">Berhasil</p>
                </div>
                <div className="flex-1 rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50 p-5 text-center">
                  <p className="text-4xl font-black text-red-500">{importResults.error}</p>
                  <p className="text-xs font-semibold text-red-700 mt-1.5 uppercase tracking-wide">Gagal</p>
                </div>
              </div>

              {/* Error detail list */}
              {importResults.errorDetails.length > 0 && (
                <div className="w-full rounded-xl border border-red-100 bg-red-50/60 overflow-hidden">
                  <div className="px-4 py-3 border-b border-red-100 flex items-center gap-2">
                    <Icon icon="mdi:alert-circle" className="text-red-400" />
                    <p className="text-sm font-semibold text-red-800">Detail User yang Gagal</p>
                  </div>
                  <div className="max-h-52 overflow-y-auto divide-y divide-red-100">
                    {importResults.errorDetails.map((d, i) => (
                      <div key={i} className="px-4 py-2.5 flex items-start gap-3 text-sm">
                        <span className="shrink-0 mt-0.5 inline-block bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                          {d.nrp || "-"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-700 truncate">{d.nama}</p>
                          <p className="text-xs text-red-600 mt-0.5">{d.message ?? "Gagal disimpan"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="border-t bg-gray-50/80 px-8 py-4 flex items-center justify-between gap-3 flex-wrap shrink-0">
          {step === "upload" && (
            <>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <Icon icon="mdi:shield-check-outline" className="text-gray-400" />
                Data tersimpan hanya setelah kamu konfirmasi di step berikutnya
              </p>
              <Button variant="outline" onClick={handleClose}>Batal</Button>
            </>
          )}

          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => { setStep("upload"); setRows([]); setFileName(""); }} className="gap-2">
                <Icon icon="mdi:arrow-left" />
                Ganti File
              </Button>
              <div className="flex items-center gap-3">
                {validRows.length === 0 && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <Icon icon="mdi:alert" />
                    Tidak ada baris valid
                  </p>
                )}
                <Button
                  onClick={handleImport}
                  disabled={loading || validRows.length === 0}
                  className="border-2 border-black shadow-[3px_3px_0_0_#000] gap-2 min-w-[180px]"
                >
                  {loading ? (
                    <><Icon icon="mdi:loading" className="animate-spin" />Mengimport...</>
                  ) : (
                    <><Icon icon="mdi:upload" />Import {validRows.length} User</>
                  )}
                </Button>
              </div>
            </>
          )}

          {step === "result" && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setStep("upload");
                  setRows([]);
                  setFileName("");
                  setImportResults({ success: 0, error: 0, errorDetails: [] });
                }}
                className="gap-2"
              >
                <Icon icon="mdi:refresh" />
                Import Lagi
              </Button>
              <Button onClick={handleClose} className="border-2 border-black shadow-[3px_3px_0_0_#000] min-w-[120px]">
                Selesai
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Preview Table ────────────────────────────────────────────────────────────

function PreviewTable({ rows }: { rows: PreviewRow[] }) {
  const [tab, setTab] = useState<"all" | "error">("all");
  const hasErrors  = rows.some((r) => r.errors.length > 0);
  const displayed  = tab === "error" ? rows.filter((r) => r.errors.length > 0) : rows;

  return (
    <div className="flex flex-col gap-3">
      {hasErrors && (
        <div className="flex gap-2">
          {(["all", "error"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                tab === t
                  ? t === "all"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-red-500 text-white border-red-500 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t === "all"
                ? `Semua (${rows.length})`
                : `Hanya Error (${rows.filter((r) => r.errors.length > 0).length})`}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-xl border overflow-hidden shadow-sm">
        <div className="overflow-auto max-h-[45vh]">
          <Table className="min-w-[900px] text-sm">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                {["#","NRP","Nama","Angkatan","Email","Program Studi","Role","JK","Status"].map((h, i) => (
                  <TableHead
                    key={h}
                    className={`font-bold text-gray-600 sticky top-0 bg-gray-50 ${i === 0 ? "w-10 text-center" : ""} ${i === 8 ? "text-center w-24" : ""}`}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-gray-400">
                    <Icon icon="mdi:table-off" className="text-4xl mb-2 block mx-auto opacity-40" />
                    Tidak ada data
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((row, idx) => {
                  const isError = row.errors.length > 0;
                  return (
                    <TableRow
                      key={idx}
                      className={`transition-colors ${isError ? "bg-red-50 hover:bg-red-100/80" : "hover:bg-gray-50"}`}
                    >
                      <TableCell className="text-center text-xs text-gray-400 font-medium">
                        {rows.indexOf(row) + 1}
                      </TableCell>
                      <TableCell><CellWithError value={row.nrp}          error={row.errors.find((e) => e.includes("NRP"))} /></TableCell>
                      <TableCell className="font-medium"><CellWithError value={row.nama} error={row.errors.find((e) => e.includes("Nama"))} /></TableCell>
                      <TableCell><CellWithError value={row.angkatan}     error={row.errors.find((e) => e.includes("Angkatan"))} /></TableCell>
                      <TableCell><CellWithError value={row.email}        error={row.errors.find((e) => e.includes("Email"))} /></TableCell>
                      <TableCell><CellWithError value={row.prodi}        error={row.errors.find((e) => e.includes("Prodi") || e.includes("studi"))} /></TableCell>
                      <TableCell><CellWithError value={row.role}         error={row.errors.find((e) => e.includes("Role"))} /></TableCell>
                      <TableCell><CellWithError value={row.jenisKelamin} error={row.errors.find((e) => e.includes("kelamin"))} /></TableCell>
                      <TableCell className="text-center">
                        {isError ? (
                          <div className="group relative inline-block">
                            <Badge variant="danger" className="text-xs cursor-help whitespace-nowrap">
                              <Icon icon="mdi:alert" className="mr-1 text-xs" />Error
                            </Badge>
                            <div className="absolute z-50 bottom-full right-0 mb-2 hidden group-hover:block pointer-events-none">
                              <div className="bg-gray-900 text-white text-xs rounded-xl p-3 w-64 shadow-2xl">
                                <p className="font-semibold mb-1.5 text-red-300 flex items-center gap-1">
                                  <Icon icon="mdi:alert-circle" />{row.errors.length} masalah:
                                </p>
                                <ul className="space-y-1 list-disc list-inside text-gray-300">
                                  {row.errors.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                              </div>
                              <div className="w-2.5 h-2.5 bg-gray-900 rotate-45 ml-auto mr-3 -mt-1.5" />
                            </div>
                          </div>
                        ) : (
                          <Badge variant="success" className="text-xs">
                            <Icon icon="mdi:check" className="mr-1 text-xs" />Valid
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-right">
        Menampilkan {displayed.length} dari {rows.length} baris
      </p>
    </div>
  );
}

function CellWithError({ value, error }: { value: string; error?: string }) {
  if (!value && error) return <span className="text-red-400 italic text-xs">(kosong)</span>;
  return <span className={error ? "text-red-600 font-semibold" : ""}>{value || "—"}</span>;
}