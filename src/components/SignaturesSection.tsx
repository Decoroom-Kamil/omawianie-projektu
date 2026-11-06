import React from 'react';
import { InspectionReport } from '../types/report';
import { SignaturePad } from './SignaturePad';
import { PenTool, CheckCircle2, AlertCircle } from 'lucide-react';

interface SignaturesSectionProps {
  report: InspectionReport;
  onUpdateSignatures: (updates: {
    architectSignature?: string;
    architectSignedAt?: string;
    coordinatorSignature?: string;
    coordinatorSignedAt?: string;
  }) => void;
}

export function SignaturesSection({ report, onUpdateSignatures }: SignaturesSectionProps) {
  const isArchitectSigned = Boolean(report.architectSignature && report.architectSignature.length > 50);
  const isCoordinatorSigned = Boolean(report.coordinatorSignature && report.coordinatorSignature.length > 50);
  const bothSigned = isArchitectSigned && isCoordinatorSigned;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              Podpisy stron protokołu
            </h2>
            <p className="text-xs text-slate-400">
              Podpisz odręcznie palcem lub rysikiem na ekranie urządzenia
            </p>
          </div>
        </div>

        {/* Global signature badge */}
        <div>
          {bothSigned ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Komplet podpisów złożony
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              {!isArchitectSigned && !isCoordinatorSigned
                ? 'Oczekuje na oba podpisy'
                : !isArchitectSigned
                ? 'Brak podpisu Architekta'
                : 'Brak podpisu Koordynatora'}
            </span>
          )}
        </div>
      </div>

      {/* Grid of the 2 signature pads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pad 1: Architekt */}
        <SignaturePad
          title="Podpis architekta"
          role="architekt"
          signerName={report.general.architekt || 'Architekt prowadzący'}
          signatureDataUrl={report.architectSignature}
          signedAt={report.architectSignedAt}
          onSaveSignature={(dataUrl, signedAt) => {
            onUpdateSignatures({
              architectSignature: dataUrl,
              architectSignedAt: signedAt,
            });
          }}
          onClearSignature={() => {
            onUpdateSignatures({
              architectSignature: '',
              architectSignedAt: '',
            });
          }}
        />

        {/* Pad 2: Koordynator */}
        <SignaturePad
          title="Podpis koordynatora"
          role="koordynator"
          signerName={report.general.koordynator || 'Koordynator'}
          signatureDataUrl={report.coordinatorSignature}
          signedAt={report.coordinatorSignedAt}
          onSaveSignature={(dataUrl, signedAt) => {
            onUpdateSignatures({
              coordinatorSignature: dataUrl,
              coordinatorSignedAt: signedAt,
            });
          }}
          onClearSignature={() => {
            onUpdateSignatures({
              coordinatorSignature: '',
              coordinatorSignedAt: '',
            });
          }}
        />
      </div>
    </div>
  );
}
