
// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  var d = document.getElementsByClassName('CodeMirror-lines')[0].outerText;
  var dd = d.split('\n');
  var dx = dd.filter(r => isNaN(r));

  var content = dx.join('\n');
  var chunks = document.getElementsByClassName('CodeMirror-lines')[0].baseURI.split('/');
  var folder_name = chunks[chunks.length-2];

  var path = "leetcode/" + folder_name + "/Solution.java";

  var gh = new GitHub({token: '<ENTER THE TOKEN>' });
  var repo = gh.getRepo('<USERNAME>', '<REPO_NAME>');
  var erd = repo.writeFile("main", path, content, "leetcode problem addition")
            .then((data, err) => {
              console.log(err);
            });

  // chrome.storage.sync.get("color", ({ color }) => {
  //   document.body.style.backgroundColor = color;
  // });
}