import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const MAX_SIZE = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUploader({ value, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Please upload a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Image must be 8MB or smaller.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error("Please sign in to upload your custom image.");
      return;
    }

    setBusy(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userData.user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("custom-uploads").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }
    // Bucket is private — generate a signed URL valid for 7 days for preview
    const { data: signed, error: signErr } = await supabase.storage
      .from("custom-uploads")
      .createSignedUrl(path, 60 * 60 * 24 * 7);
    if (signErr || !signed) {
      setBusy(false);
      toast.error("Could not generate preview URL");
      return;
    }
    onChange(signed.signedUrl);
    setBusy(false);
    toast.success("Image uploaded");
  }

  function clear() {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={value} alt="Custom background" className="w-full max-h-48 object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 bg-background/90 hover:bg-background rounded-full p-1.5 shadow-soft"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="w-full h-24 border-dashed flex-col gap-1"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span className="text-xs text-brand-mid">
            {busy ? "Uploading…" : "Upload background image (max 8MB)"}
          </span>
        </Button>
      )}
      <p className="text-[11px] text-brand-mid">JPG, PNG or WebP. Sign in required. You confirm you own or have rights to use this image.</p>
    </div>
  );
}
