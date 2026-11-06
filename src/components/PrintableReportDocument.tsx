import React, { forwardRef } from 'react';
import { InspectionReport, ChecklistItem } from '../types/report';
import { getAnswerDisplayLabel } from '../utils/reportLogic';

interface PrintableReportDocumentProps {
  report: InspectionReport;
  idPrefix?: string;
}

export const PrintableReportDocument = forwardRef<HTMLDivElement, PrintableReportDocumentProps>(
  ({ report, idPrefix }, ref) => {
    const getItem = (id: string) => report.items.find((i) => i.id === id);

    // Group items by category
    const itemsByCategory = (category: ChecklistItem['category']) =>
      report.items.filter((i) => i.category === category);

    const totalPages = 2;

    return (
      <div ref={ref} className="printable-report-container text-[#000000] font-sans">
        {/* ======================================================== */}
        {/* PAGE 1: Główna tabela protokołu (część 1)                */}
        {/* ======================================================== */}
        <div
          id={idPrefix ? `${idPrefix}-page-1` : 'pdf-page-1'}
          className={`pdf-page pdf-page-1 ${idPrefix ? `${idPrefix}-page-1` : ''} w-[794px] min-h-[1123px] p-[28px] bg-white mx-auto flex flex-col justify-between box-border text-[11px] relative shadow-lg mb-8 print:shadow-none print:m-0`}
          style={{ width: '794px', height: '1123px', boxSizing: 'border-box' }}
        >
          <div>
            {/* Table Part 1: Ogólne, Budowlane, Elektryczne, Wod-Kan, Posadzki */}
            <table className="w-full border-collapse border border-[#334155] text-[10.5px] leading-normal [&_td]:align-middle [&_th]:align-middle">
              <thead>
                <tr className="bg-[#e2e8f0] border-b border-[#334155]">
                  <th
                    colSpan={2}
                    className="py-1.5 px-3 text-center align-middle font-bold text-[#0f172a] text-[12px] uppercase tracking-wider border border-[#334155]"
                  >
                    Ogólne
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Pozycja 1: Projekt */}
                <tr className="border-b border-[#334155]">
                  <td className="w-[68%] py-[3.5px] px-2 font-normal text-[#020617] align-middle border-r border-[#334155]">
                    Projekt:
                  </td>
                  <td className="w-[32%] py-[3.5px] px-2 font-semibold text-[#020617] align-middle bg-[#f8fafc]">
                    {report.general.projekt || '—'}
                  </td>
                </tr>

                {/* Pozycja 2: Architekt */}
                <tr className="border-b border-[#334155]">
                  <td className="py-[3.5px] px-2 font-normal text-[#020617] align-middle border-r border-[#334155]">
                    Architekt:
                  </td>
                  <td className="py-[3.5px] px-2 font-semibold text-[#020617] align-middle bg-[#f8fafc]">
                    {report.general.architekt || '—'}
                  </td>
                </tr>

                {/* Pozycja 3: Koordynator */}
                <tr className="border-b border-[#334155]">
                  <td className="py-[3.5px] px-2 font-normal text-[#020617] align-middle border-r border-[#334155]">
                    Koordynator:
                  </td>
                  <td className="py-[3.5px] px-2 font-semibold text-[#020617] align-middle bg-[#f8fafc]">
                    {report.general.koordynator || '—'}
                  </td>
                </tr>

                {/* Pozycja 4: Czy projekt był przesłany do sprawdzenia */}
                {(() => {
                  const item = getItem('czy_projekt_przeslany');
                  const ans = item ? getAnswerDisplayLabel(item.answer) : '—';
                  const isNie = item?.answer === 'nie';
                  return (
                    <tr className="border-b border-[#334155]">
                      <td className="w-[68%] py-[3.5px] px-2 font-normal text-[#020617] align-middle border-r border-[#334155]">
                        Czy projekt był przesłany do sprawdzenia:
                      </td>
                      <td
                        className={`w-[32%] py-[3.5px] px-2 text-center align-middle ${
                          isNie ? 'bg-[#fee2e2] text-[#991b1b]' : ans === 'TAK' ? 'bg-[#ecfdf5] text-[#065f46]' : 'text-[#020617]'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center leading-tight">
                          <span className="font-bold">{ans}</span>
                          {item?.note && (
                            <span className="block text-[8.5px] font-normal text-[#0f172a] mt-0.5 leading-tight italic break-words">
                              {item.note}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })()}

                {/* SEKCJA: Zmiany budowlane */}
                <tr className="bg-[#f1f5f9] border-y border-[#334155]">
                  <td colSpan={2} className="py-[3.5px] px-2 font-bold text-[#0f172a] align-middle border border-[#334155]">
                    Zmiany budowlane
                  </td>
                </tr>
                {itemsByCategory('zmiany_budowlane').map((item) => renderTableRow(item))}

                {/* SEKCJA: Instalacja elektryczna */}
                <tr className="bg-[#f1f5f9] border-y border-[#334155]">
                  <td colSpan={2} className="py-[3.5px] px-2 font-bold text-[#0f172a] align-middle border border-[#334155]">
                    Instalacja elektryczna
                  </td>
                </tr>
                {itemsByCategory('instalacja_elektryczna').map((item) => renderTableRow(item))}

                {/* SEKCJA: Zmiany wod-kan */}
                <tr className="bg-[#f1f5f9] border-y border-[#334155]">
                  <td colSpan={2} className="py-[3.5px] px-2 font-bold text-[#0f172a] align-middle border border-[#334155]">
                    Zmiany wod-kan
                  </td>
                </tr>
                {itemsByCategory('zmiany_wod_kan').map((item) => renderTableRow(item))}

                {/* SEKCJA: Wykończenie posadzek */}
                <tr className="bg-[#f1f5f9] border-y border-[#334155]">
                  <td colSpan={2} className="py-[3.5px] px-2 font-bold text-[#0f172a] align-middle border border-[#334155]">
                    Wykończenie posadzek
                  </td>
                </tr>
                {itemsByCategory('wykonczenie_posadzek').map((item) => renderTableRow(item))}
              </tbody>
            </table>
          </div>

          {/* Footer Page 1 */}
          <div className="pt-2 border-t border-[#cbd5e1] flex justify-between text-[10px] text-[#64748b] mt-2">
            <span>
              Protokół omawiania projektu • {report.general.projekt || 'Projekt'}{report.general.dataOmawiania ? ` • ${report.general.dataOmawiania}` : ''}
            </span>
            <span>Strona 1 z {totalPages}</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PAGE 2: Główna tabela protokołu (część 2) + Podpisy      */}
        {/* ======================================================== */}
        <div
          id={idPrefix ? `${idPrefix}-page-2` : 'pdf-page-2'}
          className={`pdf-page pdf-page-2 ${idPrefix ? `${idPrefix}-page-2` : ''} w-[794px] min-h-[1123px] p-[28px] bg-white mx-auto flex flex-col justify-between box-border text-[11px] relative shadow-lg mb-8 print:shadow-none print:m-0`}
          style={{ width: '794px', height: '1123px', boxSizing: 'border-box' }}
        >
          <div>
            {/* Table Part 2: Stolarka, Ściany, Parapet, Łazienki, Podpisy */}
            <table className="w-full border-collapse border border-[#334155] text-[10.5px] leading-normal [&_td]:align-middle [&_th]:align-middle">
              <thead>
                <tr className="bg-[#e2e8f0] border-b border-[#334155]">
                  <th
                    colSpan={2}
                    className="py-1.5 px-3 text-center align-middle font-bold text-[#0f172a] text-[12px] uppercase tracking-wider border border-[#334155]"
                  >
                    Protokół omawiania projektu — część 2
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* SEKCJA: Stolarka drzwiowa */}
                <tr className="bg-[#f1f5f9] border-y border-[#334155]">
                  <td colSpan={2} className="py-[3.5px] px-2 font-bold text-[#0f172a] align-middle border border-[#334155]">
                    Stolarka drzwiowa
                  </td>
                </tr>
                {itemsByCategory('stolarka_drzwiowa').map((item) => renderTableRow(item))}

                {/* SEKCJA: Wykończenie ścian */}
                <tr className="bg-[#f1f5f9] border-y border-[#334155]">
                  <td colSpan={2} className="py-[3.5px] px-2 font-bold text-[#0f172a] align-middle border border-[#334155]">
                    Wykończenie ścian
                  </td>
                </tr>
                {itemsByCategory('wykonczenie_scian').map((item) => renderTableRow(item))}

                {/* SEKCJA: Parapet */}
                <tr className="bg-[#f1f5f9] border-y border-[#334155]">
                  <td colSpan={2} className="py-[3.5px] px-2 font-bold text-[#0f172a] align-middle border border-[#334155]">
                    Parapet
                  </td>
                </tr>
                {itemsByCategory('wizualizacje').map((item) => renderTableRow(item))}

                {/* SEKCJA: Rzuty płytek / Łazienki */}
                <tr className="bg-[#f1f5f9] border-y border-[#334155]">
                  <td colSpan={2} className="py-[3.5px] px-2 font-bold text-[#0f172a] align-middle border border-[#334155]">
                    Rzuty płytek / Łazienki
                  </td>
                </tr>
                {itemsByCategory('rzuty_plytek_lazienki').map((item) => renderTableRow(item))}

                {/* SEKCJA PODPISY: Podpis architekta */}
                <tr className="border-t-2 border-[#334155]">
                  <td className="w-[68%] py-2 px-2 font-bold text-[#0f172a] align-middle border-r border-[#334155]">
                    <div>Podpis architekta</div>
                    {report.general.architekt && (
                      <div className="text-[9.5px] font-normal text-[#475569]">
                        {report.general.architekt}
                      </div>
                    )}
                    {report.architectSignedAt && (
                      <div className="text-[9px] text-[#64748b]">
                        Data: {report.architectSignedAt}
                      </div>
                    )}
                  </td>
                  <td className="w-[32%] py-1 px-2 h-14 text-center align-middle bg-white">
                    {report.architectSignature ? (
                      <img
                        src={report.architectSignature}
                        alt="Podpis architekta"
                        className="max-h-12 max-w-full mx-auto object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-[#94a3b8] italic">
                        [Miejsce na podpis architekta]
                      </span>
                    )}
                  </td>
                </tr>

                {/* SEKCJA PODPISY: Podpis koordynatora */}
                <tr className="border-t border-[#334155]">
                  <td className="w-[68%] py-2 px-2 font-bold text-[#0f172a] align-middle border-r border-[#334155]">
                    <div>Podpis koordynatora</div>
                    {report.general.koordynator && (
                      <div className="text-[9.5px] font-normal text-[#475569]">
                        {report.general.koordynator}
                      </div>
                    )}
                    {report.coordinatorSignedAt && (
                      <div className="text-[9px] text-[#64748b]">
                        Data: {report.coordinatorSignedAt}
                      </div>
                    )}
                  </td>
                  <td className="w-[32%] py-1 px-2 h-14 text-center align-middle bg-white">
                    {report.coordinatorSignature ? (
                      <img
                        src={report.coordinatorSignature}
                        alt="Podpis koordynatora"
                        className="max-h-12 max-w-full mx-auto object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-[#94a3b8] italic">
                        [Miejsce na podpis koordynatora]
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Dodatkowe ustalenia i uwagi na stronie 2 pod podpisami */}
            {report.otherRemarks && (
              <div className="mt-4">
                <div className="text-[11px] font-bold text-[#0f172a] uppercase tracking-wide mb-1.5 border-b border-[#334155] pb-1">
                  Dodatkowe ustalenia i uwagi do projektu:
                </div>
                <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded text-[10.5px] text-[#0f172a] whitespace-pre-wrap leading-relaxed">
                  {report.otherRemarks}
                </div>
              </div>
            )}
          </div>

          {/* Footer Page 2 */}
          <div className="pt-2 border-t border-[#cbd5e1] flex justify-between text-[10px] text-[#64748b] mt-2">
            <span>
              Protokół omawiania projektu • {report.general.projekt || 'Projekt'}{report.general.dataOmawiania ? ` • ${report.general.dataOmawiania}` : ''}
            </span>
            <span>Strona 2 z {totalPages}</span>
          </div>
        </div>
      </div>
    );
  }
);

PrintableReportDocument.displayName = 'PrintableReportDocument';

function renderTableRow(item: ChecklistItem) {
  const ans = getAnswerDisplayLabel(item.answer);
  const isNie = item.answer === 'nie';
  const isTak = item.answer === 'tak';

  return (
    <tr key={item.id} className="border-b border-[#334155]">
      <td className="w-[68%] py-[3px] px-2 text-[#020617] border-r border-[#334155] leading-normal align-middle">
        <span>{item.label}</span>
      </td>
      <td
        className={`w-[32%] py-[3px] px-2 text-center align-middle border-[#334155] text-[10px] ${
          isNie
            ? 'bg-[#fee2e2] text-[#991b1b]'
            : isTak
            ? 'bg-[#ecfdf5] text-[#065f46]'
            : item.answer === 'nie_dotyczy'
            ? 'bg-[#f1f5f9] text-[#475569]'
            : 'text-[#94a3b8]'
        }`}
      >
        <div className="flex flex-col items-center justify-center leading-tight">
          <span className="font-bold">{ans}</span>
          {item.note && (
            <span className="block text-[8.5px] font-normal text-[#0f172a] mt-0.5 leading-tight italic break-words">
              {item.note}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}
