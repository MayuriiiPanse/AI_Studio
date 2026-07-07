import { useState } from "react";
import { Palette, Wand2, Trash2, Download } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import useAsync from "../hooks/useAsync";
import { generatePoster, getAllPosters, deletePoster } from "../api/poster";
import { getErrorMessage, resolveMediaUrl } from "../api/client";
import styles from "./Poster.module.css";

export default function Poster() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const { data, loading, refetch, setData } = useAsync(getAllPosters, []);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const posters = data?.posters || [];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Describe the poster you want first.");
      return;
    }
    setGenerating(true);
    try {
      const res = await generatePoster(prompt.trim());
      setEnhancedPrompt(res.enhancedPrompt || "");
      toast.success("Poster generated.");
      setPrompt("");
      refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't generate that poster. Try a different prompt."));
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePoster(confirmId);
      setData({ posters: posters.filter((p) => p._id !== confirmId) });
      toast.success("Poster deleted.");
      setConfirmId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't delete this poster."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Poster lab"
        title="Prompt to print-ready"
        description="Describe the piece you need. It's refined into an art direction brief, then rendered as an image."
      />

      <Card className={styles.promptCard}>
        <Textarea
          label="Poster prompt"
          placeholder="A warm, minimalist poster for a Sunday morning coffee pop-up, muted terracotta tones…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
        <div className={styles.promptActions}>
          {enhancedPrompt && <p className={styles.enhanced}>Art direction used: “{enhancedPrompt}”</p>}
          <Button icon={<Wand2 size={16} />} loading={generating} onClick={handleGenerate} className={styles.generateBtn}>
            Generate poster
          </Button>
        </div>
      </Card>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your posters</h2>
        {loading ? (
          <div className={styles.loadingRow}>
            <Spinner label="Loading posters…" />
          </div>
        ) : posters.length === 0 ? (
          <EmptyState icon={<Palette size={22} />} title="No posters yet" description="Generate your first poster above — it'll appear in this gallery." />
        ) : (
          <div className={styles.grid}>
            {posters.map((poster) => (
              <Card key={poster._id} padded={false} className={styles.posterCard}>
                <img src={resolveMediaUrl(poster.imageUrl)} alt={poster.prompt} className={styles.posterImg} />
                <div className={styles.posterBody}>
                  <p className={styles.posterPrompt}>{poster.prompt}</p>
                  <div className={styles.posterActions}>
                    <a href={resolveMediaUrl(poster.imageUrl)} download target="_blank" rel="noreferrer">
                      <Button variant="ghost" size="sm" icon={<Download size={13} />}>
                        Save
                      </Button>
                    </a>
                    <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => setConfirmId(poster._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(confirmId)}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this poster?"
        description="The image file will be removed. This can't be undone."
      />
    </div>
  );
}
