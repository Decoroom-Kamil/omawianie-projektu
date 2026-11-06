import React, { useState } from 'react';
import { ChecklistItem, ChecklistAnswer } from '../types/report';
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  MessageSquare,
  CheckCheck,
} from 'lucide-react';

interface ChecklistSectionProps {
  title: string;
  category: ChecklistItem['category'];
  items: ChecklistItem[];
  onItemChange: (id: string, updated: Partial<ChecklistItem>) => void;
  onSetAllInCategory: (category: ChecklistItem['category'], answer: ChecklistAnswer) => void;
}

export function ChecklistSection({
  title,
  category,
  items,
  onItemChange,
  onSetAllInCategory,
}: ChecklistSectionProps) {
  const [openNotes, setOpenNotes] = useState<{ [itemId: string]: boolean }>({});

  const handleSelectAnswer = (item: ChecklistItem, answer: ChecklistAnswer) => {
    let value = 'TAK';
    if (answer === 'nie') value = 'NIE';
    if (answer === 'nie_dotyczy') value = 'NIE DOTYCZY';

    // If marked as 'NIE', automatically open note composer so user can explain if desired
    if (answer === 'nie') {
      setOpenNotes((prev) => ({ ...prev, [item.id]: true }));
    }

    onItemChange(item.id, {
      answer,
      value,
    });
  };

  const handleToggleNote = (itemId: string) => {
    setOpenNotes((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const takCount = items.filter((i) => i.answer === 'tak').length;
  const nieCount = items.filter((i) => i.answer === 'nie').length;
  const naCount = items.filter((i) => i.answer === 'nie_dotyczy').length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            {title}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <span>{items.length} pozycji</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">TAK: {takCount}</span>
            <span>•</span>
            <span className="text-rose-400 font-medium">NIE: {nieCount}</span>
            <span>•</span>
            <span className="text-slate-400 font-medium">N/D: {naCount}</span>
          </div>
        </div>

        {/* Quick Bulk Action Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onSetAllInCategory(category, 'tak')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            title="Oznacz wszystkie pozycje w tej sekcji jako TAK"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Wszystko TAK
          </button>
          <button
            type="button"
            onClick={() => onSetAllInCategory(category, 'nie_dotyczy')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750 text-xs font-medium transition-all active:scale-95 cursor-pointer"
            title="Oznacz wszystkie pozycje w tej sekcji jako NIE DOTYCZY"
          >
            <MinusCircle className="w-3.5 h-3.5" />
            Wszystko N/D
          </button>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const isTak = item.answer === 'tak';
          const isNie = item.answer === 'nie';
          const isNa = item.answer === 'nie_dotyczy';
          const isNoteOpen = openNotes[item.id] || Boolean(item.note);

          return (
            <div
              key={item.id}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                isNie
                  ? 'bg-rose-950/20 border-rose-500/60 shadow-md shadow-rose-950/20'
                  : isTak
                  ? 'bg-emerald-950/15 border-emerald-500/40'
                  : isNa
                  ? 'bg-slate-900/60 border-slate-700/60 opacity-80'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Item label */}
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="text-xs font-mono font-bold text-amber-400 mt-0.5 shrink-0">
                    {index + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                      {item.label}
                    </p>
                  </div>
                </div>

                {/* The 3 Buttons: TAK, NIE, NIE DOTYCZY + Dodaj uwagę */}
                <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0 self-start lg:self-auto">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* TAK Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectAnswer(item, 'tak')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                        isTak
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400 scale-[1.02]'
                          : 'bg-slate-800 text-emerald-400 border border-emerald-900/70 hover:bg-emerald-950/60'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>TAK</span>
                    </button>

                    {/* NIE Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectAnswer(item, 'nie')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                        isNie
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 ring-2 ring-rose-400 scale-[1.02]'
                          : 'bg-slate-800 text-rose-400 border border-rose-900/70 hover:bg-rose-950/60'
                      }`}
                    >
                      <XCircle className="w-4 h-4 stroke-[2.5]" />
                      <span>NIE</span>
                    </button>

                    {/* NIE DOTYCZY Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectAnswer(item, 'nie_dotyczy')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                        isNa
                          ? 'bg-slate-700 text-slate-100 shadow-md ring-2 ring-slate-400 scale-[1.02]'
                          : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      <MinusCircle className="w-4 h-4" />
                      <span>NIE DOTYCZY</span>
                    </button>

                    {/* Dodaj uwagę Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleNote(item.id)}
                      className={`px-2.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        item.note
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750'
                      }`}
                      title={isNoteOpen ? 'Zwiń uwagę' : 'Dodaj uwagę'}
                      aria-label={isNoteOpen ? 'Zwiń uwagę' : 'Dodaj uwagę'}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">{isNoteOpen ? 'Zwiń uwagę' : 'Dodaj uwagę'}</span>
                    </button>
                  </div>

                  {/* Opis pod wybraną odpowiedzią (widoczny gdy pole nie jest edytowane) */}
                  {item.note && !isNoteOpen && (
                    <div className="text-left lg:text-right mt-0.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-300/95 font-medium bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                        <MessageSquare className="w-3 h-3 shrink-0 text-amber-400" />
                        <span className="text-slate-300">Opis pod odpowiedzią {isTak ? 'TAK' : isNie ? 'NIE' : isNa ? 'N/D' : ''}:</span>
                        <span className="font-semibold text-amber-300">{item.note}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible Note Section */}
              {isNoteOpen && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Opis pod odpowiedzią {isTak ? '(TAK)' : isNie ? '(NIE)' : isNa ? '(NIE DOTYCZY)' : ''}:
                    </span>
                    <input
                      type="text"
                      value={item.note || ''}
                      onChange={(e) => onItemChange(item.id, { note: e.target.value })}
                      placeholder="Wpisz treść opisu pod wybraną odpowiedzią..."
                      className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    {item.note && (
                      <button
                        type="button"
                        onClick={() => onItemChange(item.id, { note: '' })}
                        className="text-[11px] text-slate-400 hover:text-rose-400 px-2 py-1 rounded transition-colors cursor-pointer shrink-0"
                        title="Usuń treść opisu"
                      >
                        Wyczyść opis
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
