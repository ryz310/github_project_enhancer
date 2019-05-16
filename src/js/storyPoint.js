const toArray = (nodes) => {
  return [].map.call(nodes, node => node);
}

const getStoryPointLabels = (column, pattern) => {
  const labels = toArray(column.querySelectorAll('.issue-card-label'));
  return labels.filter(label => pattern.test(label.innerText));
}

const findOrCreateStoryPointConter = (column) => {
  const storyPointConter = column.querySelector('.js-column-story-point-count');
  if (storyPointConter) {
    return storyPointConter;
  } else {
    const newStoryPointCounter = document.createElement('span');
    newStoryPointCounter.classList.add('Counter');
    newStoryPointCounter.classList.add('Counter--green-light');
    newStoryPointCounter.classList.add('js-column-story-point-count');
    const columnHeader = column.querySelector('.js-details-container > .hide-sm > h4');
    const cardCounter = column.querySelector('.js-column-card-count');
    columnHeader.insertBefore(newStoryPointCounter, cardCounter.nextSibling);
    return newStoryPointCounter;
  }
}

const setStoryPoint = (column, points) => {
  const storyPointConter = findOrCreateStoryPointConter(column);
  storyPointConter.textContent = points + 'pt'
}

const calculateStoryPoints = () => {
  const columns = document.querySelectorAll('.project-column');
  columns.forEach(column => {
    const storyPointLabels = getStoryPointLabels(column, /\d+pt/)
    // if (storyPointLabels.length === 0) { return; }
    const storyPoints = storyPointLabels.reduce((total, storyPointLabel) => {
      return total + parseInt(/\d+/.exec(storyPointLabel.innerText)[0]);
    }, 0)
    setStoryPoint(column, storyPoints);
  });
}

const issueCards = document.querySelectorAll('.issue-card');
issueCards.forEach(issueCard => {
  issueCard.ondragend = () => { calculateStoryPoints() };
})
