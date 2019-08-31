import Storage from "./Storage";

class AuthStorage extends Storage {
  get loggedIn() {
    return !!this.value && !!this.value.token;
  }

  get token() {
    return this.value && this.value.token;
  }

  get userInfo() {
    return this.value && this.value.user;
  }

  get role() {
    return this.value && this.value.user.role.name;
  }
}

export default new AuthStorage("AUTH");
