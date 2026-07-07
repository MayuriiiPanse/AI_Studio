import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ImagePlus,
  Palette,
  Mic,
  MessagesSquare,
  GalleryHorizontalEnd,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";
import useAsync from "../hooks/useAsync";
import { getAllPosts } from "../api/posts";
import { getAllPosters } from "../api/poster";
import { getAllVoices } from "../api/voice";
import { getAllHistory } from "../api/history";
import { useAuth } from "../context/AuthContext";
import styles from "./Dashboard.module.css";

const QUICK_ACTIONS = [
  { to: "/studio", label: "New content kit", desc: "Upload a photo, get a full release", icon: ImagePlus },
  { to: "/poster", label: "Generate a poster", desc: "Prompt to a print-ready image", icon: Palette },
  { to: "/voice", label: "Record a voice-over", desc: "Turn a script into narration", icon: Mic },
  { to: "/chat", label: "Ask the assistant", desc: "Grounded in your own knowledge", icon: MessagesSquare },
];

const TYPE_LABEL = {
  chat: "Assistant reply",
  "image-analysis": "Content kit",
  poster: "Poster",
  voice: "Voice-over",
  "post-update": "Content kit edited",
};

function historyPreview(item) {
  const d = item.data || {};
  return d.caption || d.prompt || d.message || d.text || d.response || "Untitled entry";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: postsData, loading: loadingPosts } = useAsync(getAllPosts, []);
  const { data: postersData, loading: loadingPosters } = useAsync(getAllPosters, []);
  const { data: voicesData, loading: loadingVoices } = useAsync(getAllVoices, []);
  const { data: historyData, loading: loadingHistory } = useAsync(getAllHistory, []);

  const loading = loadingPosts || loadingPosters || loadingVoices || loadingHistory;

  const recent = useMemo(() => {
    return (historyData?.history || []).slice(0, 6);
  }, [historyData]);

  return (
    <div>
      <PageHeader
        eyebrow={`Welcome back, ${user?.username || "creator"}`}
        title="Your studio, at a glance"
        description="Everything you've developed across the studio, poster lab, and voice lab lives here."
      />

      <div className={styles.stats}>
        <StatCard index={0} label="Content kits" value={postsData?.posts?.length ?? "–"} icon={<ImagePlus size={19} />} accent="brass" />
        <StatCard index={1} label="Posters" value={postersData?.posters?.length ?? "–"} icon={<Palette size={19} />} accent="teal" />
        <StatCard index={2} label="Voice-overs" value={voicesData?.voices?.length ?? "–"} icon={<Mic size={19} />} accent="marigold" />
        <StatCard index={3} label="Logged activity" value={historyData?.history?.length ?? "–"} icon={<Clock size={19} />} accent="teal" />
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick actions</h2>
        <div className={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action, i) => (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link to={action.to} className={styles.actionLink}>
                <Card hoverable className={styles.actionCard}>
                  <action.icon size={20} className={styles.actionIcon} strokeWidth={1.7} />
                  <div>
                    <div className={styles.actionLabel}>{action.label}</div>
                    <div className={styles.actionDesc}>{action.desc}</div>
                  </div>
                  <ArrowUpRight size={16} className={styles.actionArrow} />
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeadRow}>
          <h2 className={styles.sectionTitle}>Recent activity</h2>
          <Link to="/history" className={styles.viewAll}>
            View full history <ArrowUpRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className={styles.loadingRow}>
            <Spinner label="Loading activity…" />
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={<GalleryHorizontalEnd size={22} />}
            title="Nothing developed yet"
            description="Your first content kit, poster, or voice-over will show up here the moment it's ready."
          />
        ) : (
          <Card padded={false}>
            <ul className={styles.list}>
              {recent.map((item) => (
                <li key={item._id} className={styles.listItem}>
                  <Badge tone={item.type === "poster" || item.type === "voice" ? "teal" : "brass"}>
                    {TYPE_LABEL[item.type] || item.type}
                  </Badge>
                  <span className={styles.listPreview}>{historyPreview(item)}</span>
                  <span className={styles.listDate}>{new Date(item.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </div>
  );
}
