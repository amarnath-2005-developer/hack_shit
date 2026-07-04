import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Check, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/Skeleton";
import { useApi } from "@/hooks/useApi";
import { settingsService, type UserSettings } from "@/services/profile";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — DisciplineOS" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data, loading, error, refetch } = useApi<UserSettings>(() => settingsService.get(), []);
  const [local, setLocal] = useState<UserSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (data) setLocal(data);
  }, [data]);

  const update = async (patch: Partial<UserSettings>) => {
    if (!local) return;
    const next = { ...local, ...patch };
    setLocal(next);
    setSaving(true);
    setSaveError(null);
    try {
      await settingsService.update(patch);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
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
        eyebrow="Settings"
        title="Preferences"
        description="Tune notifications, appearance, and coach behavior."
        actions={
          <div className="text-xs text-muted-foreground h-5 flex items-center gap-1">
            {saving && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
              </>
            )}
            {saved && !saving && (
              <span className="text-cyan-accent flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
        }
      />

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {saveError && !loading && <div className="mb-4 text-sm text-destructive">{saveError}</div>}

      {!loading && !error && local && (
        <div className="space-y-4">
          <Section title="Notifications" description="Where DisciplineOS pings you.">
            <Toggle
              label="Email digest"
              checked={local.notifications.email}
              onChange={(v) => update({ notifications: { ...local.notifications, email: v } })}
            />
            <Toggle
              label="Push notifications"
              checked={local.notifications.push}
              onChange={(v) => update({ notifications: { ...local.notifications, push: v } })}
            />
            <Toggle
              label="Daily reminder"
              checked={local.notifications.dailyReminder}
              onChange={(v) =>
                update({ notifications: { ...local.notifications, dailyReminder: v } })
              }
            />
          </Section>

          <Section title="Appearance">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm">Theme</div>
              <div className="glass rounded-full p-1 flex">
                {(["dark", "light", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => update({ theme: t })}
                    className={`px-3 py-1 text-xs uppercase font-mono rounded-full transition ${
                      local.theme === t
                        ? "bg-white text-black"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mt-4">
              <div className="text-sm">Week starts on</div>
              <div className="glass rounded-full p-1 flex">
                {(["monday", "sunday"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => update({ weekStart: t })}
                    className={`px-3 py-1 text-xs uppercase font-mono rounded-full transition ${
                      local.weekStart === t
                        ? "bg-white text-black"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          <Section title="AI Coach" description="Your coach can chime in with insights and nudges.">
            <Toggle
              label="Enable AI Coach"
              checked={local.aiCoachEnabled}
              onChange={(v) => update({ aiCoachEnabled: v })}
            />
          </Section>
        </div>
      )}
    </>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-4">
        <div className="text-sm font-medium">{title}</div>
        {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full relative transition ${checked ? "bg-gradient-to-r from-purple-accent to-cyan-accent" : "bg-white/10"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${checked ? "left-[18px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
