import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { Check, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/Skeleton";
import { useApi } from "@/hooks/useApi";
import { profileService, type Profile } from "@/services/profile";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — DisciplineOS" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data, loading, error, refetch } = useApi<Profile>(() => profileService.get(), []);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setName(data.name || "");
    setBio(data.bio || "");
    setTimezone(data.timezone || "");
  }, [data]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      await profileService.update({ name, bio, timezone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      let msg = "Save failed";
      if (axios.isAxiosError(err)) msg = err.response?.data?.message || err.message;
      else if (err instanceof Error) msg = err.message;
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Your identity"
        description="How DisciplineOS sees you."
      />

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          <div className="glass rounded-2xl p-6 flex items-center gap-5 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-accent to-cyan-accent p-[2px]">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-xl font-medium">
                {(data.name || data.email || "U").slice(0, 1).toUpperCase()}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-lg font-medium truncate">{data.name || "Unnamed"}</div>
              <div className="text-sm text-muted-foreground truncate">{data.email}</div>
              {data.joinedAt && (
                <div className="text-xs text-muted-foreground mt-1">
                  Joined {new Date(data.joinedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={onSave} className="glass rounded-2xl p-6 space-y-4">
            <Field label="Display name">
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </Field>
            <Field label="Bio">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="input resize-none"
              />
            </Field>
            <Field label="Timezone">
              <input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="e.g. Europe/Berlin"
                className="input"
              />
            </Field>

            {saveError && <div className="text-sm text-destructive">{saveError}</div>}

            <div className="flex items-center justify-end gap-3 pt-2">
              {saved && (
                <span className="text-xs text-cyan-accent flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2 text-sm font-medium hover:bg-white/90 transition disabled:opacity-60"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save changes
              </button>
            </div>
          </form>
        </>
      )}

      <style>{`
        .input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 14px;
          color: white;
          outline: none;
        }
        .input:focus { border-color: rgba(168,85,247,0.6); background: rgba(255,255,255,0.06); }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
