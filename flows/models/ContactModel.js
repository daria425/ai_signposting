class ContactModel {
  constructor(db) {
    this.collection = db.collection("contacts");
  }
  async saveContact(contactData) {
    try {
      const contact = await this.collection.findOne({
        "WaId": contactData.WaId,
      });
      if (contact) {
        return;
      } else
        await this.collection.insertOne({
          "WaId": contactData.WaId,
          "ProfileName": contactData.ProfileName,
        });
    } catch (err) {
      console.log(err);
    }
  }

  async getContact(recipient) {
    try {
      const contact = await this.collection.findOne({ "WaId": recipient });
      return contact;
    } catch (err) {
      console.log(err);
    }
  }

  async getContactDetail(recipient, detailField) {
    const contact = await this.collection.findOne({ "WaId": recipient });
    return contact[detailField];
  }

  async updateContact(recipient, update) {
    try {
      await this.collection.findOneAndUpdate(
        { "WaId": recipient },
        { "$set": update }
      );
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = {
  ContactModel,
};
