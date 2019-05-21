const save_options = () => {
  const labelPattern = document.getElementById('labelPattern').value;
  chrome.storage.sync.set(
    { labelPattern },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('statusDiv');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
  });
}

const restore_options = () => {
  chrome.storage.sync.get(
    { labelPattern: '\d+(pt|pts)' }, 
    (items) => {
      document.getElementById('labelPattern').value = items.labelPattern;
    }
  );
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('labelPattern').addEventListener('input', save_options);