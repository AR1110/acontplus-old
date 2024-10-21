export function showLoader() {
  const div = "<div class='loading'><span class='spinner'></span></div>";
  const loaderCss = document.getElementById('loaderCss');
  if (loaderCss) {
    loaderCss.innerHTML = div;
    loaderCss.classList.add('positionLoading');
  }

}

export function hideLoader() {
  const loading = document.querySelector('.loading');
  if (loading) {
    loading.remove();
  }

  const loaderCss = document.getElementById('loaderCss');
  if (loaderCss) {
    loaderCss.classList.remove('positionLoading');
  }
}
