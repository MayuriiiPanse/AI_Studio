import { useState } from "react";
import { BookMarked, UploadCloud, Search, FileText } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { uploadRagDocument, searchRagDocument } from "../api/rag";
import { getErrorMessage } from "../api/client";
import styles from "./Knowledge.module.css";

export default function Knowledge() {
  const [doc, setDoc] = useState({ title: "", text: "" });
  const [uploading, setUploading] = useState(false);

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [matches, setMatches] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!doc.text.trim()) {
      toast.error("Add the document text before uploading.");
      return;
    }
    setUploading(true);
    try {
      await uploadRagDocument(doc.title.trim(), doc.text.trim());
      toast.success("Added to your knowledge base.");
      setDoc({ title: "", text: "" });
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't upload that document."));
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await searchRagDocument(query.trim());
      setMatches(res.matches || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't search your knowledge base."));
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Brand memory"
        title="Knowledge base"
        description="Upload brand guidelines, past copy, or reference docs — the assistant searches this before every answer."
      />

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.cardTitle}>
            <UploadCloud size={16} /> Add a document
          </h3>
          <form onSubmit={handleUpload} className={styles.form}>
            <Input
              label="Title (optional)"
              value={doc.title}
              onChange={(e) => setDoc((d) => ({ ...d, title: e.target.value }))}
              placeholder="Brand voice guidelines"
            />
            <Textarea
              label="Content"
              value={doc.text}
              onChange={(e) => setDoc((d) => ({ ...d, text: e.target.value }))}
              placeholder="Paste the text you want the assistant to remember…"
              rows={8}
            />
            <Button type="submit" loading={uploading} icon={<UploadCloud size={15} />}>
              Add to knowledge base
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className={styles.cardTitle}>
            <Search size={16} /> Search your knowledge
          </h3>
          <form onSubmit={handleSearch} className={styles.searchRow}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What did I write about our return policy?"
            />
            <Button type="submit" loading={searching}>
              Search
            </Button>
          </form>

          <div className={styles.results}>
            {matches === null ? (
              <p className={styles.hint}>Results will appear here once you search.</p>
            ) : matches.length === 0 ? (
              <EmptyState icon={<FileText size={20} />} title="No matches" description="Try a different phrase, or add more documents above." />
            ) : (
              matches.map((m, i) => (
                <div key={m.id || i} className={styles.result}>
                  <p>{m.metadata?.text || m.metadata?.title || JSON.stringify(m.metadata)}</p>
                  {typeof m.score === "number" && <span className={styles.score}>{Math.round(m.score * 100)}% match</span>}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
