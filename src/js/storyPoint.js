const toArray = (nodes) => {
  return [].map.call(nodes, node => node);
}

const getProjectColumns = () => {
  return document.querySelectorAll('.project-column');
}

const getStoryPointLabels = (column, pattern) => {
  const labels = toArray(column.querySelectorAll('.IssueLabel'));
  return labels.filter(label => pattern.test(label.innerText));
}

const findOrCreateStoryPointCounter = (column) => {
  const storyPointCounter = column.querySelector('.js-column-story-point-count');
  if (storyPointCounter) {
    return storyPointCounter;
  } else {
    const newStoryPointCounter = document.createElement('span');
    newStoryPointCounter.classList.add('Counter');
    newStoryPointCounter.classList.add('Counter--green-light');
    newStoryPointCounter.classList.add('js-column-story-point-count');
    const columnHeader = column.querySelector('.js-details-container > .hide-sm');
    const cardCounter = column.querySelector('.js-column-card-count');
    columnHeader.insertBefore(newStoryPointCounter, cardCounter.nextSibling);
    return newStoryPointCounter;
  }
}

const setStoryPoint = (column, points) => {
  const storyPointCounter = findOrCreateStoryPointCounter(column);
  const suffix = points === 1 ? 'pt' : 'pts';
  storyPointCounter.textContent = points + suffix;
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
}

// Auto calculate story points on change number of story point labels.
const setAutoCalculation = (pattern) => {
  const detect = (prev) => {
    const current = getStoryPointLabels(document, pattern).length;
    if (prev !== current) {
      calculateStoryPointsForEachColumns(pattern);
    }
    setTimeout(() => detect(current), 1000);
  }
  detect(0);
}

// GitHub Project columns are loaded as async.
// This function detect it finished.
const detectFinishToLoadCards = async (column) => {
  return new Promise(resolve => {
    let attempts = 0;
    const detect = (targetColumn) => {
      if (targetColumn.querySelector('.issue-card') || attempts >= 10) {
        return resolve(true);
      } else {
        attempts++;
        setTimeout(() => detect(targetColumn), 100);
      }
    }
    return detect(column);
  });
}

const initialize = (pattern) => {
  const columnContainer = document.querySelector('.project-columns-container');
  const calculate = () => { calculateStoryPointsForEachColumns(pattern) };
  columnContainer.ondragend = calculate;
  columnContainer.onclick = calculate;
  setAutoCalculation(pattern);
}

const getLabelPattern = async () => {
  const defaultPattern = '(\\d+)pts?';
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      { labelPattern: defaultPattern },
      (items) => { resolve(new RegExp(items.labelPattern)) }
    )
  });
}

(async () => {
  const pattern = await getLabelPattern();
  const projectColumns = toArray(getProjectColumns());
  await Promise.all(
    projectColumns.map(column => detectFinishToLoadCards(column))
  );
  // Detect story point labels. If does not detect labels, not to initialize it.
  const numOfPointLabels = projectColumns.reduce((total, column) => {
    return total + getStoryPointLabels(column, pattern).length;
  }, 0);
  if (numOfPointLabels > 0) {
    initialize(pattern);
  }
  return;
})();
