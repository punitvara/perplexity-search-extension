const questionFormats = [
  "What is %s?",
  "Explain %s.",
  "How does %s work?"
];

// Function to create context menus
function createContextMenus() {
  // Clear existing menu items
  chrome.contextMenus.removeAll(() => {
    // Create the default search menu item
    chrome.contextMenus.create({
      id: "searchPerplexity",
      title: "Search Perplexity for \"%s\"",
      contexts: ["selection"]
    });

    // Create formatted question menu items and store them
    const formattedQuestions = questionFormats.map((format, index) => {
      chrome.contextMenus.create({
        id: `formatQuestion${index}`,
        title: format,
        contexts: ["selection"]
      });
      return format;
    });

    // Store formatted questions in chrome.storage
    chrome.storage.local.set({ formattedQuestions });

    // Add donate menu item
    chrome.contextMenus.create({
      id: "donate",
      title: "Buy me a coffee",
      contexts: ["all"]
    });
  });
}

// Create menus when extension is installed
chrome.runtime.onInstalled.addListener(createContextMenus);

// Recreate menus when service worker starts
createContextMenus();

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("formatQuestion")) {
    const formatIndex = parseInt(info.menuItemId.replace("formatQuestion", ""), 10);
    const selectedText = info.selectionText;

    // Get formatted questions from storage
    chrome.storage.local.get(['formattedQuestions'], (result) => {
      if (result.formattedQuestions && result.formattedQuestions[formatIndex]) {
        const formattedQuestion = result.formattedQuestions[formatIndex].replace("%s", selectedText);
        const searchUrl = `https://www.perplexity.ai/?q=${encodeURIComponent(formattedQuestion)}`;
        chrome.tabs.create({ url: searchUrl });
      } else {
        console.error(`Could not find format for index: ${formatIndex}`);
      }
    });
  } else if (info.menuItemId === "searchPerplexity") {
    const searchUrl = `https://www.perplexity.ai/?q=${encodeURIComponent(info.selectionText)}`;
    chrome.tabs.create({ url: searchUrl });
  } else if (info.menuItemId === "donate") {
    const donateUrl = "https://www.buymeacoffee.com/punitvara";
    chrome.tabs.create({ url: donateUrl });
  }
});
