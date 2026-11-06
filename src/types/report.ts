export type ChecklistAnswer = 'tak' | 'nie' | 'nie_dotyczy' | 'unfilled';

export interface ChecklistItem {
  id: string;
  label: string;
  category:
    | 'ogolne'
    | 'zmiany_budowlane'
    | 'instalacja_elektryczna'
    | 'zmiany_wod_kan'
    | 'wykonczenie_posadzek'
    | 'stolarka_drzwiowa'
    | 'wykonczenie_scian'
    | 'wizualizacje'
    | 'rzuty_plytek_lazienki';
  value: string; // 'tak' | 'nie' | 'nie dotyczy' | or custom text
  answer: ChecklistAnswer;
  note?: string; // opcjonalna uwaga / komentarz
  photos?: string[]; // opcjonalne zdjęcia / załączniki
}

export interface GeneralInfo {
  projekt: string; // Pierwsza pozycja: Projekt
  architekt: string; // Druga pozycja: Architekt
  koordynator: string; // Trzecia pozycja: Koordynator
  dataOmawiania?: string; // Data omawiania projektu
}

export interface InspectionReport {
  id: string;
  createdAt: string;
  updatedAt: string;
  general: GeneralInfo;
  items: ChecklistItem[];
  otherRemarks?: string;
  architectSignature?: string; // Data URL PNG podpisu odręcznego architekta
  architectSignedAt?: string;
  coordinatorSignature?: string; // Data URL PNG podpisu odręcznego koordynatora
  coordinatorSignedAt?: string;
  recipientEmail?: string;
}

export interface CategoryMeta {
  id: ChecklistItem['category'];
  title: string;
  description: string;
}

export const CATEGORIES_CONFIG: CategoryMeta[] = [
  {
    id: 'ogolne',
    title: 'Ogólne',
    description: 'Weryfikacja wstępna projektu',
  },
  {
    id: 'zmiany_budowlane',
    title: 'Zmiany budowlane',
    description: 'Wymiary, wentylacja oraz linie sufitów',
  },
  {
    id: 'instalacja_elektryczna',
    title: 'Instalacja elektryczna',
    description: 'Gniazda, włączniki, obwody, oświetlenie i skrzynka',
  },
  {
    id: 'zmiany_wod_kan',
    title: 'Zmiany wod-kan',
    description: 'Wymiary, wkucia, deszczownice i odpływy',
  },
  {
    id: 'wykonczenie_posadzek',
    title: 'Wykończenie posadzek',
    description: 'Płytki, panele, dylatacje, ćwierćwałki i listwy',
  },
  {
    id: 'stolarka_drzwiowa',
    title: 'Stolarka drzwiowa',
    description: 'Otwory, kierunki, systemy hide i ościeżnice',
  },
  {
    id: 'wykonczenie_scian',
    title: 'Wykończenie ścian',
    description: 'Kolory, sztukaterie, pas techniczny i gładzie',
  },
  {
    id: 'wizualizacje',
    title: 'Parapet',
    description: 'Zgodność wysokości parapetów i pasów roboczych',
  },
  {
    id: 'rzuty_plytek_lazienki',
    title: 'Rzuty płytek / Łazienki',
    description: 'Płytki startowe, geberit, rewizje, fugi i armatura',
  },
];

/**
 * All checklist items matching the attached PDF document exactly in order.
 */
