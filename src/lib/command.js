class Command {
  constructor(name) {
    this.name = name;
    this.description = "No description provided.";
    this.usage = "###";
    this.category = "unsorted";
  }

  callback() {
    return "Callback not overwritten.";
  }
}

module.exports = Command;
