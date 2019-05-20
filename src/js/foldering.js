const folderingEventListener = (e) => {
  const projectColumn = e.target.closest('.project-column');
  const columnFoldingToggle = projectColumn.querySelector('.column-folding-toggle');
  if(projectColumn.classList.contains('folded')) {
    projectColumn.classList.remove('folded');
    projectColumn.classList.add('unfolded');
    setFoldIcon(columnFoldingToggle);
  } else {
    projectColumn.classList.remove('unfolded');
    projectColumn.classList.add('folded');
    setFoldUpIcon(columnFoldingToggle);
  }
}

const foldIconPath = '<path fill-rule="evenodd" d="M7 9l3 3H8v3H6v-3H4l3-3zm3-6H8V0H6v3H4l3 3 3-3zm4 2c0-.55-.45-1-1-1h-2.5l-1 1h3l-2 2h-7l-2-2h3l-1-1H1c-.55 0-1 .45-1 1l2.5 2.5L0 10c0 .55.45 1 1 1h2.5l1-1h-3l2-2h7l2 2h-3l1 1H13c.55 0 1-.45 1-1l-2.5-2.5L14 5z"></path>';
const foldUpIconPath = '<path fill-rule="evenodd" d="M10 6L7 3 4 6h2v6h2V6h2zm4 0c0-.55-.45-1-1-1h-2.5l1 1h1l-2 2H9v1h1.5l2 2H9v1h4c.55 0 1-.45 1-1l-2.5-2.5L14 6zM3.5 8H5v1H3.5l-2 2H5v1H1c-.55 0-1-.45-1-1l2.5-2.5L0 6c0-.55.45-1 1-1h2.5l-1 1h-1l2 2z"></path>';

const createSvg = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('octicon');
  svg.setAttribute('width', '14');
  svg.setAttribute('height', '16');
  setFoldIcon(svg);
  return svg;
}

const setFoldIcon = (svg) => {
  svg.innerHTML = foldIconPath;
  svg.classList.remove('octicon-fold-up');
  svg.classList.add('octicon-fold');
  return svg;
}

const setFoldUpIcon = (svg) => {
  svg.innerHTML = foldUpIconPath;
  svg.classList.remove('octicon-fold');
  svg.classList.add('octicon-fold-up');
  return svg;
}

const generateToggleButton = () => {
  const toggleButton = createSvg();
  toggleButton.classList.add('column-folding-toggle');
  toggleButton.addEventListener('click', folderingEventListener);
  return toggleButton;
}

(() => {
  const columnHeaders = document.querySelectorAll('.project-column > .js-details-container > .hide-sm > h4');
  columnHeaders.forEach(columnHeader => {
    const toggleButton = generateToggleButton();
    columnHeader.insertBefore(toggleButton, columnHeader.firstChild);
  });
})();
