let yearRange = { min: 2010, max: 2030 };
let yearPattern = '';
let yearRegex = null;
let isFilterActive = true;
let processedComments = new Set();

function init() {
  chrome.storage.sync.get(['yearMin', 'yearMax'], function(data) {
    yearRange.min = data.yearMin || 2010;
    yearRange.max = data.yearMax || 2030;
    
    updateYearPattern();
    
    setupObservers();
  });
}

function updateYearPattern() {
  let years = [];
  for (let i = yearRange.min; i <= yearRange.max; i++) {
    years.push(i);
  }
  yearPattern = years.join('|');
  yearRegex = new RegExp('\\b(' + yearPattern + ')\\b', 'g');
}

function filterComment(comment) {
  const commentId = comment.getAttribute('comment-id') || 
                   comment.getAttribute('data-comment-id') || 
                   comment.querySelector('#author-text')?.innerText + 
                   comment.querySelector('#content-text')?.innerText.substring(0, 20); // bzvz
  
  if (processedComments.has(commentId)) return;
  processedComments.add(commentId);
  
  const contentElement = comment.querySelector('#content-text, #content');
  if (!contentElement) return;
  
  const commentText = contentElement.innerText || '';
  
  if (yearRegex.test(commentText)) {
    comment.style.display = 'none';
  }
}

function filterVisibleComments() {
  const comments = document.querySelectorAll('ytd-comment-thread-renderer, ytd-comment-renderer');
  comments.forEach(filterComment);
}

function setupObservers() {
  const commentObserver = new MutationObserver(function(mutations) {
    if (!isFilterActive) return;
    isFilterActive = false;
    setTimeout(() => {
      filterVisibleComments();
      isFilterActive = true;
    }, 200);
  });
  
  commentObserver.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  filterVisibleComments();
}

init();

chrome.storage.onChanged.addListener(function(changes) {
  if (changes.yearMin || changes.yearMax) {
    if (changes.yearMin) yearRange.min = changes.yearMin.newValue;
    if (changes.yearMax) yearRange.max = changes.yearMax.newValue;
    
    updateYearPattern();
    processedComments.clear();
    filterVisibleComments();
  }
});
