import React from 'react';
import { GeneralInfo } from '../types/report';
import { Building2, Calendar } from 'lucide-react';

interface ReportInfoFormProps {
  general: GeneralInfo;
  onChange: (updated: GeneralInfo) => void;
}

export function ReportInfoForm({ general, onChange }: ReportInfoFormProps) {
  const updateField = (field: keyof GeneralInfo, val: string) => {
    onChange({
      ...general,
      [field]: val,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100">
              Ogólne • Dane do protokołu
            </h2>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-amber-500/30">
          Pozycje 1 - 3
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
        {/* Pozycja 1: Projekt */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black flex items-center justify-center">
              1
            </span>
            <span>Projekt:</span>
          </label>
          <div className="relative">
            <input
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={general.projekt || ''}
              onChange={(e) => updateField('projekt', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
            />
          </div>
        </div>

        {/* Pozycja 2: Architekt */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black flex items-center justify-center">
              2
            </span>
            <span>Architekt:</span>
          </label>
          <div className="relative">
            <input
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={general.architekt || ''}
              onChange={(e) => updateField('architekt', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
            />
          </div>
        </div>

        {/* Pozycja 3: Koordynator */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black flex items-center justify-center">
              3
            </span>
            <span>Koordynator:</span>
          </label>
          <div className="relative">
            <input
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={general.koordynator || ''}
              onChange={(e) => updateField('koordynator', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Date row */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs">
        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-slate-300 font-medium">Data omawiania projektu:</span>
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={general.dataOmawiania || ''}
          onChange={(e) => updateField('dataOmawiania', e.target.value)}
          className="w-36 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>
    </div>
  );
}
