import { useState } from "react";
import { History as HistoryIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import useAsync from "../hooks/useAsync";
import { getAllHistory, getHistoryByType, deleteHistory } from "../api/history";
import { getErrorMessage } from "../api/client";
import styles from "./History.module.css";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "image-analysis", label: "Content kits" },
  { id: "poster", label: "Posters" },
  { id: "voice", label: "Voice-overs" },
  { id: "chat", label: "Assistant" },
];

const TYPE_TONE = { "image-analysis": "brass", poster: "teal", voice: "teal", chat: "default" };

function preview(item) {
  const d = item.data || {};
  return d.caption || d.prompt || d.message || d.text || d.response || JSON.stringify(d).slice(0, 140);
}

export default function History() {
  const [filter, setFilter] = useState("all");
  const { data, loading, refetch, setData } = useAsync(
    () => (filter === "all" ? getAllHistory() : getHistoryByType(filter)),
    [filter]
  );
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const items = data?.history || [];

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteHistory(confirmId);
      setData({ history: items.filter((i) => i._id !== confirmId) });
      toast.success("Entry removed.");
      setConfirmId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't delete this entry."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Activity"
        title="History"
        description="A searchable record of everything you've generated across the studio."
      />

      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={[styles.filterBtn, filter === f.id ? styles.filterActive : ""].join(" ")}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingRow}>
          <Spinner label="Loading history…" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={<HistoryIcon size={22} />} title="Nothing here yet" description="Activity for this filter will show up as soon as you create something." />
      ) : (
        <div className={styles.list}>
          {items.map((item) => (
            <Card key={item._id} className={styles.item}>
              <div className={styles.itemTop}>
                <Badge tone={TYPE_TONE[item.type] || "default"}>{item.type}</Badge>
                <span className={styles.date}>{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <p className={styles.preview}>{preview(item)}</p>
              <button className={styles.deleteBtn} onClick={() => setConfirmId(item._id)} aria-label="Delete entry">
                <Trash2 size={14} />
              </button>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmId)}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this entry?"
        description="This removes it from your history log only — related content kits or posters are not affected."
      />
    </div>
  );
}
