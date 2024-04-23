class TextUtils {
  constructor() {}

  replaceCharacter(text, targetCharacter, replaceCharacter) {
    const regex = new RegExp(targetCharacter, 'g');
    return text.replace(regex, replaceCharacter);
  }
}

export default new TextUtils();
