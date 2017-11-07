import BaseObject from './BaseObject';

export default class Module extends BaseObject {
  type() {
    return 'Module';
  }

  isRootModule() {
    return !this.parent || this.parent.type() !== 'Module';
  }

  isRootNode() {
    return this.isRootModule();
  }

  getFileName() {
    return this.object.getFullName().replace(/[^A-Z0-9a-z_]/g, '_').toLowerCase() + '.adoc';
  }

  canBeExported() {
    return true;
  }

  generateApiDoc() {
    var result = [];

    var hasContent = false;

    result.push('=== ' + this.object.getFullName());
    for (let child of this.getSortedChildren()) {
      if (!child.canBeExported()) {
        continue;
      }

      if (child.object.getName().substr(0, 1) === '_') {
        continue;
      }

      hasContent = true;
      result.push('');
      result.push(child.generateApiDoc());
    }

    if (!hasContent) {
      return '';
    }

    return result.join("\n")
  }

  generate() {
    var result = [];

    result.push(this.object.getFullName());
    result.push('='.repeat(this.object.getFullName().length));
    result.push('');
    if (this.docs.getSummary()) {
      result.push(this.docs.getSummary())
      result.push('');
    }
    if (this.docs.getDescription()) {
      result.push(this.docs.getDescription())
      result.push('');
    }

    result.push('== Methods')
    result.push('')
    result.push(this.generateApiDoc());

    return result.join("\n")
  }
}
