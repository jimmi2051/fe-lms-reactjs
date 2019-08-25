import Storage from "./Storage";

class AuthStorage extends Storage {
  get loggedIn() {
    return !!this.value && !!this.value.token;
  }

  get token() {
    return this.value && this.value.token;
  }

  get organizationId() {
    return this.value && this.value.organizationId;
  }

  get status() {
    return this.value && this.value.status;
  }

  get role() {
    return this.value && this.value.role;
  }

  get plan() {
    return this.value && this.value.plan;
  }

  get username() {
    return this.value && this.value.username;
  }
  get isAuthen() {
    return this.value && this.value.isAuthen;
  }
  get isSuperAdmin(){
    return this.value && this.value.isSuperAdmin;
  }
}

export default new AuthStorage("AUTH");
