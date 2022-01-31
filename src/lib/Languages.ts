import assertUnreachable from './assertUnreachable';

export class Languages {
  static getDefaultLanguage(family: Nzoi.LanguageFamily): Nzoi.Language {
    switch (family) {
      case Nzoi.LanguageFamily.Cpp:
        return Nzoi.Language.Cpp17;

      case Nzoi.LanguageFamily.C:
        return Nzoi.Language.C11;

      case Nzoi.LanguageFamily.Csharp:
        return Nzoi.Language.Csharp;

      case Nzoi.LanguageFamily.Haskell:
        return Nzoi.Language.Haskell2010;

      case Nzoi.LanguageFamily.J:
        return Nzoi.Language.J;

      case Nzoi.LanguageFamily.Java:
        return Nzoi.Language.Java11;

      case Nzoi.LanguageFamily.Javascript:
        return Nzoi.Language.Javascript;

      case Nzoi.LanguageFamily.Python:
        return Nzoi.Language.Python38;

      case Nzoi.LanguageFamily.Ruby:
        return Nzoi.Language.Ruby22;

      default:
        assertUnreachable(family);
    }
  }

  static getFamily(language: Nzoi.Language): Nzoi.LanguageFamily {
    switch (language) {
      case Nzoi.Language.C11:
      case Nzoi.Language.C99:
        return Nzoi.LanguageFamily.C;

      case Nzoi.Language.Cpp03:
      case Nzoi.Language.Cpp11:
      case Nzoi.Language.Cpp14:
      case Nzoi.Language.Cpp17:
        return Nzoi.LanguageFamily.Cpp;

      case Nzoi.Language.Csharp:
        return Nzoi.LanguageFamily.Csharp;

      case Nzoi.Language.Haskell2010:
        return Nzoi.LanguageFamily.Haskell;

      case Nzoi.Language.J:
        return Nzoi.LanguageFamily.J;

      case Nzoi.Language.Java6:
      case Nzoi.Language.Java11:
        return Nzoi.LanguageFamily.Java;

      case Nzoi.Language.Javascript:
        return Nzoi.LanguageFamily.Javascript;

      case Nzoi.Language.Python27:
      case Nzoi.Language.Python34:
      case Nzoi.Language.Python36PyPy:
      case Nzoi.Language.Python38:
        return Nzoi.LanguageFamily.Python;

      case Nzoi.Language.Ruby22:
        return Nzoi.LanguageFamily.Ruby;

      default:
        assertUnreachable(language);
    }
  }
}
