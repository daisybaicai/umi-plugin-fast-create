export class StandardSwagger {
    constructor(props) {
      this.tags = [];
      this.paths = [];
      this.definitions = [];
      this.init(props);
    }
  
    init(data) {
      if (data) {
        this.tags = data.tags;
        this.paths = data.paths;
        this.definitions = data.definitions;
      }
    }
  }