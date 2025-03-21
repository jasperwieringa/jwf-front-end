import i18next from 'i18next';
import { initLitI18n } from 'lit-i18n';

i18next.use(initLitI18n).init({
  lng: 'nl',
  resources: {
    en: {
      translation: {
        general: {
          close: 'Close',
          error: "Oops, something ain't right!",
          loading: 'Loading...',
          rtt: 'Back to the top',
          rtt_no_target: 'No container element found!',
        },
        section_errors: {
          missing_interactions: 'You did not create an interactions section yet',
        },
        contact: {
          name: 'Name:',
          address: 'Address:',
          postalCode: 'Zip:',
          email: 'Email:',
          phone: 'Phone:',
          kvk: 'KvK:',
        },
      },
    },
    nl: {
      translation: {
        general: {
          close: 'Sluiten',
          error: 'Oops, hier klopt iets niet!',
          loading: 'Laden...',
          rtt: 'Terug naar boven',
          rtt_no_target: 'Geen container element gevonden!',
        },
        section_errors: {
          missing_interactions: 'Je hebt nog geen interactie sectie aangemaakt',
        },
        contact: {
          name: 'Naam:',
          address: 'Adres:',
          postalCode: 'Postcode:',
          email: 'Email:',
          phone: 'Telefoonnummer:',
          kvk: 'KvK:',
        },
      },
    },
  },
});
