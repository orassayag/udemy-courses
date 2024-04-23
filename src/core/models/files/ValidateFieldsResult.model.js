class ValidateFieldsResultModel {
  constructor(data) {
    const { status, details } = data;
    this.status = status;
    this.details = details;
  }
}

export default ValidateFieldsResultModel;
