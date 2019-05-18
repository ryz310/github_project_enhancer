const toArray = (nodes) => {
  return [].map.call(nodes, node => node);
}

const getProjectColumns = () => {
  return document.querySelectorAll('.project-column');
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
    console.debug('create a new story point counter');
    return newStoryPointCounter;
  }
}

const setStoryPoint = (column, points) => {
  const storyPointConter = findOrCreateStoryPointConter(column);
  storyPointConter.textContent = points + 'pt'
}

const calculateStoryPoints = (column, pattern) => {
  const storyPointLabels = getStoryPointLabels(column, pattern);
  const storyPoints = storyPointLabels.reduce((total, storyPointLabel) => {
    return total + parseInt(pattern.exec(storyPointLabel.innerText)[1]);
  }, 0)
  setStoryPoint(column, storyPoints);
}

const calculateStoryPointsForEachColumns = (pattern) => {
  getProjectColumns().forEach(column => calculateStoryPoints(column, pattern));
  console.debug('Calculated story points for each columns!')
}

const initialize = (pattern) => {
  const issueCards = document.querySelectorAll('.issue-card');
  issueCards.forEach(issueCard => {
    issueCard.ondragend = (e) => {
      console.debug('dragend!')
      console.debug(e.target);
    // NONE: Re-calculate all column story point because it cannot to detect
    //       drag & drop beginning and end.
      calculateStoryPointsForEachColumns(pattern);
    };
  });
  calculateStoryPointsForEachColumns(pattern);
}

// GitHub Project columns are loaded as async.
// This function detect it finished.
const detectFinishToLoadCards = async (column) => {
  return new Promise(resolve => {
    const detect = (targetColumn) => {
      if (targetColumn.querySelector('.issue-card')) {
        return resolve(true);
      } else {
        console.debug('run setTimeout in detectFinishToLoadCards()');
        setTimeout(() => detect(column), 100);
      }
    }
    return detect(column);
  });
}

(async () => {
  const projectColumns = toArray(getProjectColumns());
  await Promise.all(
    projectColumns.map(column => detectFinishToLoadCards(column))
  );
  console.debug('finished!');
  initialize(/(\d+)pt/);
  return;
})();
