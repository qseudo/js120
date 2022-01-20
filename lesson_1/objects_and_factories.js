function createBook(title, author, read = false) {
  return {
    title,
    author,
    read,

    getDescription() {
      let readStatus = this.read ? 'I have read it' : `I haven't read it`;
      return `${this.title} was written by ${this.author}. ${readStatus}.`;
    },

    readBook() {
      this.read = true;
    }
  };
}

let book1 = createBook('Mythos', 'Stephen Fry');
let book2 = createBook('Me Talk Pretty One Day', 'David Sedaris');
let book3 = createBook(`Aunts Aren't Gentlemen`, `PG Wodehouse`);

console.log(book1.getDescription());
console.log(book2.getDescription());
console.log(book3.getDescription());
