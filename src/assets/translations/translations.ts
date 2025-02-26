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
          missing_banner: 'You did not create a banner section yet',
        },
        api_errors: {
          fetch_banner: 'We could not retrieve the banner section',
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
          missing_banner: 'Je hebt nog geen banner sectie aangemaakt',
        },
        api_errors: {
          fetch_banner: 'We konden de banner sectie niet ophalen',
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
