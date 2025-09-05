function populateYearDropdowns() {
  const minSelect = document.getElementById('yearMin');
  const maxSelect = document.getElementById('yearMax');
  
  for (let year = 1930; year <= 2100; year++) {
    const minOption = document.createElement('option');
    minOption.value = year;
    minOption.textContent = year;
    minSelect.appendChild(minOption);
    
    const maxOption = document.createElement('option');
    maxOption.value = year;
    maxOption.textContent = year;
    maxSelect.appendChild(maxOption);
  }
}

function saveOptions() {
  const yearMin = parseInt(document.getElementById('yearMin').value);
  const yearMax = parseInt(document.getElementById('yearMax').value);
  
  chrome.storage.sync.set({
    yearMin: yearMin,
    yearMax: yearMax
  }, function() {
    const status = document.getElementById('status');
    status.style.display = 'block';
    setTimeout(function() {
      status.style.display = 'none';
    }, 1500);
  });
}

function loadOptions() {
  chrome.storage.sync.get({
    yearMin: 2010,
    yearMax: 2030
  }, function(items) {
    document.getElementById('yearMin').value = items.yearMin;
    document.getElementById('yearMax').value = items.yearMax;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  populateYearDropdowns();
  loadOptions();
  document.getElementById('save').addEventListener('click', saveOptions);
});
