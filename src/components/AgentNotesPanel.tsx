import { useMemo, useState } from "react";
import { Check, MessageSquareText, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type AgentNote = {
  id: string;
  author: string;
  dateLabel: string;
  body: string;
};

type ComposerMode = "closed" | "add" | "edit";

const NOTE_LIMIT = 300;

const SEED_NOTES: AgentNote[] = [
  {
    id: "anita",
    author: "Anita",
    dateLabel: "10th Aug 2026",
    body: "Customer evaluating term life plans. Wants spouse covered under additional rider.",
  },
  {
    id: "anuj",
    author: "Anuj",
    dateLabel: "8th Aug 2026",
    body: "Shared policy comparison. Customer to review and revert by weekend.",
  },
];

function ordinalDay(day: number) {
  const suffix = ["th", "st", "nd", "rd"];
  const value = day % 100;
  return `${day}${suffix[(value - 20) % 10] || suffix[value] || suffix[0]}`;
}

function formatNoteDate(date: Date) {
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  return `${ordinalDay(date.getDate())} ${month} ${date.getFullYear()}`;
}

function NoteCard({ note }: { note: AgentNote }) {
  return (
    <article className="flex w-full flex-col gap-1 rounded-lg border border-[#e0e0e8] bg-white px-4 py-3">
      <div className="flex items-center gap-1">
        <MessageSquareText className="size-5 shrink-0 text-[#5b5675]" strokeWidth={1.75} />
        <p className="text-xs font-medium leading-[18px] text-[#36354c]">
          {note.author} • {note.dateLabel}
        </p>
      </div>
      <p className="text-sm font-normal leading-5 text-[#5b5675]">{note.body}</p>
    </article>
  );
}

const AgentNotesPanel = () => {
  const [previousNotes] = useState<AgentNote[]>(SEED_NOTES);
  const [currentNote, setCurrentNote] = useState<AgentNote | null>(null);
  const [composerMode, setComposerMode] = useState<ComposerMode>("closed");
  const [draft, setDraft] = useState("");

  const canSave = useMemo(() => {
    const text = draft.trim();
    if (!text || text.length > NOTE_LIMIT) return false;
    if (composerMode === "edit") return text !== currentNote?.body.trim();
    return true;
  }, [composerMode, currentNote, draft]);

  const openAdd = () => {
    setDraft("");
    setComposerMode("add");
  };

  const openEdit = () => {
    if (!currentNote) return;
    setDraft(currentNote.body);
    setComposerMode("edit");
  };

  const closeComposer = () => {
    setDraft("");
    setComposerMode("closed");
  };

  const saveNote = () => {
    if (!canSave) return;
    const body = draft.trim();
    if (composerMode === "edit" && currentNote) {
      setCurrentNote({ ...currentNote, body });
    } else {
      setCurrentNote({
        id: `note-${Date.now()}`,
        author: "Kanika",
        dateLabel: formatNoteDate(new Date()),
        body,
      });
    }
    closeComposer();
    toast.custom(
      (id) => (
        <div className="flex min-w-[320px] items-center gap-3 rounded-xl border border-[#e7e7f0] bg-white px-3 py-3 shadow-lg">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500">
            <Check className="size-3 text-white" />
          </div>
          <p className="flex-1 text-sm font-medium text-[#36354c]">
            Agent notes added successfully
          </p>
          <div className="h-8 w-px bg-[#e7e7f0]" />
          <button
            type="button"
            className="px-2 text-sm font-medium text-[#5b5675]"
            onClick={() => toast.dismiss(id)}
          >
            Dismiss
          </button>
        </div>
      ),
      { duration: 4000, position: "bottom-right" }
    );
  };

  return (
    <aside className="z-[1] flex h-full min-h-0 flex-col overflow-hidden bg-white px-4 py-6 shadow-[-2px_0_4px_rgba(0,0,0,0.09)]">
      <div className="flex shrink-0 items-center justify-between">
        <p className="text-sm font-medium text-[#36354c]">Notes</p>
        {currentNote ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-0.5 rounded-md px-2 py-1.5 text-sm font-medium text-[#36354c] shadow-none"
            onClick={openEdit}
          >
            <Pencil className="size-5" strokeWidth={1.75} />
            Edit note
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-0.5 rounded-md px-2 py-1.5 text-sm font-medium text-[#36354c] shadow-none"
            onClick={openAdd}
          >
            <Plus className="size-5" strokeWidth={1.75} />
            Add note
          </Button>
        )}
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {composerMode !== "closed" && (
          <div className="flex shrink-0 flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Textarea
                autoFocus
                value={draft}
                maxLength={NOTE_LIMIT}
                onChange={(event) => setDraft(event.target.value.slice(0, NOTE_LIMIT))}
                className="h-[120px] min-h-[120px] resize-none rounded-lg border-[1.5px] border-[#7c47e1] bg-white p-3 text-sm leading-5 text-[#36354c] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <p className="text-right text-xs font-normal leading-[18px] text-[#5b5675]">
                {draft.length}/{NOTE_LIMIT}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-auto rounded-lg px-4 py-2.5 text-sm font-medium text-[#5b5675] shadow-none"
                onClick={closeComposer}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!canSave}
                className="h-auto rounded-lg px-4 py-2.5 text-sm font-medium"
                onClick={saveNote}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {currentNote && composerMode === "closed" && <NoteCard note={currentNote} />}

        <div className="flex flex-col gap-4">
          {(currentNote || composerMode !== "closed") && (
            <p className="text-right text-xs font-medium text-[#888888]">Previous notes</p>
          )}
          {previousNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AgentNotesPanel;
