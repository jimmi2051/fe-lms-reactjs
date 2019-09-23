import cookie from "react-cookies";

const mandatory = () => {
  throw new Error("Storage Missing parameter!");
};

export default class Storage {
  constructor(name = mandatory()) {
    this.name = name;
  }

  set value(value) {
    const expires = new Date();
    expires.setDate(new Date().getDate() + 14);
    console.log("Set Value>>>>", value);
    console.log("Expires>>>>", expires);
    console.log("This is name>>>", this.name);
    cookie.save(this.name, value, {
      path: "/",
      expires
    });

    console.log("Cookie >>>>", cookie.loadAll());
  }

  get value() {
    return cookie.load(this.name);
  }

  destroy = next => {
    cookie.remove(this.name, { path: "/" });
    if (typeof next === "function") {
      next();
    }
  };
}
