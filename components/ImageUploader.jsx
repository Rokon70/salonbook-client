"use client";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus } from "lucide-react";
import { uploadImage } from "@/lib/api";
import { Spinner } from "./ui";

/** Uploads to ImgBB through the server. allowUrl lets users paste an image URL instead. */
export default function ImageUploader({ value, onChange, allowUrl = false, round = false }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("upload");

  async function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be 5MB or smaller");
    setBusy(true);
    try {
      onChange(await uploadImage(file));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      {allowUrl && (
        <div className="mb-2 inline-flex rounded-lg border border-berry-200 p-0.5 text-xs">
          {["upload", "url"].map((m) => (
            <button type="button" key={m} onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 font-medium ${mode === m ? "bg-berry-600 text-white" : "text-ink-soft"}`}>
              {m === "upload" ? "Upload image" : "Image URL"}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-berry-100 bg-berry-50 ${round ? "rounded-full" : "rounded-lg"}`}>
          {busy ? <Spinner className="h-6 w-6 text-berry-600" /> : value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : <ImagePlus className="h-6 w-6 text-berry-300" />}
        </div>
        {mode === "upload" ? (
          <div>
            <input ref={input} type="file" accept="image/*" onChange={pick} className="hidden" id="img-input" />
            <button type="button" className="btn-outline btn-sm" onClick={() => input.current?.click()} disabled={busy}>
              {value ? "Change image" : "Choose image"}
            </button>
            <p className="mt-1 text-xs text-ink-faint">JPG, PNG or WebP, up to 5MB.</p>
          </div>
        ) : (
          <input className="input" placeholder="https://example.com/photo.jpg" value={value || ""} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>
    </div>
  );
}
