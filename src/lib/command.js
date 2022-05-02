const { Constants } = require("eris");

class Command {
  constructor(name) {
    this.name = name;
    this.description = "No description provided.";
    this.category = "unsorted";
    this.restrictions = [];
  }

  addRestriction(restriction) {
    if (Constants.Permissions[restriction]) {
      this.restrictions.push(restriction);
    } else {
      console.log(`There's no '${restriction}' permission in constants. Failed to add to '${this.name}' restrictions.`);
    }
  }
  checkRestrictions(member) {
    return this.restrictions.every(permission => member.permissions.has(permission));
  }

  callback() {
    return "Callback is not overwritten.";
  }
}

module.exports = Command;
