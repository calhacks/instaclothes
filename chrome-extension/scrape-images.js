document.addEventListener('DOMContentLoaded', function() {
	const selectAllButtons = document.getElementById('scrape-all')
	console.log(selectAllButtons)
	selectAllButtons.addEventListener('click', function(event){
		console.log('button clicked')
		chrome.tabs.executeScript({
			code: 'let images = document.querySelectorAll("img[id^=pImage]"); console.log(images)'
		})
	})
});