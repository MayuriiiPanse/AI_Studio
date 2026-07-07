import { useState } from "react";
import { Mic, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import AudioPlayer from "../components/voice/AudioPlayer";
import useAsync from "../hooks/useAsync";
import { generateVoice, getAllVoices } from "../api/voice";
import { getErrorMessage, resolveMediaUrl } from "../api/client";
import styles from "./Voice.module.css";

export default function Voice() {
  const [text, setText] = useState("");
  const [generating, setGenerating] = useState(false);
  const { data, loading, refetch } = useAsync(getAllVoices, []);
  const voices = data?.voices || [];

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Write the script you'd like narrated first.");
      return;
    }
    setGenerating(true);
    try {
      await generateVoice(text.trim());
      toast.success("Voice-over ready.");
      setText("");
      refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't generate that voice-over."));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Voice lab"
        title="Script to narration"
        description="Paste in a script and get back a clean voice-over track, ready to drop under a reel."
      />

      <Card className={styles.promptCard}>
        <Textarea
          label="Script"
          placeholder="Good morning, and welcome to the studio. Today we're..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
        />
        <div className={styles.actionsRow}>
          <Button icon={<Wand2 size={16} />} loading={generating} onClick={handleGenerate}>
            Generate voice-over
          </Button>
        </div>
      </Card>

      <section>
        <h2 className={styles.sectionTitle}>Your voice-overs</h2>
        {loading ? (
          <div className={styles.loadingRow}>
            <Spinner label="Loading voice-overs…" />
          </div>
        ) : voices.length === 0 ? (
          <EmptyState icon={<Mic size={22} />} title="No voice-overs yet" description="Generate your first narration above." />
        ) : (
          <div className={styles.list}>
            {voices.map((voice) => (
              <Card key={voice._id} className={styles.voiceCard}>
                <p className={styles.voiceText}>{voice.text}</p>
                <AudioPlayer src={resolveMediaUrl(voice.audioUrl)} />
                <span className={styles.date}>{new Date(voice.createdAt).toLocaleString()}</span>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
