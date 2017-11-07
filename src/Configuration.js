export default class Configuration {
  constructor(options) {
    this.outputDir = 'docs';
    this.packages = []

    Object.assign(this, options);
  }
}