export const DEFAULT_CHECKLIST_ITEMS: Omit<ChecklistItem, 'value' | 'answer' | 'photos' | 'note'>[] = [
  // Ogólne
  {
    id: 'czy_projekt_przeslany',
    category: 'ogolne',
    label: 'Czy projekt był przesłany do sprawdzenia:',
  },

  // Zmiany budowlane
  {
    id: 'zaznaczone_wymiary_zmian',
    category: 'zmiany_budowlane',
    label: 'Zaznaczone wymiary zmian',
  },
  {
    id: 'zmiany_wentylacji',
    category: 'zmiany_budowlane',
    label: 'Zmiany wentylacji',
  },
  {
    id: 'linia_sufitu_podwieszanego',
    category: 'zmiany_budowlane',
    label: 'Czy linia sufitu podwieszaneg równa się z podłogą/zabudową meblową',
  },

  // Instalacja elektryczna
  {
    id: 'gniazda_do_usuniecia',
    category: 'instalacja_elektryczna',
    label: 'Zaznaczone gniazda do usunięcia',
  },
  {
    id: 'wymiary_wysokosci_gniazd',
    category: 'instalacja_elektryczna',
    label: 'Zaznaczone wymiary i wysokości gniazd',
  },
  {
    id: 'obwody_wlacznikow_lamp',
    category: 'instalacja_elektryczna',
    label: 'Zaznaczone obwody włączników i lamp',
  },
  {
    id: 'wlaczniki_po_dobrej_stronie',
    category: 'instalacja_elektryczna',
    label: 'Włączniki po dobrej stronie drzwi',
  },
  {
    id: 'transformatory_led_barwa',
    category: 'instalacja_elektryczna',
    label: 'Umiejscowienie transformatorów i led, barwa led',
  },
  {
    id: 'kolizje_oswietlenia_fronty',
    category: 'instalacja_elektryczna',
    label: 'Kolizje oświetlenia z frontami',
  },
  {
    id: 'kolizja_wlacznikow_oscieznice',
    category: 'instalacja_elektryczna',
    label: 'Kolizja włączników z ościeżnicami, kasetami',
  },
  {
    id: 'dodatkowe_gniazdo_piekarnik',
    category: 'instalacja_elektryczna',
    label: 'Dodatkowe gniazdo do piekarnika - czy ze skrzynki elektrycznej czy od przyłącza 400V',
  },
  {
    id: 'miejsce_w_skrzynce_elektrycznej',
    category: 'instalacja_elektryczna',
    label: 'Czy jest miejsce w skrzynce elektrycznej na dodatkowe obwody elektryczne',
  },

  // Zmiany wod-kan
  {
    id: 'wymiary_informacja_wkuciu',
    category: 'zmiany_wod_kan',
    label: 'Wymiary, informacja o wkuciu',
  },
  {
    id: 'wysokosc_deszczownicy',
    category: 'zmiany_wod_kan',
    label: 'Wysokość deszczownicy, przyłączy, słuchawki',
  },
  {
    id: 'wymiar_odplywu_liniowego',
    category: 'zmiany_wod_kan',
    label: 'Wymiar odpływu liniowego',
  },

  // Wykończenie posadzek
  {
    id: 'punkty_startowe_plytek',
    category: 'wykonczenie_posadzek',
    label: 'Punkty startowe płytek',
  },
  {
    id: 'laczenie_plytek_pod_drzwiami',
    category: 'wykonczenie_posadzek',
    label: 'Łączenie płytek pod drzwiami',
  },
  {
    id: 'laczenie_podlog_zabudowa',
    category: 'wykonczenie_posadzek',
    label: 'Łączenie podłóg na równi z zabudową meblową',
  },
  {
    id: 'kierunek_ukladania_drewna',
    category: 'wykonczenie_posadzek',
    label: 'Kierunek układania paneli/drewna',
  },
  {
    id: 'cwiercwalek_okna_glify',
    category: 'wykonczenie_posadzek',
    label: 'Ćwierćwałek pod oknami, w glifach,',
  },
  {
    id: 'wykonczenie_schodow_antresoli',
    category: 'wykonczenie_posadzek',
    label: 'Wykończenie schodów/antresoli,',
  },
  {
    id: 'miejsce_profile_kabiny',
    category: 'wykonczenie_posadzek',
    label: 'Miejsce na profile kabiny prysznicowej',
  },
  {
    id: 'listwy_nieprzyklejone_meble',
    category: 'wykonczenie_posadzek',
    label: 'Listwy nieprzyklejone w miejcach mebli',
  },

  // Stolarka drzwiowa
  {
    id: 'kierunki_otwierania_otwory',
    category: 'stolarka_drzwiowa',
    label: 'Kierunki otwierania, wymiary otworów,',
  },
  {
    id: 'obrobienie_hide',
    category: 'stolarka_drzwiowa',
    label: 'Obrobienie hide - sposób wykończenia',
  },
  {
    id: 'oscieznice_mdf_wanna',
    category: 'stolarka_drzwiowa',
    label: 'Ościeżnice mdf blisko prysznica, wanny',
  },

  // Wykończenie ścian
  {
    id: 'oznaczenie_zgodnie_legenda',
    category: 'wykonczenie_scian',
    label: 'Oznaczenie zgodnie z legendą,',
  },
  {
    id: 'wpisane_kolory_scian',
    category: 'wykonczenie_scian',
    label: 'Wpisane wszystkie kolory ścian,',
  },
  {
    id: 'sztukaterie_kolizje',
    category: 'wykonczenie_scian',
    label: 'Sztukaterie przy meblach, zasłonach-kolizje',
  },
  {
    id: 'pas_techniczny_mozaika',
    category: 'wykonczenie_scian',
    label: 'Pas techniczny - wymiary, mozaika pod blat',
  },
  {
    id: 'pas_techniczny_zgodny_zabudowa',
    category: 'wykonczenie_scian',
    label: 'Pas techniczny -wymiary zgodne z podłogą / zabudową meblową',
  },
  {
    id: 'gladz_malowanie_do_mebli',
    category: 'wykonczenie_scian',
    label: 'Gładź/malowanie dochodzące do mebli',
  },

  // Wizualizacje
  {
    id: 'wysokosci_parapetow_pasa',
    category: 'wizualizacje',
    label: 'Wysokości parapetów/pasa roboczego zgodne wysokością',
  },

  // Rzuty płytek / Łazienki
  {
    id: 'plytki_startowe',
    category: 'rzuty_plytek_lazienki',
    label: 'Płytki startowe',
  },
  {
    id: 'oznaczenie_plytek_geberit',
    category: 'rzuty_plytek_lazienki',
    label: 'Oznaczenie płytek na gebericie, bokach, półkach,',
  },
  {
    id: 'podciecie_rewizja',
    category: 'rzuty_plytek_lazienki',
    label: 'Podcięcie, rewizja,',
  },
  {
    id: 'kolory_fug',
    category: 'rzuty_plytek_lazienki',
    label: 'Kolory fug',
  },
  {
    id: 'korek_klik_klak',
    category: 'rzuty_plytek_lazienki',
    label: 'Korek klik-klak do baterii,',
  },
];

