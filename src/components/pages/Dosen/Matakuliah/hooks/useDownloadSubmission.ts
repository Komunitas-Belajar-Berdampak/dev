import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { SubmissionService } from "../services/submission.service";
import { api } from "@/lib/axios";

export type DownloadState =
  | { status: "idle" }
  | { status: "fetching"; message: string }
  | { status: "downloading"; current: number; total: number }
  | { status: "zipping"; message: string }
  | { status: "done" }
  | { status: "error"; message: string };

async function fetchViaProxy(
  idAssignment: string,
  fileUrl: string
): Promise<Blob> {
  const response = await api.get(
    `/submissions/${idAssignment}/file-proxy`,
    {
      params: { fileUrl },
      responseType: "blob",
      timeout: 30_000,
    }
  );
  return response.data as Blob;
}

export function useDownloadSubmissions() {
  const [state, setState] = useState<DownloadState>({ status: "idle" });

  const download = async (idAssignment: string, zipName = "submissions") => {
    setState({ status: "fetching", message: "Mengambil data submission..." });

    try {
      const first = await SubmissionService.getAll(idAssignment, 1, 10);
      const total = first.pagination.total_items;

      let allSubmissions = first.data;
      if (first.pagination.total_pages > 1) {
        const all = await SubmissionService.getAll(idAssignment, 1, total);
        allSubmissions = all.data;
      }

      const withFile = allSubmissions.filter((s) => !!s.file);

      if (withFile.length === 0) {
        setState({ status: "error", message: "Tidak ada file untuk diunduh." });
        setTimeout(() => setState({ status: "idle" }), 3000);
        return;
      }

      setState({ status: "downloading", current: 0, total: withFile.length });

      const zip = new JSZip();
      let completed = 0;

      await Promise.allSettled(
        withFile.map(async (s) => {
          const nrp = s.mahasiswa?.nrp ?? s.mahasiswa?.id ?? "unknown";
          const fileName =
            s.file.split("/").pop() ?? `submission_${s.id}`;

          try {
            const blob = await fetchViaProxy(idAssignment, s.file);
            zip.folder(nrp)!.file(fileName, blob);
          } catch (err) {
            zip
              .folder(nrp)!
              .file(
                `${fileName}.error.txt`,
                `Gagal mengunduh file: ${s.file}\n${String(err)}`
              );
          } finally {
            completed += 1;
            setState({
              status: "downloading",
              current: completed,
              total: withFile.length,
            });
          }
        })
      );

      setState({ status: "zipping", message: "Membuat file ZIP..." });

      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      saveAs(content, `${zipName}.zip`);
      setState({ status: "done" });
      setTimeout(() => setState({ status: "idle" }), 3000);
    } catch (err: any) {
      setState({
        status: "error",
        message: err?.message ?? "Terjadi kesalahan saat mengunduh.",
      });
      setTimeout(() => setState({ status: "idle" }), 4000);
    }
  };

  const isLoading =
    state.status === "fetching" ||
    state.status === "downloading" ||
    state.status === "zipping";

  return { state, download, isLoading };
}