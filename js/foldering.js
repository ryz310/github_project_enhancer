const folderingEventListener = (e) => {
  const projectColumn = e.target.closest('.project-column');
  if(projectColumn.classList.contains('folded')) {
    projectColumn.classList.remove('folded');
    projectColumn.classList.add('unfolded');
    e.target.textContent = 'close';
  } else {
    projectColumn.classList.remove('unfolded');
    projectColumn.classList.add('folded');
    e.target.textContent = 'open';
  }
}

const generateToggleButton = () => {
  const toggleButton = document.createElement('div');
  toggleButton.className = 'column-folding-toggle';
  toggleButton.textContent = 'close';
  toggleButton.addEventListener('click', folderingEventListener);
  return toggleButton;
}

const columnHeaders = document.querySelectorAll('.project-column>.js-details-container>.hide-sm');
columnHeaders.forEach(columnHeader => {
  const toggleButton = generateToggleButton();
  columnHeader.appendChild(toggleButton);
});
