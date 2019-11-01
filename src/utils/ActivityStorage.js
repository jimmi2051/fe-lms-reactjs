import Storage from "./Storage";

class ActivityStorage extends Storage {
    get activityUsers() {
        return this.value && this.value.activityusers;
    }
}

export default new ActivityStorage("ACTIVITY");