export function createEmptyReport(): InspectionReport {
  return {
    id: `prot_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    general: {
      projekt: '',
      architekt: '',
      koordynator: '',
      dataOmawiania: '',
    },
    items: DEFAULT_CHECKLIST_ITEMS.map((item) => ({
      ...item,
      value: '',
      answer: 'unfilled',
      note: '',
      photos: [],
    })),
    otherRemarks: '',
    architectSignature: '',
    architectSignedAt: '',
    coordinatorSignature: '',
    coordinatorSignedAt: '',
    recipientEmail: '',
  };
}

export function createSampleReportFromAttachment(): InspectionReport {
  return {
    id: `prot_sample_omawianie`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    general: {
      projekt: 'Apartament 24 - Rezydencja Mokotów',
      architekt: 'Studio Projektowe Forma / arch. Joanna Nowak',
      koordynator: 'inż. Michał Kowalski',
      dataOmawiania: '',
    },
    items: DEFAULT_CHECKLIST_ITEMS.map((item, idx) => {
      // Create a realistic sample where most are TAK, some NIE with notes, and some NIE DOTYCZY
      let answer: ChecklistAnswer = 'tak';
      let value = 'TAK';
      let note = '';

      if (item.id === 'cwiercwalek_okna_glify') {
        answer = 'nie_dotyczy';
        value = 'NIE DOTYCZY';
        note = 'Okna do samej posadzki bez podokienników';
      } else if (item.id === 'wykonczenie_schodow_antresoli') {
        answer = 'nie_dotyczy';
        value = 'NIE DOTYCZY';
        note = 'Mieszkanie jednopoziomowe';
      } else if (item.id === 'kolizje_oswietlenia_fronty') {
        answer = 'nie';
        value = 'NIE';
        note = 'Oprawa w garderobie do przesunięcia o 12 cm';
      } else if (item.id === 'dodatkowe_gniazdo_piekarnik') {
        answer = 'tak';
        value = 'TAK';
        note = 'Bezpośrednio z dedykowanego obwodu w skrzynce';
      }

      return {
        ...item,
        answer,
        value,
        note,
        photos: [],
      };
    }),
    otherRemarks: 'Projekt omówiony pozytywnie po uwzględnieniu przesunięcia oprawy w garderobie.',
    architectSignature: '',
    architectSignedAt: '',
    coordinatorSignature: '',
    coordinatorSignedAt: '',
    recipientEmail: '',
  };
}
