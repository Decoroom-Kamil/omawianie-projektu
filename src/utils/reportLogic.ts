import { ChecklistItem, InspectionReport, ChecklistAnswer } from '../types/report';

export interface ReportStats {
  total: number;
  filled: number;
  takCount: number;
  nieCount: number;
  naCount: number;
  unfilledCount: number;
  percentComplete: number;
  isFullySigned: boolean;
  architectSigned: boolean;
  coordinatorSigned: boolean;
}

/**
 * Normalizes input string to canonical ChecklistAnswer.
 */
export function normalizeAnswer(val: string): ChecklistAnswer {
  const trimmed = (val || '').trim().toLowerCase();
  if (!trimmed) return 'unfilled';
  if (trimmed === 'tak' || trimmed === 'ok' || trimmed === 'zgodne' || trimmed === 'poprawne') {
    return 'tak';
  }
  if (trimmed === 'nie' || trimmed === 'brak' || trimmed === 'do poprawy' || trimmed === 'kolizja') {
    return 'nie';
  }
  if (trimmed.includes('dotyczy') || trimmed === 'nd' || trimmed === 'n/d') {
    return 'nie_dotyczy';
  }
  return 'unfilled';
}

/**
 * Returns user-friendly uppercase label for display in UI and PDF.
 */
export function getAnswerDisplayLabel(answer: ChecklistAnswer): string {
  switch (answer) {
    case 'tak':
      return 'TAK';
    case 'nie':
      return 'NIE';
    case 'nie_dotyczy':
      return 'NIE DOTYCZY';
    default:
      return '—';
  }
}

/**
 * Calculates protocol statistics for UI badges and validation.
 */
export function calculateReportStats(items: ChecklistItem[], report?: InspectionReport): ReportStats {
  const total = items.length;
  let takCount = 0;
  let nieCount = 0;
  let naCount = 0;
  let unfilledCount = 0;

  for (const item of items) {
    const effectiveAnswer = item.answer && item.answer !== 'unfilled'
      ? item.answer
      : normalizeAnswer(item.value);

    if (effectiveAnswer === 'tak') takCount++;
    else if (effectiveAnswer === 'nie') nieCount++;
    else if (effectiveAnswer === 'nie_dotyczy') naCount++;
    else unfilledCount++;
  }

  const filled = total - unfilledCount;
  const percentComplete = total > 0 ? Math.round((filled / total) * 100) : 0;

  const architectSigned = Boolean(report?.architectSignature && report.architectSignature.length > 50);
  const coordinatorSigned = Boolean(report?.coordinatorSignature && report.coordinatorSignature.length > 50);
  const isFullySigned = architectSigned && coordinatorSigned;

  return {
    total,
    filled,
    takCount,
    nieCount,
    naCount,
    unfilledCount,
    percentComplete,
    isFullySigned,
    architectSigned,
    coordinatorSigned,
  };
}

/**
 * Formats a clean filename for PDF export.
 */
export function getReportFileName(report: InspectionReport): string {
  const projectSlug = (report.general.projekt || 'projekt')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '_')
    .slice(0, 30);
  const dateStr = (report.general.dataOmawiania || '')
    .replace(/[^0-9]/g, '')
    .slice(0, 8);
  return `Protokol_Omawiania_Projektu_${projectSlug || 'projekt'}_${dateStr || Date.now()}.pdf`;
}

/**
 * Generates email subject line.
 */
export function generateEmailSubject(report: InspectionReport): string {
  const proj = report.general.projekt || 'Projekt wnętrz';
  const arch = report.general.architekt ? ` • Architekt: ${report.general.architekt}` : '';
  return `Protokół Omawiania Projektu: ${proj}${arch}`;
}

/**
 * Generates formatted plain text email body summarizing the protocol.
 */
export function generateEmailBody(report: InspectionReport): string {
  const stats = calculateReportStats(report.items, report);
  const rejectedItems = report.items.filter((i) => i.answer === 'nie');

  let text = `Dzień dobry,\n\n`;
  text += `W załączeniu przesyłam oficjalny PROTOKÓŁ OMAWIANIA PROJEKTU.\n\n`;
  text += `DANE PROTOKOŁU:\n`;
  text += `• Projekt: ${report.general.projekt || 'Brak danych'}\n`;
  text += `• Architekt: ${report.general.architekt || 'Brak danych'}\n`;
  text += `• Koordynator: ${report.general.koordynator || 'Brak danych'}\n`;
  text += `• Data omawiania: ${report.general.dataOmawiania || 'Brak danych'}\n\n`;
  text += `PODSUMOWANIE CHECKLISTY:\n`;
  text += `• Łącznie punktów: ${stats.total}\n`;
  text += `• Odpowiedzi TAK (zgodne): ${stats.takCount}\n`;
  text += `• Odpowiedzi NIE (wymaga uwagi/korekty): ${stats.nieCount}\n`;
  text += `• Nie dotyczy: ${stats.naCount}\n`;
  text += `• Podpis Architekta: ${stats.architectSigned ? 'Złożony' : 'Brak'}\n`;
  text += `• Podpis Koordynatora: ${stats.coordinatorSigned ? 'Złożony' : 'Brak'}\n\n`;

  if (rejectedItems.length > 0) {
    text += `PUNKTY WYMAGAJĄCE UWAGI / KOREKTY (ODPOWIEDŹ 'NIE'):\n`;
    rejectedItems.forEach((item, idx) => {
      text += `${idx + 1}. ${item.label}${item.note ? ` — Uwaga: ${item.note}` : ''}\n`;
    });
    text += `\n`;
  }

  if (report.otherRemarks && report.otherRemarks.trim()) {
    text += `Inne uwagi: ${report.otherRemarks}\n\n`;
  }

  text += `Pełny protokół w formacie PDF z podpisami znajduje się w załączniku.\n\n`;
  text += `Z poważaniem,\n${report.general.koordynator || 'Koordynator'}`;

  return text;
}

/**
 * Generates mailto URL with recipient and subject.
 */
export function generateMailtoUrl(
  report: InspectionReport,
  customEmail?: string,
  includeBody: boolean = false
): string {
  const recipient = (customEmail ?? report.recipientEmail ?? '').trim();
  const subject = encodeURIComponent(generateEmailSubject(report));
  const bodyParam = includeBody ? `&body=${encodeURIComponent(generateEmailBody(report))}` : '';
  return `mailto:${recipient}?subject=${subject}${bodyParam}`;
}
