import { async } from 'regenerator-runtime';
import { API_URL, NoOfSearchResultPerPage, KEY } from './config';
import { AJAX } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    pageNo: 1,
    searchResultPerPage: NoOfSearchResultPerPage,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);
    console.log(data);

    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}/?search=${query}&key=${KEY}`);
    console.log(data);
    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.pageNo = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.pageNo) {
  try {
    state.search.pageNo = page;
    const start = (page - 1) * NoOfSearchResultPerPage;
    const end = page * NoOfSearchResultPerPage; // from confog file
    return state.search.result.slice(start, end);
  } catch (err) {
    throw err;
  }
};

export const updateRecipe = function (newServings) {
  try {
    state.recipe.ingredients.forEach(ingredients => {
      if (ingredients.quantity !== null) {
        ingredients.quantity = (
          +ingredients.quantity * // very importent infredients json form main hain or un ko + sign sy integer bnana ha pehly
          (newServings / state.recipe.servings)
        ).toFixed(2); // very important ziada decimal position hon to un sy error ata ha q k javascript ak had tak devision krta ha.
      }
    });
    state.recipe.servings = newServings;
  } catch (err) {
    throw err;
  }
};

const persistsBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  if (!state.recipe.bookmarked) {
    state.bookmarks.push(recipe);
  }
  // Add current recipe as bookmark
  if (state.recipe.id === recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistsBookmarks();
};

export const deleteBoookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistsBookmarks();
};

export const init = function () {
  const savedBookmarks = localStorage.getItem('bookmarks');
  if (savedBookmarks) {
    state.bookmarks = JSON.parse(savedBookmarks);
  }
};

export const uploadNewRecipe = async function (newRecipe) {
  try {
    const data = Object.entries(newRecipe);
    console.log(data);
    const ingredients = data
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) {
          throw new Error(
            'Invalid Format!. Please see the place holder where you enter your recipe ingredients.'
          );
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    const resData = await AJAX(`${API_URL}/?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(resData);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
