import CommonHelpers from "./CommonHelpers.js";

window.onload = async function () {
  const errorMessage = document.getElementById("ErrorMessage");
  let loader = document.getElementById("loader");
  const helper = new CommonHelpers();
  try {
    helper.loaderShowHide(loader,'show');
    helper.populateTableBody();
    helper.loaderShowHide(loader,'hide');
  } catch (error) {
    if (errorMessage) {
      errorMessage.textContent = error.message || "An unexpected error occurred.";
      errorMessage.style.display = 'block';
    }
  } finally {
    helper.loaderShowHide(loader,'hide');
  }
};
