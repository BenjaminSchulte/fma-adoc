export default class BaseObject {
  constructor(generator, object) {
    this.generator = generator;
    this.object = object;
    this.parent = null;
    this.docs = object.getDocumentation();
    this.children = [];
    this.id = BaseObject.nextObjectId++;
  }

  getName() {
    return this.object.getFullName();
  }

  getSortedChildren() {
    return this.children.map(child => [child.getName(), child]).sort((a, b) => a[0] > b[0]).map(a => a[1]);
  }

  isInPackage(packages) {
    if (packages.length === 0) {
      return true;
    }

    if (packages.indexOf(this.getPackage()) >= 0) {
      return true;
    }

    return false;
  }

  getPackage() {
    if (this.docs.getPackage() !== null) {
      return this.docs.getPackage();
    }

    if (this.parent) {
      return this.parent.getPackage();
    }

    return null;
  }

  addChild(node) {
    node.parent = this;
    this.children.push(node);
  }

  type() {
    return 'Unknown';
  }

  canBeExported() {
    return false;
  }

  isRootNode() {
    return false;
  }

  getRelativeLink() {
    const linkName = this.getLinkName();
    return './' + this.getFileName() + (linkName ? '#' + linkName : '');
  }

  getFileName() {
    return `object${this.id}.adoc`;
  }

  getLinkName() {
    return null;
  }

  generate() {
    return '';
  }
}

BaseObject.nextObjectId = 1;
