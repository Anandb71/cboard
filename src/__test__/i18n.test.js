import * as i18n from '../i18n';
import { APP_LANGS } from '../components/App/App.constants';

describe('i18n', () => {
  it('should strip Region Code', () => {
    expect(i18n.stripRegionCode('es-ES')).toBe('es');
  });
  it('should normalize Language Code', () => {
    expect(i18n.normalizeLanguageCode('ES-ES')).toBe('es-ES');
    expect(i18n.normalizeLanguageCode('es-es')).toBe('es-ES');
  });
  it('should normalize Language Code for two', () => {
    expect(i18n.normalizeLanguageCode('ES')).toBe('es');
    expect(i18n.normalizeLanguageCode('es')).toBe('es');
  });

  describe('getDefaultLang', () => {
    const originalLanguage = window.navigator.language;

    const setDeviceLanguage = (language) => {
      Object.defineProperty(window.navigator, 'language', {
        value: language,
        configurable: true
      });
    };

    afterEach(() => {
      setDeviceLanguage(originalLanguage);
    });

    it('should use the device language when the app supports it', () => {
      setDeviceLanguage('pt-PT');
      expect(i18n.getDefaultLang(APP_LANGS)).toBe('pt-PT');

      setDeviceLanguage('en-GB');
      expect(i18n.getDefaultLang(APP_LANGS)).toBe('en-GB');

      setDeviceLanguage('ru-RU');
      expect(i18n.getDefaultLang(APP_LANGS)).toBe('ru-RU');
    });

    it('should match the device language regardless of its case', () => {
      setDeviceLanguage('en-gb');
      expect(i18n.getDefaultLang(['en-US', 'en-GB'])).toBe('en-GB');
    });

    it('should fall back to another region of the device language', () => {
      setDeviceLanguage('es-MX');
      expect(i18n.getDefaultLang(['en-US', 'es-ES'])).toBe('es-ES');
    });

    it('should fall back to the default language when the device language is not supported', () => {
      setDeviceLanguage('xx-XX');
      expect(i18n.getDefaultLang(['es-ES', 'en-US'])).toBe('en-US');
    });
  });
});
