import Configuration from './Configuration';
import BaseObject from './objects/BaseObject';
import Module from './objects/Module';
import Macro from './objects/Macro';
import FunctionObject from './objects/Function';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';

export default class DocumentationGenerator {
  constructor(options={}) {
    this.config = new Configuration(options)

    this.index = {};
  }

  writeFile(name, content) {
    const fullName = path.join(this.config.outputDir, name);
    mkdirp.sync(path.dirname(fullName));

    fs.writeFileSync(fullName, content);
  }

  generate() {
    for (let key in this.index) {
      const object = this.index[key];
      if (!object.isRootNode() || !object.isInPackage(this.config.packages)) {
        continue;
      }

      this.writeFile(object.getFileName(), object.generate());
    }
  }

  iterate(node, parent=null) {
    const name = node.getFullName();
    if (this.index.hasOwnProperty(name)) {
      return;
    }

    var object;
    switch (node.type()) {
    case 'Module':
      object = new Module(this, node);
      break;

    case 'Macro':
      object = new Macro(this, node);
      break;

    case 'Function':
      object = new FunctionObject(this, node);
      break;

    default:
      object = new BaseObject(this, node);
    }
    this.index[name] = object;

    if (parent) {
      parent.addChild(object);
    }

    const members = node.getMembers();
    for (let key in members) {
      this.iterate(members[key], object);
    }
  }

  add(root) {
    this.iterate(root);
  }
}
