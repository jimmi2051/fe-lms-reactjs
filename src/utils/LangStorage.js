import Storage from "./Storage";

class LangStorage extends Storage {
  get getLang() {
    return this.value && this.value.language;
  }
}

export default new LangStorage("LANGUAGE");
