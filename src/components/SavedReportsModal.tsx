import React from 'react';
import { InspectionReport } from '../types/report';
import { calculateReportStats } from '../utils/reportLogic';
import {
  X,
  FolderOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  PenTool,
  Trash2,
  FileText,
  Plus,
} from 'lucide-react';

interface SavedReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: InspectionReport[];
  onSelectReport: (report: InspectionReport) => void;
  onDeleteReport: (id: string) => void;
  onNewReport: () => void;
}

export function SavedReportsModal({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  onDeleteReport,
  onNewReport,
}: SavedReportsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-400">
                Zapisane protokoły ({reports.length})
              </h3>
              <p className="text-xs text-slate-400">
                Wybierz protokół z historii, aby kontynuować edycję lub wygenerować PDF
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <FolderOpen className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm">Brak zapisanych protokołów w pamięci urządzenia.</p>
              <button
                type="button"
                onClick={() => {
                  onNewReport();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                Utwórz pierwszy protokół
              </button>
            </div>
          ) : (
            reports.map((rep) => {
              const stats = calculateReportStats(rep.items, rep);
              return (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div
                    onClick={() => {
                      onSelectReport(rep);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                        {rep.general.projekt || 'Projekt bez nazwy'}
                      </h4>
                      {stats.isFullySigned && (
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <PenTool className="w-2.5 h-2.5" />
                          Podpisany
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Architekt: {rep.general.architekt || '—'}</span>
                      <span>•</span>
                      <span>Koordynator: {rep.general.koordynator || '—'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {rep.general.dataOmawiania || rep.updatedAt.slice(0, 10)}
                      </span>
                    </div>

                    {/* Stats pills */}
                    <div className="flex items-center gap-2 mt-2 text-[11px]">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {stats.takCount} TAK
                      </span>
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {stats.nieCount} NIE
                      </span>
                      <span className="text-slate-400">
                        {stats.percentComplete}% wypełnienia
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectReport(rep);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                    >
                      Otwórz
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Czy na pewno usunąć protokół dla "${rep.general.projekt || 'projektu'}"?`)) {
                          onDeleteReport(rep.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Usuń z historii"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-900/90 text-xs shrink-0">
          <button
            type="button"
            onClick={() => {
              onNewReport();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nowy czysty protokół
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold cursor-pointer"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
