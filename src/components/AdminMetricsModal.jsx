import React, { useEffect, useState } from "react";
import { Button, ModalShell } from "./ui";

const ADMIN_METRICS_KEY_STORAGE = "workout_pyramid_admin_metrics_key_v1";
const ADMIN_METRICS_SNAPSHOT_STORAGE = "workout_pyramid_admin_metrics_snapshot_v1";

function cardStyle(color) {
  return {
    borderRadius: 12,
    padding: "10px 12px",
    border: `1px solid ${color}`,
    background: "#ffffff",
    fontSize: 13,
    lineHeight: 1.3,
  };
}

function valueFormat(value) {
  return Number(value || 0).toLocaleString();
}

function readSnapshot() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_METRICS_SNAPSHOT_STORAGE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.metrics) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSnapshot(snapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ADMIN_METRICS_SNAPSHOT_STORAGE, JSON.stringify(snapshot));
  } catch {
    // ignore
  }
}

function formatDelta(delta) {
  if (!Number.isFinite(delta)) return "n/a";
  if (delta === 0) return "0";
  return delta > 0 ? `+${delta}` : `${delta}`;
}

export function AdminMetricsModal({ open, onClose }) {
  const [adminKey, setAdminKey] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [payload, setPayload] = useState(null);
  const [previousSnapshot, setPreviousSnapshot] = useState(() => readSnapshot());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(ADMIN_METRICS_KEY_STORAGE) || "";
    setAdminKey(saved);
    setPreviousSnapshot(readSnapshot());
  }, []);

  async function refreshMetrics() {
    const nextKey = adminKey.trim();
    if (!nextKey) {
      setError("Enter admin key.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/admin-metrics", {
        headers: { "x-admin-metrics-key": nextKey },
        cache: "no-store",
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.error || "Failed to fetch metrics.");
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(ADMIN_METRICS_KEY_STORAGE, nextKey);
      }
      const prevSnapshot = readSnapshot();
      setPreviousSnapshot(prevSnapshot);
      writeSnapshot(body);
      setPayload(body);
      setStatus("idle");
    } catch (loadError) {
      setPayload(null);
      setStatus("error");
      setError(loadError?.message || "Failed to fetch metrics.");
    }
  }

  const metrics = payload?.metrics || null;
  const generatedAtLabel = payload?.generatedAt ? new Date(payload.generatedAt).toLocaleString() : "";
  const previousGeneratedAtLabel = previousSnapshot?.generatedAt
    ? new Date(previousSnapshot.generatedAt).toLocaleString()
    : "";
  const previousMetrics = previousSnapshot?.metrics || null;

  function metricDelta(name) {
    if (!metrics || !previousMetrics) return null;
    const currentValue = Number(metrics[name] || 0);
    const previousValue = Number(previousMetrics[name] || 0);
    if (!Number.isFinite(currentValue) || !Number.isFinite(previousValue)) return null;
    return currentValue - previousValue;
  }

  function downloadJson() {
    if (!payload || !metrics) return;

    const delta = {};
    for (const key of Object.keys(metrics)) {
      delta[key] = metricDelta(key);
    }

    const exportPayload = {
      current: payload,
      previousSnapshot: previousSnapshot || null,
      delta,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `workout-pyramid-admin-metrics-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ModalShell open={open} onClose={onClose}>
      <div
        style={{
          padding: 18,
          borderBottom: "1px solid #e6e9ef",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 950 }}>Admin metrics</div>
          <div style={{ fontSize: 12, opacity: 0.68, marginTop: 2 }}>
            Active users, sign-ins, and auth risk indicators.
          </div>
        </div>
        <button
          type="button"
          aria-label="Close admin metrics"
          onClick={onClose}
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            border: "1px solid #e6e9ef",
            background: "#ffffff",
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: 18, display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7 }}>Admin key</div>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter ADMIN_METRICS_KEY"
            aria-label="Admin metrics key"
            style={{
              width: "100%",
              borderRadius: 14,
              border: "1px solid #e6e9ef",
              padding: "10px 12px",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Button onClick={refreshMetrics} disabled={status === "loading"} style={{ flex: 1 }}>
            {status === "loading" ? "Refreshing..." : "Refresh metrics"}
          </Button>
          <Button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.localStorage.removeItem(ADMIN_METRICS_KEY_STORAGE);
              }
              setAdminKey("");
              setPayload(null);
              setError("");
              setStatus("idle");
            }}
            style={{ flex: 1, opacity: 0.86 }}
          >
            Clear key
          </Button>
        </div>

        <Button onClick={downloadJson} disabled={!payload} style={{ opacity: payload ? 1 : 0.75 }}>
          Download JSON
        </Button>

        {generatedAtLabel ? (
          <div
            style={{
              borderRadius: 12,
              padding: "8px 10px",
              fontSize: 12,
              fontWeight: 800,
              background: "rgba(247,249,252,0.85)",
              border: "1px solid #e6e9ef",
            }}
          >
            Last updated: {generatedAtLabel}
            {previousGeneratedAtLabel ? ` • Compared to: ${previousGeneratedAtLabel}` : ""}
          </div>
        ) : null}

        {metrics ? (
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <div style={cardStyle("rgba(37,99,235,0.22)")}>
              <div style={{ fontWeight: 900 }}>Total accounts</div>
              <div style={{ marginTop: 4, fontSize: 20, fontWeight: 950 }}>{valueFormat(metrics.totalUsers)}</div>
              <div style={{ marginTop: 4, fontSize: 11, opacity: 0.72 }}>
                Δ {formatDelta(metricDelta("totalUsers"))}
              </div>
            </div>
            <div style={cardStyle("rgba(16,185,129,0.25)")}>
              <div style={{ fontWeight: 900 }}>Active sync (24h)</div>
              <div style={{ marginTop: 4, fontSize: 20, fontWeight: 950 }}>{valueFormat(metrics.activeSync24h)}</div>
              <div style={{ marginTop: 4, fontSize: 11, opacity: 0.72 }}>
                Δ {formatDelta(metricDelta("activeSync24h"))}
              </div>
            </div>
            <div style={cardStyle("rgba(16,185,129,0.2)")}>
              <div style={{ fontWeight: 900 }}>Active sync (7d)</div>
              <div style={{ marginTop: 4, fontSize: 20, fontWeight: 950 }}>{valueFormat(metrics.activeSync7d)}</div>
              <div style={{ marginTop: 4, fontSize: 11, opacity: 0.72 }}>
                Δ {formatDelta(metricDelta("activeSync7d"))}
              </div>
            </div>
            <div style={cardStyle("rgba(37,99,235,0.18)")}>
              <div style={{ fontWeight: 900 }}>Signed in (24h)</div>
              <div style={{ marginTop: 4, fontSize: 20, fontWeight: 950 }}>{valueFormat(metrics.signedIn24h)}</div>
              <div style={{ marginTop: 4, fontSize: 11, opacity: 0.72 }}>
                Δ {formatDelta(metricDelta("signedIn24h"))}
              </div>
            </div>
            <div style={cardStyle("rgba(37,99,235,0.15)")}>
              <div style={{ fontWeight: 900 }}>Signed in (7d)</div>
              <div style={{ marginTop: 4, fontSize: 20, fontWeight: 950 }}>{valueFormat(metrics.signedIn7d)}</div>
              <div style={{ marginTop: 4, fontSize: 11, opacity: 0.72 }}>
                Δ {formatDelta(metricDelta("signedIn7d"))}
              </div>
            </div>
            <div style={cardStyle("rgba(245,158,11,0.22)")}>
              <div style={{ fontWeight: 900 }}>New accounts (24h)</div>
              <div style={{ marginTop: 4, fontSize: 20, fontWeight: 950 }}>{valueFormat(metrics.created24h)}</div>
              <div style={{ marginTop: 4, fontSize: 11, opacity: 0.72 }}>
                Δ {formatDelta(metricDelta("created24h"))}
              </div>
            </div>
            <div style={cardStyle("rgba(239,68,68,0.2)")}>
              <div style={{ fontWeight: 900 }}>Unverified {">"}24h</div>
              <div style={{ marginTop: 4, fontSize: 20, fontWeight: 950 }}>{valueFormat(metrics.unverifiedOlderThan24h)}</div>
              <div style={{ marginTop: 4, fontSize: 11, opacity: 0.72 }}>
                Δ {formatDelta(metricDelta("unverifiedOlderThan24h"))}
              </div>
            </div>
            <div style={cardStyle("rgba(239,68,68,0.22)")}>
              <div style={{ fontWeight: 900 }}>Attention needed</div>
              <div style={{ marginTop: 4, fontSize: 20, fontWeight: 950 }}>{valueFormat(metrics.attentionNeeded)}</div>
              <div style={{ marginTop: 4, fontSize: 11, opacity: 0.72 }}>
                Δ {formatDelta(metricDelta("attentionNeeded"))}
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            style={{
              borderRadius: 12,
              padding: "9px 10px",
              background: "rgba(254,202,202,0.60)",
              border: "1px solid rgba(239,68,68,0.25)",
              fontSize: 12,
              fontWeight: 800,
              lineHeight: 1.35,
            }}
          >
            {error}
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
