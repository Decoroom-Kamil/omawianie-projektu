import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeAnswer,
  getAnswerDisplayLabel,
  calculateReportStats,
  generateEmailSubject,
  generateEmailBody,
  generateMailtoUrl,
  getReportFileName,
} from './reportLogic';
import { createSampleReportFromAttachment, createEmptyReport, DEFAULT_CHECKLIST_ITEMS } from '../types/report';

test('normalizeAnswer correctly identifies tak, nie, and nie_dotyczy', () => {
  assert.equal(normalizeAnswer('tak'), 'tak');
  assert.equal(normalizeAnswer('TAK'), 'tak');
  assert.equal(normalizeAnswer('ok'), 'tak');
  assert.equal(normalizeAnswer('nie'), 'nie');
  assert.equal(normalizeAnswer('NIE'), 'nie');
  assert.equal(normalizeAnswer('do poprawy'), 'nie');
  assert.equal(normalizeAnswer('nie dotyczy'), 'nie_dotyczy');
  assert.equal(normalizeAnswer('NIE DOTYCZY'), 'nie_dotyczy');
  assert.equal(normalizeAnswer('nd'), 'nie_dotyczy');
  assert.equal(normalizeAnswer(''), 'unfilled');
});

test('getAnswerDisplayLabel returns clean uppercase labels', () => {
  assert.equal(getAnswerDisplayLabel('tak'), 'TAK');
  assert.equal(getAnswerDisplayLabel('nie'), 'NIE');
  assert.equal(getAnswerDisplayLabel('nie_dotyczy'), 'NIE DOTYCZY');
  assert.equal(getAnswerDisplayLabel('unfilled'), '—');
});

test('DEFAULT_CHECKLIST_ITEMS has all 39 checklist items from the attachment', () => {
  assert.equal(DEFAULT_CHECKLIST_ITEMS.length, 39);

  // Check presence of key sections and items
  const czyPrzeslany = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'czy_projekt_przeslany');
  assert.ok(czyPrzeslany);
  assert.equal(czyPrzeslany.category, 'ogolne');

  const sufit = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'linia_sufitu_podwieszanego');
  assert.ok(sufit);
  assert.equal(sufit.category, 'zmiany_budowlane');

  const gniazda = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'wymiary_wysokosci_gniazd');
  assert.ok(gniazda);
  assert.equal(gniazda.category, 'instalacja_elektryczna');

  const deszczownica = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'wysokosc_deszczownicy');
  assert.ok(deszczownica);
  assert.equal(deszczownica.category, 'zmiany_wod_kan');

  const cwiercwalek = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'cwiercwalek_okna_glify');
  assert.ok(cwiercwalek);
  assert.equal(cwiercwalek.category, 'wykonczenie_posadzek');

  const hide = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'obrobienie_hide');
  assert.ok(hide);
  assert.equal(hide.category, 'stolarka_drzwiowa');

  const pasTech = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'pas_techniczny_mozaika');
  assert.ok(pasTech);
  assert.equal(pasTech.category, 'wykonczenie_scian');

  const parapety = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'wysokosci_parapetow_pasa');
  assert.ok(parapety);
  assert.equal(parapety.category, 'wizualizacje');

  const koloryScian = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'wpisane_kolory_scian');
  assert.ok(koloryScian);
  assert.equal(koloryScian.label, 'Wpisane wszystkie kolory ścian,');

  const podciecieRewizja = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'podciecie_rewizja');
  assert.ok(podciecieRewizja);
  assert.equal(podciecieRewizja.category, 'rzuty_plytek_lazienki');

  const koloryFug = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'kolory_fug');
  assert.ok(koloryFug);
  assert.equal(koloryFug.category, 'rzuty_plytek_lazienki');

  const klikKlak = DEFAULT_CHECKLIST_ITEMS.find((i) => i.id === 'korek_klik_klak');
  assert.ok(klikKlak);
  assert.equal(klikKlak.category, 'rzuty_plytek_lazienki');
});

test('calculateReportStats calculates correct numbers for sample report', () => {
  const sample = createSampleReportFromAttachment();
  const stats = calculateReportStats(sample.items, sample);

  assert.equal(stats.total, 39);
  assert.equal(stats.filled, 39);
  assert.equal(stats.percentComplete, 100);
  assert.equal(stats.nieCount, 1);
  assert.equal(stats.naCount, 2);
  assert.equal(stats.takCount, 36);
  assert.equal(stats.architectSigned, false);
  assert.equal(stats.coordinatorSigned, false);
  assert.equal(stats.isFullySigned, false);
});

test('calculateReportStats accurately detects signatures', () => {
  const sample = createSampleReportFromAttachment();
  sample.architectSignature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  sample.coordinatorSignature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const stats = calculateReportStats(sample.items, sample);
  assert.equal(stats.architectSigned, true);
  assert.equal(stats.coordinatorSigned, true);
  assert.equal(stats.isFullySigned, true);
});

test('createEmptyReport initializes the 3 custom data fields and 39 items', () => {
  const empty = createEmptyReport();
  assert.equal(empty.general.projekt, '');
  assert.equal(empty.general.architekt, '');
  assert.equal(empty.general.koordynator, '');
  assert.equal(empty.general.dataOmawiania, '');
  assert.equal(empty.items.length, 39);
  empty.items.forEach((item) => {
    assert.equal(item.answer, 'unfilled');
  });
});

test('generateEmailSubject contains project name and architect', () => {
  const sample = createSampleReportFromAttachment();
  const subject = generateEmailSubject(sample);
  assert.match(subject, /Protokół Omawiania Projektu/i);
  assert.match(subject, /Apartament 24/);
  assert.match(subject, /Joanna Nowak/);
});

test('getReportFileName formats clean filename with project slug', () => {
  const sample = createSampleReportFromAttachment();
  const filename = getReportFileName(sample);
  assert.match(filename, /^Protokol_Omawiania_Projektu_apartament_24/);
  assert.match(filename, /\.pdf$/);
});

test('generateEmailBody includes checklist summary and signatures', () => {
  const sample = createSampleReportFromAttachment();
  const body = generateEmailBody(sample);
  assert.match(body, /PROTOKÓŁ OMAWIANIA PROJEKTU/);
  assert.match(body, /Projekt: Apartament 24/);
  assert.match(body, /Architekt: Studio Projektowe Forma/);
  assert.match(body, /Koordynator: inż\. Michał Kowalski/);
  assert.match(body, /Odpowiedzi TAK \(zgodne\): 36/);
  assert.match(body, /Odpowiedzi NIE/);
  assert.match(body, /Kolizje oświetlenia z frontami/);
});

test('generateMailtoUrl formats subject correctly', () => {
  const sample = createSampleReportFromAttachment();
  const url = generateMailtoUrl(sample, 'architekt@studioforma.pl');
  assert.ok(url.startsWith('mailto:architekt@studioforma.pl?subject='));
});
