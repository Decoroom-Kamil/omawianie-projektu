import {
  InspectionReport,
  createEmptyReport,
  DEFAULT_CHECKLIST_ITEMS,
  ChecklistItem,
} from '../types/report';

const DRAFT_KEY = 'protokol_omawiania_current_draft_v2';
const REPORTS_LIST_KEY = 'protokol_omawiania_history_v2';

export function loadCurrentDraft(): InspectionReport {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const base = createEmptyReport();

        // Project meeting general info
        const general = {
          projekt: parsed.general?.projekt || '',
          architekt: parsed.general?.architekt || '',
          koordynator: parsed.general?.koordynator || '',
          dataOmawiania: parsed.general?.dataOmawiania || '',
        };

        // Ensure all canonical 39 items exist
        const parsedItems = Array.isArray(parsed.items) ? parsed.items : [];
        const existingMap = new Map<string, any>(parsedItems.map((i: any) => [i.id, i]));

        const items: ChecklistItem[] = DEFAULT_CHECKLIST_ITEMS.map((defItem) => {
          const found = existingMap.get(defItem.id);
          if (found) {
            let answer = found.answer;
            if (!answer || answer === 'unfilled') {
              const val = (found.value || '').trim().toLowerCase();
              if (val === 'tak' || val === 'ok') answer = 'tak';
              else if (val === 'nie') answer = 'nie';
              else if (val.includes('dotyczy')) answer = 'nie_dotyczy';
              else answer = 'unfilled';
            }
            return {
              ...defItem,
              answer: answer || 'unfilled',
              value: found.value || (answer === 'tak' ? 'TAK' : answer === 'nie' ? 'NIE' : answer === 'nie_dotyczy' ? 'NIE DOTYCZY' : ''),
              note: found.note || '',
              photos: Array.isArray(found.photos) ? found.photos : [],
            };
          }
          return {
            ...defItem,
            answer: 'unfilled',
            value: '',
            note: '',
            photos: [],
          };
        });

        return {
          id: parsed.id || base.id,
          createdAt: parsed.createdAt || base.createdAt,
          updatedAt: new Date().toISOString(),
          general,
          items,
          otherRemarks: parsed.otherRemarks || '',
          architectSignature: parsed.architectSignature || '',
          architectSignedAt: parsed.architectSignedAt || '',
          coordinatorSignature: parsed.coordinatorSignature || parsed.inspectorSignature || '',
          coordinatorSignedAt: parsed.coordinatorSignedAt || '',
          recipientEmail: parsed.recipientEmail || '',
        };
      }
    }
  } catch (e) {
    console.error('Error loading draft from localStorage', e);
  }
  return createEmptyReport();
}

export function saveCurrentDraft(report: InspectionReport): void {
  try {
    const updated = {
      ...report,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving draft to localStorage', e);
  }
}

export function getSavedReports(): InspectionReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_LIST_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading saved reports', e);
  }
  return [];
}

export function saveReportToHistory(report: InspectionReport): void {
  try {
    const list = getSavedReports();
    const existingIdx = list.findIndex((r) => r.id === report.id);
    const toSave = { ...report, updatedAt: new Date().toISOString() };
    if (existingIdx >= 0) {
      list[existingIdx] = toSave;
    } else {
      list.unshift(toSave);
    }
    localStorage.setItem(REPORTS_LIST_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving report to history', e);
  }
}

export function deleteReportFromHistory(id: string): void {
  try {
    const list = getSavedReports().filter((r) => r.id !== id);
    localStorage.setItem(REPORTS_LIST_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error deleting report from history', e);
  }
}
