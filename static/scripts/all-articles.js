// Tags
const searchTags = [];

// Individual elements
let parentElement = null;
const tagLists = Array.from(document.querySelectorAll("article .tags"));

// Search Functions
/** This function allows the website to read tags that are entered into the search bar by the user by receiving string input via URLSearchParams.*/
function initializeSearch(newParentElement) {
  console.log("initializeSearch called")
  const params = new URLSearchParams(window.location.search);
  if (newParentElement === null) {
    console.error(
      "Cannot insert tags, parent element is null",
      params.getAll("tag")
    );
    return;
  }

  parentElement = newParentElement;
  for (const tag of params.getAll("tag")) {
    addSearchTerm(tag);
  }
}

/** This function hides articles that do not have the a tag that matches the user's input by removing any article with the "hidden" tag from the page.*/
function hideArticles() {
  console.log("hideArticles called")
  if (searchTags.length === 0) {
    for (const article of document.querySelectorAll("article")) {
      article.classList.remove("hidden");
    }
    return;
  }

  const articlesWithTags = [];
  for (const tag of searchTags) {
    articlesWithTags.push(...findArticlesWithTag(tag));
  }

  /**
   * use querySelectorAll to select all articles
   * iterate over them in a for loop
   * check if articlesWithTags array does not include the current article being iterated over,
   * then add "hidden" to that article's classList
   * else, remove "hidden" from that article's classList
   */
  // write your code here
  for (const article of document.querySelectorAll("article")) {
    if (!articlesWithTags.includes(article)) {
      article.classList.add("hidden")
    } else {
      article.classList.remove("hidden")
    }
  }
}

/**
 * Creates a clickable tag button for a given search term (text). When clicked,
 * the button will remove the corresponding tag from both the DOM and the searchTags array.
 * This function also calls hideArticles to update the articles displayed after removal.
 */
/** This function creates a "tag" object by first creating a button element and then adding a tag to it.*/
function createTag(text) {
  console.log("createTag called")
  /**
   * create a new element called button
   * add the class "tag" to its classList
   * set the button's textContent property to text (the passed in argument)
   */
  // write your code here
  const button = document.createElement("button")
  button.classList.add("tag")
  button.textContent = text
  /** This function works by simply removing the clickable tag button when it is clicked.*/
  function remove() {
    console.log("remove called")
    button.remove();
    const index = searchTags.indexOf(text);
    if (index !== -1) {
      searchTags.splice(index, 1);
    }

    hideArticles();
  }

  /**
   * add a click event listener to the button, and set the listener to the remove function.
   * return the button element 
   */
  // write your code here
  button.addEventListener("click", remove)
  return button
}

/** This function takes an array of article tags and searches through them by first setting the tag string to lowercase before checking for matches within each array element.*/
function findArticlesWithTag(phrase) {
  console.log("findArticlesWithTag called")
  const articles = [];
  const sanitizedPhrase = phrase.toLowerCase().trim();
  for (const tl of tagLists) {
    const tags = Array.from(tl.querySelectorAll("li"));
    for (const tag of tags) {
      if (tag.textContent.toLowerCase().trim() === sanitizedPhrase) {
        articles.push(tl.parentElement);
        break;
      }
    }
  }

  return articles;
}

/** This function adds the user-inputted tag string into the searchTags array. After that, it hides articles that don't match any tags in the array. */
function addSearchTerm(text) {
  console.log("addSearchTerm called")
  parentElement.appendChild(createTag(text));
  searchTags.push(text);
  hideArticles();
}

// Handlers
/** This function processes user input into the addSearchTerm function. It gets called after every user input in the search bar.
 * Once the Enter key is pressed, the input string resets within the search bar.
 */
function onSearch(event) {
  console.log("onSearch has been called")
  const input = event.currentTarget;
  /**
   * If event.key equals "Enter":
   * call addSearchTerm and pass the input element's value
   * set input value to an empty string
   */
  // write your code here
  if (event.key === "Enter") {
    addSearchTerm(input.value)
    input.value = ""
  }
}

// Main function
/** 
 * This function allows the website to uilize the onSearch function.
*/
function main() {
  console.log("main called")
  initializeSearch(document.querySelector("#searched-tags"));

  document
    .querySelector("input[type=search]")
    .addEventListener("keypress", onSearch);
}

// Execute main function
main();

/**
 * Order of execution for each event:
 * Pressing Enter ("Pressing enter to search for a tag"): onSearch -> addSearchTerm -> createTag -> hideArticles -> findArticlesWithTag
 * Clicking to Remove a Tag ("Clicking on the search tag to remove it"): remove -> hideArticles
 * Loading the Page ("with a tag in the URL search params"): main -> initializeSearch -> addSearchTerm -> createTag -> hideArticles -> findArticlesWithTag
 */