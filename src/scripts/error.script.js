class ErrorScript {
  constructor() {}

  handleScriptError(error, code) {
    console.log(error);
    process.exit(code);
  }
}

export default new ErrorScript();
