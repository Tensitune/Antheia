class Command {
  constructor(name) {
    this.name = name;
    this.description = "No description provided.";
    this.category = "unsorted";
  }

  callback() {
    return "Callback is not overwritten.";
  }
}

module.exports = Command;
