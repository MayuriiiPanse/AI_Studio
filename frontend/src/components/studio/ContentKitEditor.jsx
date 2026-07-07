import { useEffect, useState } from "react";
import { Save, Trash2, Sparkles, Hash, BookOpen, Smile, Clapperboard, Zap, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import Tabs from "../ui/Tabs";
import Textarea from "../ui/Textarea";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { updatePost, deletePost } from "../../api/posts";
import { getErrorMessage } from "../../api/client";
import styles from "./ContentKitEditor.module.css";

const FIELDS = [
  { id: "caption", label: "Caption", icon: <Sparkles size={13} /> },
  { id: "hashtags", label: "Hashtags", icon: <Hash size={13} /> },
  { id: "story", label: "Story", icon: <BookOpen size={13} /> },
  { id: "mood", label: "Mood", icon: <Smile size={13} /> },
  { id: "reelScript", label: "Reel script", icon: <Clapperboard size={13} /> },
  { id: "viralHook", label: "Viral hook", icon: <Zap size={13} /> },
  { id: "aiPrompt", label: "AI prompt", icon: <Wand2 size={13} /> },
];

export default function ContentKitEditor({ post, onUpdated, onDeleted, onRequestDelete }) {
  const [values, setValues] = useState(post);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(post);
    setDirty(false);
  }, [post]);

  const handleChange = (field, val) => {
    setValues((v) => ({ ...v, [field]: val }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        caption: values.caption,
        story: values.story,
        mood: values.mood,
        reelScript: values.reelScript,
        viralHook: values.viralHook,
        aiPrompt: values.aiPrompt,
        hashtags:
          typeof values.hashtags === "string"
            ? values.hashtags.split(",").map((h) => h.trim()).filter(Boolean)
            : values.hashtags,
      };
      const res = await updatePost(post._id, payload);
      toast.success("Content kit saved.");
      setDirty(false);
      onUpdated?.(res.post);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't save your changes."));
    } finally {
      setSaving(false);
    }
  };

  const hashtagsDisplay = Array.isArray(values.hashtags) ? values.hashtags.join(", ") : values.hashtags || "";

  const tabs = FIELDS.map((f) => ({
    id: f.id,
    label: f.label,
    icon: f.icon,
    content:
      f.id === "hashtags" ? (
        <Input
          label="Hashtags (comma separated)"
          value={hashtagsDisplay}
          onChange={(e) => handleChange("hashtags", e.target.value)}
          placeholder="#morning, #coffee, #slowliving"
        />
      ) : (
        <Textarea
          label={f.label}
          value={values[f.id] || ""}
          onChange={(e) => handleChange(f.id, e.target.value)}
          rows={f.id === "reelScript" || f.id === "story" ? 8 : 4}
          placeholder={`No ${f.label.toLowerCase()} generated.`}
        />
      ),
  }));

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <img src={post.image} alt="Post source" className={styles.thumb} />
        <div className={styles.headMeta}>
          <span className={styles.headDate}>{new Date(post.createdAt).toLocaleString()}</span>
          <div className={styles.headActions}>
            <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => (onRequestDelete ? onRequestDelete(post) : deletePost(post._id).then(() => onDeleted?.(post._id)))}>
              Delete
            </Button>
            <Button size="sm" icon={<Save size={14} />} loading={saving} disabled={!dirty} onClick={handleSave}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}
