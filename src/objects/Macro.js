import BaseObject from './BaseObject';

export default class Macro extends BaseObject {
  type() {
    return 'Macro';
  }

  canBeExported() {
    return true;
  }

  getLinkName() {
    return this.object.getFullName().replace(/\?$/g, '__quest').replace(/[^a-zA-Z0-9_]+/g, '-').toLowerCase()
  }

  generateApiDoc() {
    var result = [];

    var headline = this.object.getFullName();
    var params = this.docs.getParameters().map(param => {
      if (param.defaultValue) {
        return param.name + '=' + param.defaultValue;
      } else {
        return param.name;
      }
    }).join(', ');

    if (params.length) {
      headline += `(${params})`
    }

    result.push('[[' + this.getLinkName() + ']]')
    result.push('==== `' + headline + '`');
    for (let param of this.docs.getParameters()) {
      result.push('* `' + param.name + '` ' + param.text)
    }

    if (this.docs.getSummary()) {
      result.push('')
      result.push(this.docs.getSummary())
    }

    if (this.docs.getDescription()) {
      result.push('')
      result.push(this.docs.getDescription())
    }

    return result.join("\n")
  }
}
