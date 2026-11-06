import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  InspectionReport,
  ChecklistItem,
  ChecklistAnswer,
  CATEGORIES_CONFIG,
  createEmptyReport,
} from './types/report';
import {
  loadCurrentDraft,
  saveCurrentDraft,
  getSavedReports,
  saveReportToHistory,
  deleteReportFromHistory,
} from './utils/storage';
import { calculateReportStats } from './utils/reportLogic';

import { HeaderBar } from './components/HeaderBar';
import { ReportInfoForm } from './components/ReportInfoForm';
import { ChecklistSection } from './components/ChecklistSection';
import { SignaturesSection } from './components/SignaturesSection';
import { ExportEmailModal } from './components/ExportEmailModal';
import { SavedReportsModal } from './components/SavedReportsModal';
import { PrintableReportDocument } from './components/PrintableReportDocument';
import { OfflineIndicator } from './components/OfflineIndicator';

import {
  CheckCircle2,
  XCircle,
  Share2,
  FileText,
  Eye,
  EyeOff,
  Filter,
  CheckCheck,
  PenTool,
} from 'lucide-react';

export default function App() {
  const [report, setReport] = useState<InspectionReport>(() => loadCurrentDraft());
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'nie' | 'unfilled'>('all');
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedReports, setSavedReports] = useState<InspectionReport[]>(() => getSavedReports());

  const printableDocRef = useRef<HTMLDivElement | null>(null);
  const signaturesRef = useRef<HTMLDivElement | null>(null);

  // Auto-save draft on changes
  useEffect(() => {
    saveCurrentDraft(report);
    saveReportToHistory(report);
  }, [report]);

  // Handle URL query parameters (?action=new, ?action=saved, ?action=export)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      if (action === 'saved') {
        setIsSavedModalOpen(true);
      } else if (action === 'export') {
        setIsExportModalOpen(true);
      } else if (action === 'new') {
        const fresh = createEmptyReport();
        setReport(fresh);
      }
    }
  }, []);

  const stats = useMemo(() => calculateReportStats(report.items, report), [report.items, report]);

  const handleGeneralChange = (updatedGeneral: InspectionReport['general']) => {
    setReport((prev) => ({
      ...prev,
      general: updatedGeneral,
    }));
  };

  const handleItemChange = (itemId: string, updated: Partial<ChecklistItem>) => {
    setReport((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === itemId ? { ...item, ...updated } : item)),
    }));
  };

  const handleSetAllInCategory = (
    category: ChecklistItem['category'],
    answer: ChecklistAnswer
  ) => {
    const val = answer === 'tak' ? 'TAK' : answer === 'nie' ? 'NIE' : 'NIE DOTYCZY';
    setReport((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.category === category) {
          return {
            ...item,
            answer,
            value: val,
          };
        }
        return item;
      }),
    }));
  };

  const handleMarkAllRemainingAsTak = () => {
    setReport((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (!item.answer || item.answer === 'unfilled') {
          return {
            ...item,
            answer: 'tak',
            value: 'TAK',
          };
        }
        return item;
      }),
    }));
  };

  const handleUpdateSignatures = (updates: {
    architectSignature?: string;
    architectSignedAt?: string;
    coordinatorSignature?: string;
    coordinatorSignedAt?: string;
  }) => {
    setReport((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleNewReport = () => {
    if (confirm('Czy na pewno chcesz utworzyć nowy czysty protokół? Aktualny stan został zapisany w historii.')) {
      const fresh = createEmptyReport();
      setReport(fresh);
      saveReportToHistory(fresh);
      setSavedReports(getSavedReports());
    }
  };

  const handleDeleteSavedReport = (id: string) => {
    deleteReportFromHistory(id);
    setSavedReports(getSavedReports());
  };

  const scrollToSignatures = () => {
    if (signaturesRef.current) {
      signaturesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPage1Element = (): HTMLElement | null =>
    printableDocRef.current?.querySelector<HTMLElement>('#pdf-export-page-1') ||
    printableDocRef.current?.querySelector<HTMLElement>('.pdf-page-1') ||
    printableDocRef.current?.querySelector<HTMLElement>('.pdf-page') ||
    document.getElementById('pdf-export-page-1') ||
    document.querySelector<HTMLElement>('#pdf-export-page-1') ||
    document.querySelector<HTMLElement>('.pdf-page-1') ||
    document.getElementById('pdf-page-1') ||
    document.querySelector<HTMLElement>('.pdf-page');

  const getPage2Element = (): HTMLElement | null =>
    printableDocRef.current?.querySelector<HTMLElement>('#pdf-export-page-2') ||
    printableDocRef.current?.querySelector<HTMLElement>('.pdf-page-2') ||
    document.getElementById('pdf-export-page-2') ||
    document.querySelector<HTMLElement>('#pdf-export-page-2') ||
    document.querySelector<HTMLElement>('.pdf-page-2') ||
    document.getElementById('pdf-page-2');

  // Filter items by category and filterMode
  const getFilteredCategoryItems = (catId: ChecklistItem['category']) => {
    return report.items
      .filter((i) => i.category === catId)
      .filter((i) => {
        if (filterMode === 'nie') return i.answer === 'nie';
        if (filterMode === 'unfilled') return !i.answer || i.answer === 'unfilled';
        return true;
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-28">
      {/* Top Application Bar */}
      <HeaderBar
        report={report}
        onNewReport={handleNewReport}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        savedReportsCount={savedReports.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* Navigation Tabs & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Section Selector Pills */}
          <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-1.5 text-xs font-medium no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Wszystkie sekcje
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'info'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              1-3. Dane ogólne
            </button>

            {CATEGORIES_CONFIG.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat.title}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setActiveTab('signatures');
                scrollToSignatures();
              }}
              className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'signatures'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              Podpisy ({stats.architectSigned && stats.coordinatorSigned ? '2/2' : stats.architectSigned || stats.coordinatorSigned ? '1/2' : '0/2'})
            </button>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 text-xs">
            <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filtr:
            </span>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Wszystkie ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('nie')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                filterMode === 'nie'
                  ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <XCircle className="w-3 h-3 text-rose-400" />
              NIE ({stats.nieCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('unfilled')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'unfilled'
                  ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              Brak ({stats.unfilledCount})
            </button>
          </div>
        </div>

        {/* Action Banner with Fast Fill and PDF Preview Toggle */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">
                Postęp weryfikacji: {stats.filled}/{stats.total} pozycji ({stats.percentComplete}%)
              </p>
              <p className="text-[11px] text-slate-400">
                {stats.unfilledCount > 0
                  ? `Pozostało ${stats.unfilledCount} pozycji do zaznaczenia (TAK / NIE / NIE DOTYCZY)`
                  : 'Wszystkie pozycje checklisty zostały zaznaczone!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {stats.unfilledCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRemainingAsTak}
                className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="Zaznacza pozostałe puste pozycje jako TAK"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Oznacz puste jako TAK</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowPdfPreview(!showPdfPreview)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              {showPdfPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
              <span>{showPdfPreview ? 'Ukryj podgląd tabeli' : 'Podgląd tabeli / PDF'}</span>
            </button>
          </div>
        </div>

        {/* Live PDF Table Preview Toggle */}
        {showPdfPreview && (
          <div className="bg-slate-900/95 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base text-slate-100">
                  Podgląd wydruku / tabeli PDF (odwzorowanie z załącznika)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Share2 className="w-3.5 h-3.5" />
                Pobierz / Udostępnij PDF
              </button>
            </div>

            {/* Scrollable container for preview */}
            <div className="overflow-x-auto p-2 bg-slate-950 rounded-xl border border-slate-800 flex justify-center">
              <div className="scale-[0.8] sm:scale-90 origin-top">
                <PrintableReportDocument report={report} idPrefix="preview" />
              </div>
            </div>
          </div>
        )}

        {/* TAB: First 3 Items (Projekt, Architekt, Koordynator) */}
        {(activeTab === 'all' || activeTab === 'info') && (
          <ReportInfoForm general={report.general} onChange={handleGeneralChange} />
        )}

        {/* TAB: Checklist Categories with TAK / NIE / NIE DOTYCZY buttons */}
        {CATEGORIES_CONFIG.map((cat) => {
          if (activeTab !== 'all' && activeTab !== cat.id) return null;
          const catItems = getFilteredCategoryItems(cat.id);
          if (catItems.length === 0 && filterMode !== 'all') return null;

          return (
            <ChecklistSection
              key={cat.id}
              title={cat.title}
              category={cat.id}
              items={catItems}
              onItemChange={handleItemChange}
              onSetAllInCategory={handleSetAllInCategory}
            />
          );
        })}

        {/* Additional Remarks Section */}
        {(activeTab === 'all' || activeTab === 'wykonczenie_scian' || activeTab === 'rzuty_plytek_lazienki') && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-2">
            <h3 className="text-sm font-bold text-slate-200">
              Inne uwagi i ustalenia końcowe (opcjonalnie)
            </h3>
            <textarea
              rows={2}
              value={report.otherRemarks || ''}
              onChange={(e) => setReport((prev) => ({ ...prev, otherRemarks: e.target.value }))}
              placeholder="Wpisz ewentualne dodatkowe ustalenia pomiędzy Architektem a Koordynatorem..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        )}

        {/* TAB: Signatures Section at the end */}
        {(activeTab === 'all' || activeTab === 'signatures') && (
          <div ref={signaturesRef} className="space-y-4">
            <SignaturesSection report={report} onUpdateSignatures={handleUpdateSignatures} />

            {/* Prominent Bottom Action: Generuj PDF & Udostępnij na dole protokołu */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Koniec protokołu
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Po uzupełnieniu danych i podpisaniu wygeneruj gotowy protokół w formacie PDF
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer shrink-0"
                >
                  <Share2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Generuj PDF &amp; Udostępnij</span>
                </button>
                <span className="text-[11px] text-slate-400 mt-1.5 font-medium tracking-wide">
                  opracował Kamil Sot
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Off-screen container for rendering crisp high-res PDF pages with html2canvas */}
      <div
        ref={printableDocRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '794px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -9999,
        }}
      >
        <PrintableReportDocument report={report} idPrefix="pdf-export" />
      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md px-4 py-2.5 sm:hidden flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-200">
              {stats.filled}/{stats.total} zaznaczonych ({stats.percentComplete}%)
            </span>
            <span className="text-[10px] text-amber-400 font-medium">
              Podpisy: {stats.isFullySigned ? '2/2 złożone' : stats.architectSigned || stats.coordinatorSigned ? '1/2' : '0/2'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollToSignatures}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 active:scale-95"
          >
            <PenTool className="w-3.5 h-3.5 text-amber-400" />
            Podpisz
          </button>
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              Generuj PDF
            </button>
            <span className="text-[9px] text-slate-400 mt-0.5 font-medium">opracował Kamil Sot</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExportEmailModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        report={report}
        getPage1Element={getPage1Element}
        getPage2Element={getPage2Element}
      />

      <SavedReportsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        reports={savedReports}
        onSelectReport={(selected) => setReport(selected)}
        onDeleteReport={handleDeleteSavedReport}
        onNewReport={handleNewReport}
      />

      <OfflineIndicator />
    </div>
  );
}
