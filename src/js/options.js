const save_options = () => {
  const labelPattern = document.getElementById('labelPattern').value;
  const validation_result = validate_pattern(labelPattern);
  if(!validation_result.passed) {
    const status = document.getElementById('statusDiv');
    status.textContent = validation_result.messages.join('\r\n');
    return;
  }

  chrome.storage.sync.set(
    { labelPattern },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('statusDiv');
      status.textContent = 'Options saved.';
      setTimeout(() => { status.textContent = '' }, 750);
    }
  );
}

const restore_options = () => {
  const defaultPattern = '(\\d+)pts?';
  chrome.storage.sync.get(
    { labelPattern: defaultPattern },
    (items) => {
      document.getElementById('labelPattern').value = items.labelPattern;
    }
  );
}

const validate_pattern = (pattern) => {
  const result = { messages: [] };
  const number_pattern = pattern.match(/\(\\d\+\)/);
  if(!number_pattern) {
    result.messages.push('Pattern must contains "(\\d+)".')
  }
  result.passed = result.messages.length === 0 ? true : false;
  return result;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('labelPattern').addEventListener('input', save_options);
